<script>
    import { onDestroy, onMount } from "svelte";
    import "carbon-components-svelte/css/all.css";
    import { Theme, ToastNotification } from "carbon-components-svelte";
    import Modals from "$lib/components/QRCodeModal.svelte";
    import { showNotification, notificationMessage, showModal, qrCodeOpen, qrCodeData, myDal, subscription, modalData } from "../stores.js";
    import { startNetwork, CONTENT_TOPIC } from "../network/operations.js"
    import AddressModal from "$lib/components/AddressModal.svelte";

    const urlParams = new URLSearchParams(window.location.search);

    let theme = "g90";

    async function handleDestroy() {
        await $subscription.unsubscribe([CONTENT_TOPIC]);
    }

    onMount(startNetwork);
    onDestroy(handleDestroy);
</script>

<Theme bind:theme />
    <Modals on:close={() => $qrCodeOpen = false} bind:qrCodeOpen={$qrCodeOpen} qrCodeData={$qrCodeData} dbMyDal={$myDal} />

    {#if $showNotification}
        <ToastNotification kind="success" title="Success" subtitle={$notificationMessage} />
    {/if}
    {#if $showModal}
        <AddressModal bind:modalOpen={$showModal} data={$modalData}/>
    {/if}

<slot></slot>