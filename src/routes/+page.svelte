<script>
    import { onMount } from "svelte";
    import {Tabs, Tab, TabContent, Button, TextInput, Column, Grid, Row} from "carbon-components-svelte";
    import {ipfs, selectedTab, selectedRowIds, remotePinner} from "../stores.js"
    import { loadContact } from "../operations.js"
    import { Buffer } from 'buffer'
    globalThis.Buffer = Buffer
    import {createEd25519PeerId, createFromPrivKey, createFromPubKey} from '@libp2p/peer-id-factory'
    // import pinataSDK from '@pinata/sdk';7

    // import { unixfs } from '@helia/unixfs'
    // import { Configuration, RemotePinningServiceClient } from '@ipfs-shipyard/pinning-service-client'
    // import { createRemotePinner } from '@helia/remote-pinning'

    import { createHelia } from 'helia'
    import { createLibp2p } from 'libp2p'
    import { noise } from '@chainsafe/libp2p-noise'
    import { yamux } from '@chainsafe/libp2p-yamux'
    // import { bootstrap } from '@libp2p/bootstrap';
    // import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery';
    import { circuitRelayTransport, circuitRelayServer } from 'libp2p/circuit-relay';
    import { webRTC, webRTCDirect } from '@libp2p/webrtc';
    import { webTransport } from '@libp2p/webtransport';
    import { identifyService } from 'libp2p/identify';
    import { autoNATService } from 'libp2p/autonat';
    import { gossipsub } from '@chainsafe/libp2p-gossipsub';
    import { kadDHT } from '@libp2p/kad-dht';
    import { ipnsSelector } from 'ipns/selector';
    import { ipnsValidator } from 'ipns/validator';
    // import { unixfs } from '@helia/unixfs'
    // import { bootstrap } from '@libp2p/bootstrap'

    import { MemoryBlockstore } from 'blockstore-core'
    import { MemoryDatastore } from 'datastore-core'
    import { CID } from 'multiformats/cid'
    import {keys} from 'libp2p-crypto';
    import {ipns} from "@helia/ipns"

    import ContactTable from "$lib/components/ContactList.svelte";
    import ContactForm from "$lib/components/ContactForm.svelte";
    import Settings from "$lib/components/Settings.svelte";
    import {json} from "@helia/json";
    // import Settings from "$lib/components/Settings.svelte";

    let name //IPNS
    let datastore

    $: loadContact($selectedRowIds[0])

    async function createNode () {
        const blockstore = new MemoryBlockstore()
        const datastore = new MemoryDatastore()
        const libp2p = await createLibp2p({
            datastore,
            addresses: {
                listen: ['/webrtc'
                    //, '/wss', '/ws'
                ]
            },
            transports: [
                webRTC(),
                webRTCDirect(),
                webTransport(),
                // https://github.com/libp2p/js-libp2p-websockets#libp2p-usage-example
                circuitRelayTransport({ discoverRelays: 3 })
            ],
            connectionEncryption: [
                noise()
            ],
            streamMuxers: [
                yamux()
            ],
            peerDiscovery: [
/*                bootstrap({
                    list: [
                        '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
                        '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
                        '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
                        '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
                    ]
                })*/
            ],
            services: {
                identify: identifyService(),
                autoNAT: autoNATService(),
                //pubsub: gossipsub({allowPublishToZeroPeers: true, emitSelf: false, canRelayMessage: true}),
                pubsub: gossipsub({
                    allowPublishToZeroPeers: true,
                    emitSelf: true,
                    canRelayMessage: true
                }),
                dht: kadDHT({
                    clientMode: true,
                    validators: { ipns: ipnsValidator },
                    selectors: { ipns: ipnsSelector }
                })
            }
        })

        return await createHelia({
            datastore,
            blockstore,
            libp2p
        })

    }

    const getPinataPinner = async () => {
        const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4OThhZmZjOC1iNmMwLTQxNjItYjk2Zi1mOWIyMzcyMmY3N2MiLCJlbWFpbCI6Im5pY29AbGUtc3BhY2UuZGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYWJjZDM5NjZmMWNlMTU1ZWE5MzEiLCJzY29wZWRLZXlTZWNyZXQiOiIzMWFkYzdhYmY0OGZmZTMxMDkwZGZlYTdkM2FlYzdmNTA3ODY2YzhjZDNiMWU5NmY0ZGIxOGJkZjk4YjJkNWE2IiwiaWF0IjoxNjk5MDIwNzYyfQ.8O3EmnjzpDOG0ygp5KEZVLf_pn6z9K3k9N7rh9UvJeA"
        const pinata = new pinataSDK({ pinataJWTKey:JWT});
        return pinata
    }
/*
    const getRemotePinner = async (helia, endpointUrl, accessToken) => {

        const pinServiceConfig = new Configuration({
            endpointUrl: `${endpointUrl}`, // the URI for your pinning provider, e.g. `http://localhost:3000`
            accessToken: `${accessToken}` // the secret token/key given to you by your pinning provider
        })

        const remotePinningClient = new RemotePinningServiceClient(pinServiceConfig)
        return createRemotePinner(helia, remotePinningClient)
    } */



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

        const helia = await createNode()
        $ipfs = helia
        console.log("ipfs",$ipfs)
      // $remotePinner = await getRemotePinner(helia,pinnerURL,pinataAcessToken)
      //   const pinata = await getPinataPinner()
      //   const res = await pinata.testAuthentication()
      //   console.log(res)
      //   const j = json($ipfs);
      //   const cidCreated = await j.add({firstName:"nico"});
      //   console.log("cidCreated--->ipfs",cidCreated.toString())
      //
      //   const res2 = await pinata.pinByHash(cidCreated.toString())
      //   console.log(res)
// "message": "Congratulations! You are communicating with the Pinata API"!"

    });

    let scannedAddress
    const importDAL = async () => {

        const importDB = await initOrbitDB($ipfs, scannedAddress)
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
        //     value.myAddressBook=scannedAddress
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

