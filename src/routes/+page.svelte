<script>
    import { onMount } from "svelte";
    import {Tabs, Tab, TabContent, Button, TextInput, Column, Grid, Row} from "carbon-components-svelte";
    import { selectedTab} from "../stores.js"
    import { Buffer } from 'buffer'
    globalThis.Buffer = Buffer
    import { Record } from '@libp2p/kad-dht'
    import {createEd25519PeerId, createFromPrivKey, createFromPubKey} from '@libp2p/peer-id-factory'
    import { MemoryDatastore } from 'datastore-core'

    import { CID } from 'multiformats/cid'
    import {keys} from 'libp2p-crypto';

    import {ipns} from "@helia/ipns"
    import ContactTable from "$lib/components/ContactTable.svelte";
    import ContactForm from "$lib/components/ContactForm.svelte";
    import Settings from "$lib/components/Settings.svelte";

    let name //IPNS
    let datastore


    /**
     * Publishes and Resolves cid with a given private key. If no private key is given generate new keys peerId
     * @param {CID} cid
     * @param privateKeyHex
     * @returns {Promise<CID>} a Promise with CID
     */
    const publishAndResolveFromIPNS = async (cid, privateKeyHex) => {
        datastore = new MemoryDatastore()
        name = ipns({ datastore })
        let key;
        if(privateKeyHex){
            let data = Buffer.from(privateKeyHex, "base64")
            let _key = await keys.unmarshalPrivateKey(data);
            key = await createFromPrivKey(_key)
        }
        else key = await createEd25519PeerId()

        await name.publish(key, cid)

        const resolvedValue = await name.resolve(key)

        //
        // console.log("resolvedValue",resolvedValue.toString())
        // console.log("(cid.toV1() :",cid.toV1().toString())
        return resolvedValue;
    }


    onMount(async () => {
        window.global = window;
        const privateKeyHex = "CAESQPuTnfPuM1wifWUjCfvxix9G39vxTlnWpbH9lycN8WsMz5jq5y27dsyesoigKfbpqjBtaEBlCN++NBPAz+W8rsQ="
        const cid = CID.parse('QmVpU3CNMKLq19AfBTL5eyAwoAVenb5V2i8CEoCpBtnr88')
        const resolvedValue = await publishAndResolveFromIPNS(cid,privateKeyHex)
        console.log("resolvedValue",resolvedValue.toString())
    });

    let scannedAddress
    const importDAL = async () => {

        // const importDB = await initOrbitDB($ipfs, scannedAddress)
        // console.log("importing scanned DAL", importDB.address)
        // const recordsToImport = await importDB.all()
        //
        // console.log("importDB.name",importDB.name)
        // console.log("importDB",importDB)
        // console.log("importDB",importDB.events)
        // for await (const record of importDB.iterator()) {
        //     console.log("importDB-record",record)
        // }
        // console.log("recordsToImport",recordsToImport)
        // for (const recordsToImportKey in recordsToImport) {
        //     const key = recordsToImport[recordsToImportKey].key
        //     const value = recordsToImport[recordsToImportKey].value
        //     delete value.own
        //     value.orbitDB=scannedAddress
        //     value.updated=new Date()
        //     $contacts.push(value)
        // }
        // $contacts = $contacts
        // console.log("$contacts",$contacts)
    }

</script>
<!--
@component AddressBook
-->
<h2>Decentralized Addressbook</h2>
<Tabs class="tabs" bind:selected={$selectedTab}>
    <Tab label="Contacts" data-cy="contacts"/>
    <Tab label="My Address" data-cy="address"/>
    <Tab label="Settings"  data-cy="settings"/>
    <svelte:fragment slot="content">
        <TabContent>
            <Grid fullWidth>
                <Row>
                    <Column><TextInput size="sm" bind:value={scannedAddress}/></Column>
                    <Column><Button size="sm" on:click={() => importDAL()}>Scan Contact</Button></Column>
                    <Column><Button size="sm" on:click={() => {
                    //generateQRForAddress($dbMyDal.address)
                    }
                    }>My QR-Code</Button></Column>
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

