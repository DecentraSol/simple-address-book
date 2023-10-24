<script>
    import {DataTable} from "carbon-components-svelte";
    import {contacts, selectedRowIds} from "../../stores.js";
    import {generateQRForAddress} from "../../operations.js"

</script>

<DataTable
            radio
            sortable
            on:click={event => {
                    console.log(event.detail)
                    if (event?.detail?.cell?.key === 'qr') {
                         generateQRForAddress(event.detail.row);
                    }
                }}
            bind:selectedRowIds={$selectedRowIds}
            headers={[
                        { key: "lastname", value: "Name" },
                        { key: "firstname", value: "Firstname" },
                        { key: "street", value: "Street" },
                        { key: "zipcode", value: "ZipCode" },
                        { key: "city", value: "City" },
                        { key: "country", value: "Country" },
                        { key: "own", value: "own" }
                ]}
            rows={$contacts}
    />
