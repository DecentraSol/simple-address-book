<script>
    import "carbon-components-svelte/css/all.css";
    import {ToastNotification} from "carbon-components-svelte";
    import Modals from "$lib/components/Modals.svelte";
    import { showNotification, notificationMessage,qrCodeOpen,qrCodeData } from "../stores.js"
</script>

<Modals on:close={()=>$qrCodeOpen=false} qrCodeOpen={$qrCodeOpen} qrCodeData={$qrCodeData} />

{#if $showNotification}
    <ToastNotification kind="success" title="Success" subtitle={$notificationMessage} />
{/if}

<slot></slot>