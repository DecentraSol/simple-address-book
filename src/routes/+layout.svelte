<script>
    import "carbon-components-svelte/css/all.css";
    import {Theme,ToastNotification} from "carbon-components-svelte";
    import Modals from "$lib/components/Modals.svelte";
    import { showNotification, notificationMessage,qrCodeOpen,qrCodeData,dbMyDal } from "../stores.js"
    let theme = "g90";
</script>
<Theme bind:theme />
<Modals on:close={()=>$qrCodeOpen=false} qrCodeOpen={$qrCodeOpen} qrCodeData={$qrCodeData} dbMyDal={$dbMyDal} />

{#if $showNotification}
    <ToastNotification kind="success" title="Success" subtitle={$notificationMessage} />
{/if}
<slot></slot>
<style>
    button {
        margin: 1rem;
    }
</style>