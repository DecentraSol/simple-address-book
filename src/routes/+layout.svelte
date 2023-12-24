<script>
    import {onDestroy, onMount} from "svelte";
    import "carbon-components-svelte/css/all.css";
    import {Theme,ToastNotification} from "carbon-components-svelte";
    import Modals from "$lib/components/Modals.svelte";
    import { contentTopic, AddressCardMessage } from "../utils.js"

    import { createLightNode,waitForRemotePeer,Protocols, createEncoder, createDecoder} from "@waku/sdk";
    import {
        showNotification,
        notificationMessage,
        qrCodeOpen,
        qrCodeData,
        wakuNode,
        myDal,
        identity,
        myAddressBook
    } from "../stores.js"
    const urlParams = new URLSearchParams(window.location.search);

    let subscription

    const decoder = createDecoder(contentTopic);
    const encoder = createEncoder({
        contentTopic: contentTopic,
        ephemeral: true // allows messages not be stored on the network
    });
    // if(urlParams.has("db")) $dbUrl = urlParams.get("db");

    let theme = "g90";
    onMount(async () => {
        console.log("mounting layout")
        $wakuNode = await createLightNode({ defaultBootstrap: true });
        console.log("LightNode created",$wakuNode)
        await $wakuNode.start();
        console.log("wakuNode started",$wakuNode)
        await waitForRemotePeer($wakuNode, [
            Protocols.LightPush,
            // Protocols.Filter,
        ]);

        const callback = (wakuMessage) => {
            if (!wakuMessage.proto.payload) return;
            const messageObj = AddressCardMessage.decode(wakuMessage.payload);
            if(messageObj.recipient===$identity && messageObj.command==='SEND-ADDRESS'){
                console.log(`returning my address to ${messageObj.sender}!`)
                sendMyAddress(messageObj.sender, $myAddressBook.find((entry) => entry.own === true))
            }
            if(messageObj.recipient===$identity && messageObj.command==='DELIVER-ADDRESS'){
                console.log(`received Address from ${messageObj.sender}!`)
                const messageJSON = messageObj.toJSON()
                console.log("messageObj",messageJSON)
                console.log("messageObj.data",JSON.parse(messageJSON.data))
                const contactData = JSON.parse(messageJSON.data)
                $myAddressBook.push({firstName:contactData.firstName, lastName:contactData.lastName})
                $myAddressBook = $myAddressBook
                console.log("myAddressBook",$myAddressBook)
            }
        }

        const sendMyAddress = async (recipient, data) => {
            console.log("sendMyAddress to", recipient)
            console.log("sendMyAddress data", data)
            const protoMessage = AddressCardMessage.create({
                timestamp: Date.now(),
                command: "DELIVER-ADDRESS",
                sender: $identity,
                recipient: recipient,
                data: JSON.stringify(data)
            });
            const serialisedMessage = AddressCardMessage.encode(protoMessage).finish();
            await $wakuNode.lightPush.send(encoder, {
                payload: serialisedMessage,
            });
            console.log("DELIVER-ADDRESS command sent")
        }

        subscription = await $wakuNode.filter.createSubscription();
        await subscription.subscribe([decoder], callback);
        console.log("subscription ok")
    });

    onDestroy(async ()=>{
        await subscription.unsubscribe([contentTopic]);
    })
</script>
<Theme bind:theme />
<Modals on:close={()=>$qrCodeOpen=false} qrCodeOpen={$qrCodeOpen} qrCodeData={$qrCodeData} dbMyDal={$myDal} />

{#if $showNotification}
    <ToastNotification kind="success" title="Success" subtitle={$notificationMessage} />
{/if}
<slot></slot>