/**
 * Initializing IPFS-Core
 * @returns {Promise<*>}
 */
export async function initIPFS() {
    const IPFSmodule = await import('./modules/ipfs-core/ipfs-core.js');
    const IPFS = IPFSmodule.default;
    return await IPFS.create({ EXPERIMENTAL: { pubsub: true }, repo: './ipfs/1' });
}

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
    const orbitDB = await orbitdb.open(_dbName, {
        type: 'keyvalue',
        AccessController: IPFSAccessController({ write: ['*'] })
    });
    return {orbitDB, IPFSAccessController, deCad}
}



const DEFAULT_DB_NAME = "deCad01"
export async function dropDB(orbitDB){
    await orbitDB.drop()
    localStorage.removeItem(DEFAULT_DB_NAME)
}
