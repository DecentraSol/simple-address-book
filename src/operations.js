import {sha256,notify} from "./utils.js";
import {contacts, orbitDB, ipfs, selectedAddress, selectedTab, qrCodeData, qrCodeOpen} from "./stores.js";
import {initOrbitDB} from "./init.js"

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
/**
 * loads an address by its hash from the contacts array in svelte store (if available) or gets it from orbitdb
 * @param hash
 * @returns {Promise<void>}
 */
export async function loadContact(hash) {
    if (!orbitDB || !_orbitDB) return;
    const address = _contacts.find(obj => obj.id === hash) || await _orbitDB.get(hash) || {}
    selectedAddress.set(address)
    selectedTab.set(1)
}

/**
 * Add a contact to orbitDB, generate a sha256 hash for the address as key
 * @param address
 * @returns {Promise<void>}
 */
export async function addContact() {
    const id = await sha256(JSON.stringify(_selectedAddress));
    _selectedAddress.id = id;
    const hash = await _orbitDB.put(id, _selectedAddress);
    selectedAddress.set({})
    selectedTab.set(0)
    notify(`Contact added successfully! ${hash}`);
}

/**
 * Update a contact by deleting it and adding a new one.
 * If a contact is given as parameter use it instead of the selectedAddress in store. (this is when creating a qr-code)
 * @param contact
 * @param selectedAddress
 * @returns {Promise<{updateHash: *, deletedHash: *}>}
 */
export async function updateContact(contact) {
    const contact4Update = contact?contact:_selectedAddress
    const deletedHash = await _orbitDB.del(contact4Update.id)

    const id = await sha256(JSON.stringify(contact4Update));
    contact4Update.id = id;
    const updateHash = await _orbitDB.put(contact4Update.id,contact4Update)

    //don't notify when creating a qr-code
    if(!contact) notify(`Contact added successfully! ${updateHash}`)
    selectedAddress.set({})
    selectedTab.set(0)
    return {deletedHash,updateHash}
}

/**
 * deletes a contact by id
 * @returns {Promise<{deletedHash: *}>}
 */
export async function deleteContact() {
    const deletedHash = await _orbitDB.del(_selectedAddress.id)
    notify(`Contact deleted successfully! ${deletedHash}`)
    selectedAddress.set({})
    selectedTab.set(0)
    return {deletedHash}
}

/**
 * Takes a contact object puts all attributes into the orbitDB
 * return the address of the orbitdb
 * @param address
 */
export async function createNewOrbitDBWithAddress(address) {
    console.log("creating new orbitDB for",address)
    const {orbitDB} = await initOrbitDB(_ipfs,address.id); //TODO when creating a new address db to share we need unique id - why not creating it this way even when contact data change later
    console.log("created contactDB",orbitDB.address)
    for (const p in address) {
        if(p!=="qr" &&
            p!=='own' &&
            address[p] !== undefined &&
            address[p] !== '' ) {
            console.log(`adding ${p}: ${address[p]}`);
            orbitDB.put(p,address[p])
        }
    }
    console.log("contactDB",orbitDB.address)
    return orbitDB.address;
}

/**
 * 1. Alice creates a new OrbitDB with her contact data.
 * the resulting address will be used to create a qr code which Bob can scan or
 * receive via email, chat, etc.
 *
 * 2. the QRCode-Modal is opening
 * 3. Bob is adding the scanned db to its subscription list the contacts (not stored in own orbitdb)
 *
 * @param {object} contact
 * @returns {Promise<void>}
 */
export async function generateQRForAddress(contact) {
    contact.orbitDbAddress = await createNewOrbitDBWithAddress(contact);
    await updateContact(contact);
    qrCodeData.set(contact.orbitDbAddress)
    qrCodeOpen.set(true)
}