import {contacts} from './stores.js';


let ipfsNode1,ipfsNode2;
let nodeId;
let putted, added;
let putWithLinks, addedWithLinks;
let countValue
contacts.subscribe((value) => {
    countValue = value;
});


export const ipfsTest = async () => {
    const config1 = {
        Bootstrap: [],
        Addresses: {
            Swarm: [
                '/dns6/ipfs.le-space.de/tcp/9091/wss/p2p-webrtc-star',
                '/dns4/ipfs.le-space.de/tcp/9091/wss/p2p-webrtc-star'
            ],
        },
        Discovery: {
            MDNS: {
                Enabled: true,
                Interval: 0
            }
        }
    }
    // In Svelte, a hot module refresh can cause lockfile problems
    // so we assign the ipfs node to globalThis to avoid lock file issues
    if (!globalThis.ipfsNode) {
        // no ipfs saved to globalThis, so load it up
        const IPFSmodule = await import('./modules/ipfs-core/ipfs-core.js');
        const IPFS = IPFSmodule.default;
        ipfsNode1 = await IPFS.create({ config: config1, repo: './ipfs/1' });
        globalThis.ipfsNode1 = ipfsNode1;
    } else {
        ipfsNode1 = globalThis.ipfsNode1;
    }

    const identity = await ipfsNode1.id();
    nodeId = identity.id;

    const OrbitDBModul = await import('./modules/orbitdb-core/index.js');
    const createOrbitDB = OrbitDBModul.createOrbitDB;
    // const ipfsAccessController = OrbitDBModul.IPFSAccessController;
    const orbitdb1 = await createOrbitDB({ ipfs: ipfsNode1 })

    //3. My address book
    const aliceAddressBook = "/orbitdb/zdpuAzc5wZx7HmnFQcnDuUm7X3ZtpMY94VMQ781W4hpwuGmEt" //"myAddressBook"
    const aliceAddressBookDB = await orbitdb1.open(aliceAddressBook, { type: 'keyvalue' })
    let allAliceaddressbook = await aliceAddressBookDB.all()

    const toObject = (fieldsArray) => {
        let retObj = { }
        for (let fieldNo in fieldsArray) {
                retObj[fieldsArray[fieldNo].key]=fieldsArray[fieldNo].value;
        }
        return retObj
    }

    for (let key in allAliceaddressbook) {
        const dbAddr = allAliceaddressbook[key].value
        console.log(`connecting to ${allAliceaddressbook[key].key}'s  dal ${dbAddr} `)
        const syncingDAL = await orbitdb1.open(dbAddr, { type: 'keyvalue' })
        const allSyncingDAL = await syncingDAL.all()
        contacts.update(items => {
            items.push(toObject(allSyncingDAL))
            return items
        })
    }
}