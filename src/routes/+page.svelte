<script>
    import { onMount } from "svelte";
    import {Tabs, Tab, TabContent, Button, TextInput, Column, Grid, Row} from "carbon-components-svelte";
    import { ipfs, orbitDB, dbMyDal, contacts, selectedRowIds, selectedTab } from "../stores.js"
    import { initIPFS, initOrbitDB } from "../init.js"
    import { loadContact, generateQRForAddress } from "../operations.js";
    import ContactTable from "$lib/components/ContactTable.svelte";
    import ContactForm from "$lib/components/ContactForm.svelte";
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

        console.log("ipfs.pubsub",$ipfs.libp2p.pubsub)
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

        const _orbitDB = await initOrbitDB($ipfs)
        if (!$orbitDB) $orbitDB = _orbitDB;

        localStorage.setItem("dbName",$orbitDB.address) //don't do this inside initOrbitDB since there we initialize DALs !
        console.log("orbitdb is",$orbitDB)
        window.orbitdb = $orbitDB

        const dbAll = await $orbitDB.all()
        $contacts = dbAll.map(a => {
            const newElement = a.value
            return newElement
        });

        const _dbMyDal = await initOrbitDB($ipfs,"mydal")
        $dbMyDal = _dbMyDal

        const myRecords = await $dbMyDal.all() //TODO add tem to $contacts
        myRecords.map(a => $contacts.push(a.value));
        $contacts = $contacts

        console.log("initialized myDal",$dbMyDal.address)
        console.log("dbMyDal ",$dbMyDal)
        console.log("myRecords",myRecords)

        $orbitDB.events.on("replicated", async (dbAddress, count, newFeed, d) => {
            console.log("replicated orbitDB")
        })

        $dbMyDal.events.on("replicated", async (dbAddress, count, newFeed, d) => {
            console.log("replicated dbMyDal")
        })

        $dbMyDal.events.on("update", async (entry) => {
            console.log(entry) //it is not necessary to add this to the contacts because it is allready insdie
            const dbAll = await $dbMyDal.all()
            if(dbAll.length>0) {
                console.log("$dbMyDal",$dbMyDal)
                console.log("dbAll",dbAll)
                $contacts.push(dbAll[0].value) //TODO this leeds to duplicate keys - only add whatis not in yet
                $contacts = $contacts
            }
        })

        $orbitDB.events.on("update", async (entry) => {
            console.log(entry) //it is not necessary to add this to the contacts because it is allready insdie
            $contacts = await  $orbitDB.all() //TODO this overwrites everything - only add what is not in yet
        })

        console.log("$contacts",$contacts)
    });

    $: loadContact($selectedRowIds[0]) //loads the selected contact into the contact form

    const importDAL = async () => {

        const importDB = await initOrbitDB($ipfs, scannedAddress)
        console.log("importing scanned DAL", importDB.address)
        const recordsToImport = await importDB.all()
        console.log("importDB.name",importDB.name)
        console.log("importDB",importDB)
        console.log("importDB",importDB.events)

        for (const recordsToImportKey in recordsToImport) {
            const key = recordsToImport[recordsToImportKey].key
            const value = recordsToImport[recordsToImportKey].value
            delete value.own
            value.orbitDB=scannedAddress
            value.updated=new Date()
            $contacts.push(value)
        }
        $contacts = $contacts
        console.log("$contacts",$contacts)
    }

</script>
<!--
@component AddressBook
-->
<h2>Decentralized Addressbook of {$orbitDB?.name}</h2>
<Tabs class="tabs" bind:selected={$selectedTab}>
    <Tab label="Contacts" />
    <Tab label="My Address" />
    <Tab label="Settings" />
    <svelte:fragment slot="content">
        <TabContent>
            <Grid fullWidth>
                <Row>
                    <Column><TextInput size="sm" bind:value={scannedAddress}/></Column>
                    <Column><Button size="sm" on:click={() => importDAL()}>Scan Contact</Button></Column>
                    <Column><Button size="sm" on:click={() => generateQRForAddress($dbMyDal.address)}>My QR-Code</Button></Column>
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
    :global(.bx--btn, input) {
        margin-bottom: 1rem;

    }
    :global(.tabs) {
        margin: 1rem;
    }
</style>

