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

    const config2 = {
        Addresses: {
            Swarm: [
                '/dns6/ipfs.le-space.de/tcp/9091/wss/p2p-webrtc-star',
                '/dns4/ipfs.le-space.de/tcp/9091/wss/p2p-webrtc-star'
            ],
        },
        Bootstrap: [],
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
        ipfsNode2 = await IPFS.create({ config: config2, repo: './ipfs/2' });
        globalThis.ipfsNode1 = ipfsNode1;
    } else {
        ipfsNode1 = globalThis.ipfsNode1;
        ipfsNode2 = globalThis.ipfsNode2;
    }

    const identity = await ipfsNode1.id();
    nodeId = identity.id;

    const OrbitDBModul = await import('./modules/orbitdb-core/index.js');
    const createOrbitDB = OrbitDBModul.createOrbitDB;
    // const ipfsAccessController = OrbitDBModul.IPFSAccessController;
    const orbitdb1 = await createOrbitDB({ ipfs: ipfsNode1 })
    const orbitdb2 = await createOrbitDB({ ipfs: ipfsNode2 })

    //1. Create my own addressDB and receive a DAL (decentralized address link)
    const aliceDAL = "aliceDAL"
    const aliceDALDB = await orbitdb1.open(aliceDAL, { type: 'keyvalue' })
    await aliceDALDB.put('lastname', "Brown")
    await aliceDALDB.put('firstname', "Alice")
    await aliceDALDB.put('city', "Istanbul")
    await aliceDALDB.put('email', "alice@brown.com")
    await aliceDALDB.put('mobile', "+90 (212) 225 91 00")

    const allAlice = await aliceDALDB.all()

    console.log("allMyAddressFields",allAlice)

    //2. Bobs DAL
    const bobDAL = "bobDAL"
    const bobDALDB = await orbitdb2.open(bobDAL, { type: 'keyvalue' })
    await bobDALDB.put('lastname', "Smith")
    await bobDALDB.put('firstname', "Bob")
    await bobDALDB.put('street', "The Address Downtown")
    await bobDALDB.put('city', "Dubai")
    await bobDALDB.put('email', "bob@the-address-downtown.com")
    await bobDALDB.put('mobile', "+971 4 210 2522")

    const allBob = await bobDALDB.all()
    console.log("allBob",allBob)

    //3. My address book
    const aliceAddressBook = "myAddressBook"
    const aliceAddressBookDB = await orbitdb1.open(aliceAddressBook, { type: 'keyvalue' })
    await aliceAddressBookDB.put('MY-DAL', aliceDALDB.address)
    let allAliceaddressbook = await aliceAddressBookDB.all()
    // console.log("allAliceaddressbook",allAliceaddressbook)

    //4. Bobs address book (has only his address
    // const myAddressBook = "myAddressBook"
    const bobsAddressBookDB = await orbitdb2.open(aliceAddressBook, { type: 'keyvalue' })
    await bobsAddressBookDB.put('MY-DAL', bobDALDB.address)
    const allbobsAddressBookDB = await bobsAddressBookDB.all()
    console.log("allbobsAddressBookDB",allbobsAddressBookDB)

    //Now Alice is connecting (scanning) Bobs address book (we need his address not his contacts!)
    //TODO who gets read access for bobs address book? only bob or everybody with a password or privatekey?
    const alice2BobsDAL = await orbitdb1.open(bobDALDB.address, { type: 'keyvalue' })
    const allalice2BobsDAL = await alice2BobsDAL.all()
    console.log("allalice2BobsDAL",allalice2BobsDAL) //alice orbitdb now contains bobs address

    //we now put bobs dal book into alice addressbook and iterator over all entries in alice address book and print out all DALs
    const bobsName = await bobDALDB.get("lastname")
    await aliceAddressBookDB.put(bobsName, bobDALDB.address)
    allAliceaddressbook = await aliceAddressBookDB.all()
    console.log("allAliceaddressbook",allAliceaddressbook)
    console.log("aliceAddressBookDB-->",aliceAddressBookDB.address)

    //now change bobs address (Bob is moving to a new address)
    const newAddress = "Jumeirah Beach"
    console.log("changing bobs address",newAddress)
    await bobDALDB.put('street',newAddress)

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