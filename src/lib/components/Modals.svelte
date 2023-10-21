<script>
    import {Modal} from "carbon-components-svelte";
    import QRCode from "qrcode-generator";
    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();
    import { clickToCopy } from "../../utils.js"
    import {selectedAddress} from "../../stores.js";
    /**
     * @type {boolean}
     * when true qr-code modal is open
     */
    export let qrCodeOpen = false

    /**
     * the data to be transformed into an qr-code
     * @type {string}
     */
    export let qrCodeData

    /**
     * Generates a QR-Code with the given data
     * @param {string}data
     * @return {string} the
     */
    function generateQRCode(data) {
        const qr = QRCode(4, 'L');
        qr.addData(data);
        qr.make();
        return qr.createImgTag(6);
    }

    let text = '';
    function copySuccess(){
        text = "Copied!"
    }

    function copyError(event){
        text = `Error! ${event.detail}`
    }

    $: console.log("qrCodeOpen",qrCodeOpen)

</script>
<svelte:window on:copysuccess={copySuccess} on:copyerror={copyError}/>
<Modal bind:open={qrCodeOpen}
       modalHeading="Scan (DAL) - Decentralized Address Link"
       primaryButtonText="OK"
       secondaryButtonText=""
       on:click:button--primary={ () => dispatch('close') }
       on:click:button--secondary={ () => dispatch('close') }
       on:close={()=>dispatch('close')}>
    <label use:clickToCopy>{qrCodeData}</label>&nbsp;<span>{text}</span><br>
    {#if qrCodeData && qrCodeOpen}{@html generateQRCode(qrCodeData)}{/if}

</Modal>