<script>
    import { Tabs, Tab, TabContent,
        Button, TextInput, Column, Grid, Row } from "carbon-components-svelte";
    import {initOrbitDB} from "../../init.js"
    import { ipfs, orbitDB, contacts, selectedRowIds } from "../../stores.js"

    let dbNameOrAddress;
    let myId
    $:{
        if($orbitDB){
            dbNameOrAddress = $orbitDB?.address
            myId = $orbitDB?.identity?.id
        }

    }


    const changeAddress = async () => {
            console.log("changing db address to ",dbNameOrAddress)
            const dbObject =  await initOrbitDB($ipfs,dbNameOrAddress)
            $orbitDB = dbObject.orbitDB
            console.log("new main orbitdb loaded",$orbitDB)
    }

</script>
<Grid>
    <Row>
        <Column sm={1}>Current DB-Address:</Column>
        <Column sm={3}><TextInput bind:value={dbNameOrAddress} /><Button on:click={changeAddress}>Load DB</Button></Column>
    </Row>
    <Row>
        <Column sm={1}>My Id:</Column>
        <Column sm={3}><TextInput bind:value={myId} /></Column>
    </Row>
</Grid>