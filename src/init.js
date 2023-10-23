/**
 * Initializing IPFS-Core
 * @returns {Promise<*>}
 */
export async function initIPFS(config) {
    const IPFSmodule = await import('./modules/ipfs-core/ipfs-core.js');
    const IPFS = IPFSmodule.default;
    return await IPFS.create(config);
}
const DEFAULT_DB_NAME = "deCad03";
/**
 * Inits an OrbitDb on IPFS with a given dbName
 *
 * @param ipfsInstance
 * @param {string | undefined} dbName
 * @returns { Promise<{deCad: string, orbitDB: (*),
 * IPFSAccessController: (*|(function({write: *, storage: *}=): function({orbitdb: *, identities: *, address: *}): Promise<{address: *, canAppend: function(*): Promise<boolean|*>, type: string, write: *}>))}>}
 */
export async function initOrbitDB(ipfsInstance,dbName) {
    const _dbName = dbName?dbName:DEFAULT_DB_NAME
    const OrbitDBModul = await import('./modules/orbitdb-core/index.js');
    const createOrbitDB = OrbitDBModul.createOrbitDB;
    const IPFSAccessController = OrbitDBModul.IPFSAccessController;
    const orbitdb = await createOrbitDB({ ipfs  : ipfsInstance });

    const deCad = localStorage.getItem(_dbName);
    console.log("_dbName",_dbName)
    console.log("deCad",deCad)
    const orbitDB = await orbitdb.open(
        deCad?deCad:_dbName, {
            type: 'keyvalue',
            sync: true,
            indexBy: 'id',
            create: true,
            //overwrite: false,
            public: true,
            AccessController: IPFSAccessController({write: ['*']})
        })
    localStorage.setItem(_dbName,orbitDB.address)

    // orbitDB.events.on('join', async (peerId, heads) => {
    //     // The peerId of the ipfs1 node.
    //     console.log(peerId, (await ipfsInstance.id()).id)
    // })

// Listen for any updates to db2. This is especially useful when listening for
// new heads that are available on db1.
// If we want to listen for new data on db2, add an "update" listener to db1.
    orbitDB.events.on('update', async (entry) => {
        // Full replication is achieved by explicitly retrieving all records from db1.
        // console.log(await orbitDB.all())
    })

    return {orbitDB, IPFSAccessController, deCad}
}

export async function dropDB(orbitDB){
    await orbitDB.drop()
    localStorage.removeItem(DEFAULT_DB_NAME)
}
