<script>
    import { onDestroy, onMount } from "svelte";
    import "carbon-components-svelte/css/all.css";
    import { Theme, ToastNotification } from "carbon-components-svelte";
    import Modals from "$lib/components/Modals.svelte";
    import { showNotification, notificationMessage, qrCodeOpen, qrCodeData, myDal, subscription } from "../stores.js";
    import { handleMount, CONTENT_TOPIC } from "../network/operations.js"

    const urlParams = new URLSearchParams(window.location.search);

    let theme = "g90";

    async function handleDestroy() {
        await $subscription.unsubscribe([CONTENT_TOPIC]);
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