<script>
    import { onMount } from "svelte";
    import { ipfs, orbitDB, contacts, selectedRowIds } from "../stores.js"
    import { sha256 } from "../utils.js"
    import { initIPFS, initOrbitDB } from "../init.js"
    import { loadContact } from "../operations.js";
    import ContactTable from "$lib/components/ContactTable.svelte";
    import ContactForm from "$lib/components/ContactForm.svelte";

    let deCad; //the address of the main orbitDB (stored also in localstorage)

    onMount(async () => {
        if (!$ipfs) $ipfs = await initIPFS();
        const initOrbitData = await initOrbitDB($ipfs)
        deCad = initOrbitData.deCad;
        if (!$orbitDB) $orbitDB = initOrbitData.orbitDB;
        console.log("orbitdb is",$orbitDB)
        if(!deCad) localStorage.setItem("deCad",$orbitDB.address)

        // dropDB()
        $orbitDB.events.on("update", async (entry) => {
            const dbAll = await $orbitDB.all()

            // for (let i = 0; i < dbAll.length; i++) {
            //     dbAll[i].id =  await sha256(JSON.stringify(dbAll[i]))
            // }

            $contacts = dbAll.map(a => {
                const newElement = a.value
                return newElement
            });
        })

        $orbitDB.events.on('join', async (peerId, heads) => {
            console.log(peerId, (await $ipfs.id()).id)
        })

        const dbAll = await $orbitDB.all()
        for (let i = 0; i < dbAll.length; i++) {
            console.log("dbAll[i]",dbAll[i])
           // dbAll[i].id =  await sha256(JSON.stringify(dbAll[i])) //TODO add sha256 only beofre adding
        }
        $contacts = dbAll.map(a => {
            const newElement = a.value
            return newElement
        });
        console.log("$contacts",$contacts)
    });

    $: loadContact($selectedRowIds[0]) //loads the selected contact into the contact form
</script>
<h2>Decentralized Addressbook</h2> {$orbitDB?.address}
<ContactForm/>
<ContactTable/>
