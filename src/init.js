let testIdentity1;
const DEFAULT_DB_NAME = "deCad";

export async function initIPFS(config) {
    const IPFSmodule = await import('./modules/ipfs-core/ipfs-core.js');
    const IPFS = IPFSmodule.default;
    return await IPFS.create(config);
}

export async function initOrbitDB(ipfsInstance,dbName) {

    if(dbName===undefined)
        dbName = localStorage.getItem("dbName");
    if(dbName===undefined || dbName === null) dbName = DEFAULT_DB_NAME
    console.log("initializing dbName",dbName)

    const OrbitDBModul = await import('./modules/orbitdb-core/index.js');
    // const createOrbitDB = OrbitDBModul.createOrbitDB;
    const Identities = OrbitDBModul.Identities
    const Documents = OrbitDBModul.Documents
    const KeyStore = OrbitDBModul.KeyStore
    // const IPFSAccessController = OrbitDBModul.IPFSAccessController;
    // const OrbitDBAccessController = OrbitDBModul.OrbitDBAccessController;
    // const orbitdb = await createOrbitDB({ ipfs  : ipfsInstance });

    // const writePermission = ['*'] //[orbitdb.identity.id] // //['*']
    // const db = await orbitdb.open(
    //         dbName, {
    //             Database: Documents({ indexBy: 'id'} ) ,
    //        AccessController: OrbitDBAccessController({admin: writePermission, write: writePermission})
    //     })
    const keysPath = './testkeys'
    const keystore = await KeyStore({ path: keysPath })
    const identities = await Identities({ keystore })
    testIdentity1 = await identities.createIdentity({ id: 'userA' })

    const accessController = {
        canAppend: async (entry) => { //TODO entry is coming with all data including the id of the original id (here we should maybe remember the original o
            const identity1 = await identities.getIdentity(entry.identity)
            // const identity2 = await identities.getIdentity(entry.identity)
            console.log("identityQuatsch-entry",entry)
            return true; //identity1.id === testIdentity1.id //|| identity2.id === testIdentity2.id
        }
    }

    const db = await Documents({indexBy:'id'})({
        ipfs: ipfsInstance,
        identity: testIdentity1,
        name: dbName,
        address: dbName,
        access: accessController,
        directory: './orbitdb1' })

    return db
}

export async function dropDB(orbitDB){
    await orbitDB.drop()
    localStorage.removeItem(DEFAULT_DB_NAME)
}
