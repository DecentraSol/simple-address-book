<script>
    import { onMount } from "svelte";
    import { ipfs, orbitDB, contacts, selectedRowIds, selectedTab } from "../stores.js"
    import { initIPFS, initOrbitDB } from "../init.js"
    import {loadContact, updateContact} from "../operations.js";
    import ContactTable from "$lib/components/ContactTable.svelte";
    import ContactForm from "$lib/components/ContactForm.svelte";
    import {Tabs, Tab, TabContent, Button, TextInput, Column, Grid, Row} from "carbon-components-svelte";
    import Settings from "$lib/components/Settings.svelte";

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
        window.orbitdb = $orbitDB

        $orbitDB.events.on('join', async (peerId, heads) => {
            console.log(peerId, (await $ipfs.id()).id)
        })

        const dbAll = await $orbitDB.all()
        $contacts = dbAll.map(a => {
            const newElement = a.value
            return newElement
        });
        console.log("$contacts",$contacts)
    });

    $: loadContact($selectedRowIds[0]) //loads the selected contact into the contact form
</script>
<h2>Decentralized Addressbook</h2>
<Tabs class="tabs" bind:selected={$selectedTab}>
    <Tab label="Contacts" />
    <Tab label="Add Contact" />
    <Tab label="Settings" />
    <svelte:fragment slot="content">
        <TabContent>
            <Grid fullWidth>
                <Row>
                    <Column><TextInput size="sm"/></Column>
                    <Column><Button size="sm" on:click={() => {console.log("")}}>Scan Contact</Button></Column>
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

