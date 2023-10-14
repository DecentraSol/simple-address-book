<script>
    import QRCode from 'qrcode-generator';
    import { onMount } from "svelte";
    import { Theme, Button,
        TextInput, ToastNotification,
        Modal, Checkbox, DataTable, Grid, Column, Row } from "carbon-components-svelte";
    import "carbon-components-svelte/css/all.css";
    import { ipfs, db, contacts } from "../stores.js"
    let theme = "g90";

    //QR Modal
    let showModal = true;
    let qrData = "";

    //notification
    let showNotification = false;
    let notificationMessage = '';

    let selectedRowIds = [];
    let selectedAddress = {
        firstname: "",
        lastname: "",
        street: "",
        zipcode: "",
        city: "",
        country: "",
        own: false,
        orbitDbAddress: ""
    };
    const DEFAULT_DB_NAME = "deCad01"

    let open = false;
    let IPFSAccessController;
    let deCad; //the address of the main db (stored also in localstorage)

    $: loadAddress(selectedRowIds[0])
    function dropDB(){
        $db.drop()
        localStorage.removeItem(DEFAULT_DB_NAME)
    }
    async function initIPFS() {
        const IPFSmodule = await import('../modules/ipfs-core/ipfs-core.js');
        const IPFS = IPFSmodule.default;
        return await IPFS.create({ EXPERIMENTAL: { pubsub: true }, repo: './ipfs/1' });
    }

    /**
     * @param ipfsInstance
     */
    async function initOrbitDB(ipfsInstance,dbName) {
        const _dbName = dbName?dbName:DEFAULT_DB_NAME
        const OrbitDBModul = await import('../modules/orbitdb-core/index.js');
        const createOrbitDB = OrbitDBModul.createOrbitDB;
        IPFSAccessController = OrbitDBModul.IPFSAccessController;
        const orbitdb = await createOrbitDB({ ipfs  : ipfsInstance });
        deCad = localStorage.getItem(_dbName);
        return await orbitdb.open(_dbName, {
            type: 'keyvalue',
            AccessController: IPFSAccessController({ write: ['*'] })
        });
    }

    onMount(async () => {
        if (!$ipfs) $ipfs = await initIPFS();
        if (!$db) $db = await initOrbitDB($ipfs);
        // dropDB()
        console.log("orbitdb is",$db)
        if(!deCad) localStorage.setItem("deCad",$db.address)

        $db.events.on("update", async (entry) => {
            const dbAll = await $db.all()

            for (let i = 0; i < dbAll.length; i++) {
                dbAll[i].id =  await sha256(JSON.stringify(dbAll[i]))
            }

            $contacts = dbAll.map(a => {
                const newElement = a.value
                return newElement
            });
        })
        $db.events.on('join', async (peerId, heads) => {
            console.log(peerId, (await $ipfs.id()).id)
        })
        const dbAll = await $db.all()
        for (let i = 0; i < dbAll.length; i++) {
            dbAll[i].id =  await sha256(JSON.stringify(dbAll[i]))
        }
        $contacts = dbAll.map(a => {
            const newElement = a.value
            return newElement
        });
        console.log("$contacts",$contacts)
    });
    async function sha256(input) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    async function addContact() {
        const id = await sha256(JSON.stringify(selectedAddress));
        selectedAddress.id = id;
        const newAddressHash = await $db.put(id, selectedAddress);
        selectedAddress = {};
        notify("Contact added successfully!");
    }

    async function updateContact(contact) {
        const contact4Update = contact?contact:selectedAddress
        //const id = contact?contact.id:selectedAddress.id;

        const deletedHash = await $db.del(contact4Update.id)
        const updateHash = await $db.put(contact4Update.id,selectedAddress)
        notify("Contact updated successfully!")
        return {deletedHash,updateHash}
    }

    async function deleteContact() {
        const deletedHash = await $db.del(selectedAddress.id)
        notify("Contact deleted successfully!")
        return {deletedHash}
    }

    function notify(message) {
       notificationMessage = message;
       showNotification = true;
       setTimeout(() => showNotification = false, 3000);
    }

    async function loadAddress(hash) {
        if (!$db) return;
        selectedAddress = $contacts.find(obj => obj.id === hash) || await $db.get(hash) || {};
    }

    function generateQRCode(data) {
        const qr = QRCode(4, 'L');
        qr.addData(data);
        qr.make();
        return qr.createImgTag(6);
    }

    /**
     * Takes a contact object puts all attributes into the db
     * return the address of the orbitdb
     * @param contact
     */
    async function createNewOrbitDBWithContact(contact) {
        console.log("creating new db for",contact)
        const contactDB = await initOrbitDB($ipfs,"testdb");

        for (const p in contact) {
            if(p!=="qr") {
                console.log(`adding ${p}: ${contact[p]}`);
                contactDB.put(p,contact[p])
            }
        }
        console.log("contactDB",contactDB.address)
        return contactDB.address;
    }

    /**
     *
     * @param contact
     */
    async function generateQRForContact(contact) {
        contact.orbitDbAddress = await createNewOrbitDBWithContact(contact);
        await updateContact(contact);
        qrData = contact.orbitDbAddress
        console.log("open ",qrData)
        showModal = true
    }
</script>

<Button on:click={() => (open = true)}>Create database</Button>

<Modal  size="xs"
        bind:open
        modalHeading="Create database"
        primaryButtonText="Confirm"
        secondaryButtonText="Cancel"
        on:click:button--secondary
        on:open
        on:close
        on:submit
>
    <p>Create a new Cloudant database in the US South region.</p>
</Modal>


<Modal
        bind:open
        modalHeading="Create database"
        primaryButtonText="Confirm"
        secondaryButtonText="Cancel"
        on:click:button--secondary={() => (open = false)}
        on:open
        on:close
        on:submit
>
    <label>{qrData}</label>
    {@html generateQRCode(qrData)}
    <button on:click={() => showModal = false}>Close</button>
</Modal>
{#if showNotification}
    <ToastNotification kind="success" title="Success" subtitle={notificationMessage} />
{/if}

<main>
    <section>
        <h2>Decentralized Addressbook</h2>
        <Grid>
             <Row>
                 <Column><TextInput size="sm" labelText="firstname" placeholder="Enter firstname..."
                                    bind:value={selectedAddress.firstname} /></Column>
                 <Column><TextInput size="sm" labelText="lastname" placeholder="Enter lastname..."
                                    bind:value={selectedAddress.lastname} /></Column>
             </Row>
             <Row>
                <Column><TextInput  size="sm" labelText="street" placeholder="Enter street..."
                                    bind:value={selectedAddress.street}  /></Column>
                 <Column><TextInput  size="sm" labelText="zipcode" placeholder="Enter zipcode..."
                                     bind:value={selectedAddress.zipcode}  /></Column>
             </Row>
            <Row>
                <Column><TextInput  size="sm" labelText="city" placeholder="Enter city..."
                                    bind:value={selectedAddress.city}  /></Column>
                <Column><TextInput  size="sm" labelText="country" placeholder="Enter country..."
                                        bind:value={selectedAddress.country}  /></Column>
            </Row>
            <Row>
                <Column><Checkbox labelText="my own" bind:checked={selectedAddress.own} /></Column>
            </Row>
            <Row>
                <Column>
                    {#if selectedAddress.id}
                        <Button on:click={() => updateContact()}>Update Contact</Button>
                        <Button on:click={() => deleteContact()}>Delete Contact</Button>
                    {:else}
                        <Button on:click={() => addContact()}>Add Contact</Button>
                    {/if}

                </Column>
            </Row>
        </Grid>
    </section>

    <section>
        <DataTable
                radio
                sortable
                on:click={event => {

                    console.log(event.detail)
                    if (event?.detail?.cell?.key === 'qr') {
                        generateQRForContact(event.detail.row);
                    }
                }}
                bind:selectedRowIds
                headers={[
                        { key: "lastname", value: "Name" },
                        { key: "firstname", value: "Firstname" },
                        { key: "street", value: "Street" },
                        { key: "zipcode", value: "ZipCode" },
                        { key: "city", value: "City" },
                        { key: "country", value: "Country" },
                        { key: "qr", value: "" },
                ]}
                rows={$contacts.map(contact => ({
                    ...contact,
                    qr: '📷'
                }))}
        />
    </section>
</main>
