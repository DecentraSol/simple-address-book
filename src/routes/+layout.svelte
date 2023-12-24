<script>
    import { onDestroy, onMount } from "svelte";
    import "carbon-components-svelte/css/all.css";
    import { Theme, ToastNotification } from "carbon-components-svelte";
    import Modals from "$lib/components/Modals.svelte";
    import { contentTopic, AddressCardMessage } from "../utils.js";
    import { createLightNode, waitForRemotePeer, Protocols, createEncoder, createDecoder } from "@waku/sdk";
    import { showNotification, notificationMessage, qrCodeOpen, qrCodeData, wakuNode, myDal, identity, myAddressBook } from "../stores.js";

    const COMMAND_SEND_ADDRESS = 'SEND-ADDRESS';
    const COMMAND_DELIVER_ADDRESS = 'DELIVER-ADDRESS';

    const urlParams = new URLSearchParams(window.location.search);
    const decoder = createDecoder(contentTopic);
    const encoder = createEncoder({ contentTopic: contentTopic, ephemeral: true });
    let theme = "g90";
    let subscription;

    async function handleMount() {
        $wakuNode = await createLightNode({ defaultBootstrap: true });
        await $wakuNode.start();
        await waitForRemotePeer($wakuNode, [Protocols.LightPush]);

        subscription = await $wakuNode.filter.createSubscription();
        await subscription.subscribe([decoder], handleMessage);
    }

    function handleMessage(wakuMessage) {
        if (!wakuMessage.proto.payload) return;
        const messageObj = AddressCardMessage.decode(wakuMessage.payload);

        if (messageObj.recipient !== $identity) return;

        switch (messageObj.command) {
            case COMMAND_SEND_ADDRESS:
                sendMyAddress(messageObj.sender, $myAddressBook.find((entry) => entry.own === true));
                break;
            case COMMAND_DELIVER_ADDRESS:
                updateAddressBook(messageObj);
                break;
            default:
                console.error(`Unknown command: ${messageObj.command}`);
        }
    }

    function updateAddressBook(messageObj) {
        const contactData = JSON.parse(messageObj.toJSON().data);
        $myAddressBook.push({ firstName: contactData.firstName, lastName: contactData.lastName });
        $myAddressBook = $myAddressBook;
    }

    async function sendMyAddress(recipient, data) {
        const protoMessage = AddressCardMessage.create({
            timestamp: Date.now(),
            command: COMMAND_DELIVER_ADDRESS,
            sender: $identity,
            recipient: recipient,
            data: JSON.stringify(data)
        });
        const serialisedMessage = AddressCardMessage.encode(protoMessage).finish();
        await $wakuNode.lightPush.send(encoder, { payload: serialisedMessage });
    }

    async function handleDestroy() {
        await subscription.unsubscribe([contentTopic]);
    }

    onMount(handleMount);
    onDestroy(handleDestroy);
</script>

<Theme bind:theme />
<Modals on:close={() => $qrCodeOpen = false} qrCodeOpen={$qrCodeOpen} qrCodeData={$qrCodeData} dbMyDal={$myDal} />

{#if $showNotification}
    <ToastNotification kind="success" title="Success" subtitle={$notificationMessage} />
{/if}

<slot></slot>