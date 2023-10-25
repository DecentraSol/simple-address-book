import {contacts, orbitDB} from "./stores.js";
let _contacts;
contacts.subscribe((value) => {
    _contacts = value
})
/**
 * Initializing IPFS-Core
 * @returns {Promise<*>}
 */
export async function initIPFS(config) {
    const IPFSmodule = await import('./modules/ipfs-core/ipfs-core.js');
    const IPFS = IPFSmodule.default;
    return await IPFS.create(config);
}
const DEFAULT_DB_NAME = "deCad";
/**
 * Inits an OrbitDb on IPFS with a given dbName
 *
 * @param ipfsInstance
 * @param {string | undefined} dbName
 * @returns { Promise<{deCad: string, orbitDB: (*),
 * IPFSAccessController: (*|(function({write: *, storage: *}=): function({orbitdb: *, identities: *, address: *}): Promise<{address: *, canAppend: function(*): Promise<boolean|*>, type: string, write: *}>))}>}
 */
export async function initOrbitDB(ipfsInstance,dbName) {

    if(dbName===undefined)
        dbName = localStorage.getItem("dbName");
    if(dbName===undefined || dbName === null) dbName = DEFAULT_DB_NAME
    console.log("initializing dbName",dbName)

    const OrbitDBModul = await import('./modules/orbitdb-core/index.js');
    const createOrbitDB = OrbitDBModul.createOrbitDB;
    // const IPFSAccessController = OrbitDBModul.IPFSAccessController;
    const OrbitDBAccessController = OrbitDBModul.OrbitDBAccessController;
    const Documents = OrbitDBModul.Documents
    const orbitdb = await createOrbitDB({ ipfs  : ipfsInstance });

    const writePermission = ['*'] //[orbitdb.identity.id] // //['*']
    const orbitDB = await orbitdb.open(
            dbName, {
                Database: Documents({ indexBy: 'id'} ) ,
           AccessController: OrbitDBAccessController({admin: writePermission, write: writePermission})
        })
    return orbitDB
}

export async function dropDB(orbitDB){
    await orbitDB.drop()
    localStorage.removeItem(DEFAULT_DB_NAME)
}
