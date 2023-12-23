import {sha256, notify} from "./utils.js";
import vCardsJS from "vcards-js"
// import { strings } from '@helia/strings'

import { json } from '@helia/json';

import {
    myAddressBook,
    ipfs,
    selectedAddr,
    selectedTab,
    remotePinner,
    qrCodeData,
    qrCodeOpen,
    dbMyDal
} from "./stores.js";
// import {createHelia} from "helia";
//
// const helia = await createHelia();

let _ipfs;
ipfs.subscribe((value) => {
    _ipfs = value
})

let _remotePinner;
remotePinner.subscribe((value) => {
    _remotePinner = value
})


let _selectedTab;
selectedTab.subscribe((value) => {
    _selectedTab = value
})

let _selectedAddr;
selectedAddr.subscribe((value) => {
    _selectedAddr = value
})

let _myAddressBook;
myAddressBook.subscribe((value) => {
    _myAddressBook = value
})

let _dbMyDal;
dbMyDal.subscribe((value) => {
    _dbMyDal = value
})

// let _contacts;
// contacts.subscribe((value) => {
//     _contacts = value
// })

let _qrCodeData;
qrCodeData.subscribe((value) => {
    _qrCodeData = value
})

let _qrCodeOpen;
qrCodeOpen.subscribe((value) => {
    _qrCodeOpen = value
})

/**
 * Loading a contact from memory into the contactForm
 * @param id
 * @returns {Promise<void>}
 */
export async function loadContact(id) {
    if (!myAddressBook || !_myAddressBook) return;
    const address = _myAddressBook.find(obj => obj.id === id) //|| await _myAddressBook.get(hash) || {}
    _selectedAddr = address
    if(!address) return //do not set undefined here
    selectedAddr.set(_selectedAddr)
    selectedTab.set(1)
    console.log("loading contact",id)
}


export async function addContact() {

    const vCard = vCardsJS(); //https://github.com/enesser/vCards-js
    _selectedAddr.id = new Date().getTime()+"-"+(Math.random()*100000000)
    if(_selectedAddr.firstName) vCard.firstName = _selectedAddr.firstName;
    if(_selectedAddr.middleName) vCard.middleName = _selectedAddr.middleName;
    if(_selectedAddr.lastName) vCard.lastName = _selectedAddr.lastName;
    if(_selectedAddr.organization) vCard.organization =_selectedAddr.organization;
    // vCard.photo.attachFromUrl('https://avatars2.githubusercontent.com/u/5659221?v=3&s=460', 'JPEG');
    if(_selectedAddr.workPhone) vCard.workPhone = _selectedAddr.workPhone;
    if(_selectedAddr.birthday) vCard.birthday = _selectedAddr.birthday
    if(_selectedAddr.firstName) vCard.title = _selectedAddr.title
    if(_selectedAddr.firstName) vCard.url = _selectedAddr.url
    if(_selectedAddr.firstName) vCard.note = _selectedAddr.note

    vCard.homeAddress.label = 'Home Address';
    if(_selectedAddr.street) vCard.homeAddress.street =_selectedAddr.street;
    if(_selectedAddr.city) vCard.homeAddress.city =_selectedAddr.city;
    if(_selectedAddr.stateProvince) vCard.homeAddress.stateProvince =_selectedAddr.stateProvince;
    if(_selectedAddr.postalCode) vCard.homeAddress.postalCode =_selectedAddr.postalCode;
    if(_selectedAddr.countryRegion) vCard.homeAddress.countryRegion =_selectedAddr.countryRegion;

    let hash = "please add vcard to ipfs"


    if(_selectedAddr.own){ //add to IPFS and publish to IPNS
        // const s = strings(_ipfs)
        console.log("_ipfs",_ipfs)
        // const myImmutableAddress = await s.add('hello world')
        const j = json(_ipfs);
        const cid = await j.add({firstName:_selectedAddr.firstName});
        console.log("cid--->ipfs",cid.toString())
7
        // console.log("addPinResult",addPinResult)
        // const fs = unixfs(_ipfs)
        // const encoder = new TextEncoder()
        // const cid = await fs.addBytes(encoder.encode(vCard.getFormattedString()))
        // console.log('Added file:', cid.toString())
    }
    _myAddressBook.push(_selectedAddr)
    myAddressBook.set(_myAddressBook) //trigger reactivity
    console.log(_myAddressBook)
    console.log(vCard.getFormattedString());

    selectedAddr.set({})
    selectedTab.set(0)
    notify(`Contact added successfully! ${hash}`);
}

export async function updateContact() {
    let deletedHash, updateHash
    const id = await sha256(JSON.stringify(_selectedAddress));
    if(_selectedAddress.own){
        deletedHash = await _dbMyDal.del(_selectedAddress.id);
        updateHash = await _dbMyDal.put(_selectedAddress)
    }
    else{
        deletedHash = await _myAddressBook.del(_selectedAddress._id);
        updateHash = await _myAddressBook.put(_selectedAddress)
    }
    notify(`Contact added successfully! ${updateHash}`)
    selectedAddress.set({})
    selectedTab.set(0)
    return {deletedHash,updateHash}
}

export async function deleteContact() {
    let deletedHash;
    if(_selectedAddress.own)
        deletedHash = await _dbMyDal.del(_selectedAddress.id)
    else
        deletedHash = await _myAddressBook.del(_selectedAddress.id)
    notify(`Contact deleted successfully! ${deletedHash}`)
    selectedAddress.set({})
    selectedTab.set(0)
    return {deletedHash}
}

export async function generateQRForAddress(contact) {
    qrCodeData.set(contact)
    qrCodeOpen.set(true)
}