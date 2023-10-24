<script>
    import { onMount } from "svelte";
    import { ipfs, orbitDB, contacts, dals, selectedRowIds, selectedTab } from "../stores.js"
    import { initIPFS, initOrbitDB } from "../init.js"
    import {loadContact} from "../operations.js";
    import ContactTable from "$lib/components/ContactTable.svelte";
    import ContactForm from "$lib/components/ContactForm.svelte";
    import {Tabs, Tab, TabContent, Button, TextInput, Column, Grid, Row} from "carbon-components-svelte";
    import Settings from "$lib/components/Settings.svelte";

    let scannedAddress

    onMount(async () => {
        const config1 = {
                    Addresses: {
                        Swarm: [
                            '/dns6/ipfs.le-space.de/tcp/9091/wss/p2p-webrtc-star',
                            '/dns4/ipfs.le-space.de/tcp/9091/wss/p2p-webrtc-star'
                        ]
                    },
                    Bootstrap: [],
                    Discovery: {
                        MDNS: {
                            Enabled: true,
                            Interval: 0
                        }
                    }
                }

        if (!$ipfs) $ipfs = await initIPFS({
            config: config1,
            EXPERIMENTAL: { pubsub: true },
            preload: { "enabled": false },
            repo: './decad01' });
        window.ipfs = $ipfs
        console.log("ipfs",$ipfs)
        // const topic = 'fruit-of-the-day'
        // const receiveMsg = (msg) => console.log(msg.toString())
        //
        // await $ipfs.pubsub.subscribe(topic, receiveMsg)
        // console.log(`subscribed to ${topic}`)
        //
        // $ipfs.libp2p.on('peer:connect', peerInfo => console.log("peerInfo",peerInfo))
        // $ipfs.libp2p.on('peer:disconnect', peerInfo => console.log("peerInfo",peerInfo))

        const initOrbitData = await initOrbitDB($ipfs)

        // deCad = initOrbitData.deCad;
        // console.log("deCad",deCad)
        if (!$orbitDB) $orbitDB = initOrbitData.orbitDB;
        localStorage.setItem("dbName",$orbitDB.address) //don't do this inside initOrbitDB since there we initialize DALs !

        console.log("orbitdb is",$orbitDB)
        window.orbitdb = $orbitDB

        {
            //TODO put this into a function to load all contacts after initializatino of database see Setting.svelte
            const dbAll = await $orbitDB.all()
            $contacts = dbAll.map(a => {
                const newElement = a.value
                return newElement
            });

            //load our DALs
            for (const i in $contacts) {
                console.log("checking contact must be a DAL to others?", $contacts[i])
                if($contacts[i].orbitDbAddress){
                    console.log("initializing dal to ",$contacts[i].orbitDbAddress)
                    const dalObject = await initOrbitDB($ipfs, $contacts[i].orbitDbAddress)
                    $dals.push(dalObject.orbitDB)
                    console.log("was loading dal's db",$dals.length)

                }
            }

            $orbitDB.events.on("update", async (entry) => {
                console.log(entry) //it is not necessary to add this to the contacts because it is allready insdie
                const dbAll = await $orbitDB.all()

                $contacts = dbAll.map(a => {
                    const newElement = a.value
                    return newElement
                });
            })
        }
        console.log("$contacts",$contacts)
    });

    $: loadContact($selectedRowIds[0]) //loads the selected contact into the contact form

    const importDAL = async () => {

        const dbImportObject = await initOrbitDB($ipfs, scannedAddress)
        const importDB = dbImportObject.orbitDB
        console.log("importing scanned DAL", importDB.address)
        const recordsToImport = await importDB.all()
        importDB.events.on("update", async (entry) => {
            console.log("importDB-entry",entry) //it is not necessary to add this to the contacts because it is allready insdie
            const dbAll = await importDB.all()
            console.log("importDB:dbAll",dbAll)
        })
        console.log("recordsToImport",recordsToImport)
    }

</script>
<!--
@component AddressBook
-->
<h2>Decentralized Addressbook of {$orbitDB?.name}</h2>
<Tabs class="tabs" bind:selected={$selectedTab}>
    <Tab label="Contacts" />
    <Tab label="Add Contact" />
    <Tab label="Settings" />
    <svelte:fragment slot="content">
        <TabContent>
            <Grid fullWidth>
                <Row>
                    <Column><TextInput size="sm" bind:value={scannedAddress}/></Column>
                    <Column><Button size="sm" on:click={() => importDAL()}>Scan Contact</Button></Column>
                </Row>
            </Grid>
            <ContactTable/>
        </TabContent>
        <TabContent><ContactForm/></TabContent>
        <TabContent><Settings/></TabContent>
    </svelte:fragment>
</Tabs>
<style>
    h2 {
        margin: 1rem;
    }
    .tabs {
        margin: 1rem;
    }
</style>

