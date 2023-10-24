import {sha256,notify} from "./utils.js";
import {
    contacts,
    orbitDB,
    ipfs,
    selectedAddress,
    selectedTab,
    qrCodeData,
    qrCodeOpen,
    dbMyDal
} from "./stores.js";


let _ipfs;
ipfs.subscribe((value) => {
    _ipfs = value
})

let _selectedTab;
selectedTab.subscribe((value) => {
    _selectedTab = value
})

let _selectedAddress;
selectedAddress.subscribe((value) => {
    _selectedAddress = value
})

let _orbitDB;
orbitDB.subscribe((value) => {
    _orbitDB = value
})

let _dbMyDal;
dbMyDal.subscribe((value) => {
    _dbMyDal = value
})

let _contacts;
contacts.subscribe((value) => {
    _contacts = value
})

let _qrCodeData;
qrCodeData.subscribe((value) => {
    _qrCodeData = value
})

let _qrCodeOpen;
qrCodeOpen.subscribe((value) => {
    _qrCodeOpen = value
})

export async function loadContact(hash) {
    if (!orbitDB || !_orbitDB) return;
    const address = _contacts.find(obj => obj.id === hash) || await _orbitDB.get(hash) || {}
    selectedAddress.set(address)
    selectedTab.set(1)
}


export async function addContact() {
    const _id = await sha256(JSON.stringify(_selectedAddress));
    _selectedAddress.id = _id;
    let hash
    if(_selectedAddress.own){
        const all = await _dbMyDal.all()
        all.map((address)=>_dbMyDal.del(address.value.id)) //dropping all other data for now, maybe we allow more then one address later
        hash = await _dbMyDal.put(_selectedAddress);
    }
    else
        hash = await _orbitDB.put(_selectedAddress);
    selectedAddress.set({})
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
        deletedHash = await _orbitDB.del(_selectedAddress._id);
        updateHash = await _orbitDB.put(_selectedAddress)
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
        deletedHash = await _orbitDB.del(_selectedAddress.id)
    notify(`Contact deleted successfully! ${deletedHash}`)
    selectedAddress.set({})
    selectedTab.set(0)
    return {deletedHash}
}

export async function generateQRForAddress(contact) {
    qrCodeData.set(contact)
    qrCodeOpen.set(true)
}