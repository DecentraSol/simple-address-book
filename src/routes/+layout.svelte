<script>
    import "carbon-components-svelte/css/all.css";
    import {Theme,ToastNotification} from "carbon-components-svelte";
    import Modals from "$lib/components/Modals.svelte";
    import { showNotification, notificationMessage,qrCodeOpen,qrCodeData,dbMyDal,dbUrl } from "../stores.js"
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has("db")) $dbUrl = urlParams.get("db");

    let theme = "g90";
</script>
<Theme bind:theme />
<Modals on:close={()=>$qrCodeOpen=false} qrCodeOpen={$qrCodeOpen} qrCodeData={$qrCodeData} dbMyDal={$dbMyDal} />

{#if $showNotification}
    <ToastNotification kind="success" title="Success" subtitle={$notificationMessage} />
{/if}
<slot></slot>