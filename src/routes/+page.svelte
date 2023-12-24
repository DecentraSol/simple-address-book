<script>
    import { Tabs, Tab, TabContent, Button, TextInput, Column, Grid, Row} from "carbon-components-svelte";
    import { selectedTab, selectedRowIds, qrCodeOpen, qrCodeData, wakuNode, identity } from "../stores.js"
    import { createEncoder} from "@waku/sdk";

    import { loadContact } from "../operations.js"
    import { contentTopic, AddressCardMessage } from "../utils.js"
    import ContactForm from "$lib/components/ContactForm.svelte";
    import ContactList from "$lib/components/ContactList.svelte";
    import Settings from "$lib/components/Settings.svelte";

    let datastore
    $: loadContact($selectedRowIds[0])
    let scannedAddress

    const encoder = createEncoder({
        contentTopic: contentTopic,
        ephemeral: true // allows messages not be stored on the network
    });
    const sendAddress = async () => {
        console.log("importDAL")
        const protoMessage = AddressCardMessage.create({
            timestamp: Date.now(),
            command: "SEND-ADDRESS",
            sender: $identity,
            recipient: scannedAddress,
        });
        const serialisedMessage = AddressCardMessage.encode(protoMessage).finish();
        await $wakuNode.lightPush.send(encoder, {
            payload: serialisedMessage,
        });
        console.log("SEND-ADDRESS command sent")
    }
</script>
<!--
@component AddressBook
-->
<h2>Decentralized Addressbook of {$identity}</h2>
<Tabs class="tabs" bind:selected={$selectedTab}>
    <Tab label="Contacts" data-cy="contacts"/>
    <Tab label="My Address" data-cy="address"/>
    <Tab label="Settings"  data-cy="settings"/>
    <svelte:fragment slot="content">
        <TabContent>
            <Grid fullWidth>
                <Row>
                    <Column><TextInput size="sm" bind:value={scannedAddress}/></Column>
                    <Column><Button size="sm" on:click={() => sendAddress()}>Scan Contact</Button></Column>
                    <Column><Button size="sm" on:click={() => {
                        $qrCodeData = "i am alice"
                        $qrCodeOpen = !$qrCodeOpen
                    }
                    }>My QR-Code</Button></Column>
                </Row>
            </Grid>
            <ContactList/>
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

