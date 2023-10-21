<script>
    import { onMount } from "svelte";
    import { ipfs, orbitDB, contacts, selectedRowIds } from "../stores.js"
    import { sha256 } from "../utils.js"
    import { initIPFS, initOrbitDB } from "../init.js"
    import { loadContact } from "../operations.js";
    import ContactTable from "$lib/components/ContactTable.svelte";
    import ContactForm from "$lib/components/ContactForm.svelte";

    // let deCad; //the address of the main orbitDB (stored also in localstorage)

    onMount(async () => {
        const config = {
            repo: "./decad-repo-2023",
            EXPERIMENTAL: { pubsub: true },
            config:
                {
                    Addresses: {
                        Swarm: [
                            '/dns6/ipfs.le-space.de/tcp/9091/wss/p2p-webrtc-star',
                            '/dns4/ipfs.le-space.de/tcp/9091/wss/p2p-webrtc-star'
                        ]
                    }
                }
        }
        if (!$ipfs) $ipfs = await initIPFS(config);
        const topic = 'fruit-of-the-day'
        const receiveMsg = (msg) => console.log(msg.toString())

        await $ipfs.pubsub.subscribe(topic, receiveMsg)
        console.log(`subscribed to ${topic}`)

        $ipfs.libp2p.on('peer:connect', peerInfo => console.log("peerInfo",peerInfo))
        $ipfs.libp2p.on('peer:disconnect', peerInfo => console.log("peerInfo",peerInfo))

        const initOrbitData = await initOrbitDB($ipfs)
        // deCad = initOrbitData.deCad;
        // console.log("deCad",deCad)
        if (!$orbitDB) $orbitDB = initOrbitData.orbitDB;
        console.log("orbitdb is",$orbitDB)


        // dropDB()
        $orbitDB.events.on("update", async (entry) => {
            const dbAll = await $orbitDB.all()

            // for (let i = 0; i < dbAll.length; i++) {
            //     dbAll[i].id =  await sha256(JSON.stringify(dbAll[i]))
            // }

            $contacts = dbAll.map(a => {
                const newElement = a.value
                return newElement
            });
        })

        $orbitDB.events.on('join', async (peerId, heads) => {
            console.log(peerId, (await $ipfs.id()).id)
        })

        const dbAll = await $orbitDB.all()
        for (let i = 0; i < dbAll.length; i++) {
            console.log("dbAll[i]",dbAll[i])
           // dbAll[i].id =  await sha256(JSON.stringify(dbAll[i])) //TODO add sha256 only beofre adding
        }
        $contacts = dbAll.map(a => {
            const newElement = a.value
            return newElement
        });
        console.log("$contacts",$contacts)
    });


    $: {
        if($ipfs!==undefined){
            const loadPeers = async () => {
                const peerInfos = await $ipfs.swarm.peers()
                console.log("peerInfos",peerInfos)

                // const topic = 'fruit-of-the-day'
                //
                // const peerIds = await $ipfs.pubsub.peers(topic)
                // console.log(peerIds)
            }
            loadPeers()

            // $ipfs.libp2p.addEventListener("peer:connect", ev => {
            //     console.log(`[peer:connect on ${$ipfs.libp2p.peerId}]`, ev.detail.toString());
            //   //  $peers.push(ev.detail.toString())
            //     //testString.push(ev.detail.toString())
            //     //	testString.push("nico")
            //     //	console.log(testString)
            // });
        }
    }
    $: loadContact($selectedRowIds[0]) //loads the selected contact into the contact form
</script>
<h2>Decentralized Addressbook</h2> {$orbitDB?.address}
<ContactForm/>
<ContactTable/>
