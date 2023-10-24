<script>
    import { Button, TextInput, Column, Grid, Row } from "carbon-components-svelte";
    import {initOrbitDB} from "../../init.js"
    import { ipfs, orbitDB, contacts } from "../../stores.js"
    import {notify} from "../../utils.js";

    let dbNameOrAddress;
    let nameOfDb;
    let myId;
    let found;
    $:{
        if($orbitDB && !found){ //only one time
            dbNameOrAddress = $orbitDB?.address
            myId = $orbitDB?.identity?.id
            nameOfDb = $orbitDB.name
            found = true
        }
    }
    const changeAddress = async () => {
            const dbObject =  await initOrbitDB($ipfs,dbNameOrAddress)

            $orbitDB = dbObject.orbitDB
        {
            //TODO put this into a function to load all contacts after initializatino of database
            const dbAll = await $orbitDB.all()
            $contacts = (dbAll.map(a => {
                const newElement = a.value
                return newElement
            }));

            $orbitDB.events.on("update", async (entry) => {
                console.log(entry) //it is not necessary to add this to the contacts because it is allready insdie
                const dbAll = await $orbitDB.all()

                $contacts = (dbAll.map(a => {
                    const newElement = a.value
                    return newElement
                }));
            })
        }

            // $orbitDB.drop()
            dbNameOrAddress = $orbitDB.address
            nameOfDb = $orbitDB.name
            notify(`main addres db loaded! address:${$orbitDB.address}`);
    }

</script>
<!--
 @component Settings component displays current address of db and my identity
 The identity is used in order to set write permissions for the databases
*/
-->
<Grid>
    <Row>
        <Column sm={1}>DB name:</Column>
        <Column sm={3}><TextInput disabled size="sm" bind:value={nameOfDb} /></Column>
    </Row>
    <Row>
        <Column sm={1}>Current DB-Address:</Column>
        <Column sm={2}><TextInput size="sm" bind:value={dbNameOrAddress} /></Column>
        <Column sm={1}><Button size="sm" on:click={changeAddress}>Load</Button></Column>
    </Row>
    <Row>
        <Column sm={1}>My Identity:</Column>
        <Column sm={3}><TextInput disabled size="sm" bind:value={myId} /></Column>
    </Row>
</Grid>