<script>
    import { Button, TextInput, Column, Grid, Row } from "carbon-components-svelte";
    import {initOrbitDB} from "../../init.js"
    import { ipfs, orbitDB, contacts, dals } from "../../stores.js"
    import {notify} from "../../utils.js";

    let dbNameOrAddress;
    let nameOfDb;
    let myId;
    let found;
    let accessWrite;
    let peers;
    function mapToSting(map){
        let obj = ""
        for (let [k,v] of map)
            obj+=[k]+"<br>"
        return obj
    }
    $:{
        if($orbitDB && !found){ //only one time
            dbNameOrAddress = $orbitDB?.address
            myId = $orbitDB?.identity?.id
            nameOfDb = $orbitDB.name
            found = true
            accessWrite= $orbitDB.access.write
            peers = mapToSting($ipfs.libp2p.pubsub.peers)
        }
    }
    $:console.log("dals in settings",$dals)

    const changeAddress = async () => {
            const dbObject =  await initOrbitDB($ipfs,dbNameOrAddress)

            $orbitDB = dbObject.orbitDB
            localStorage.setItem("dbName",$orbitDB.address)
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
        <Column sm={3}><TextInput labelText="DB name" dsize="sm" isabled size="sm" bind:value={nameOfDb} /></Column>
    </Row>
    <Row>
        <Column sm={2}><TextInput labelText="Current DB-Address" size="sm" bind:value={dbNameOrAddress} /></Column>
        <Column sm={1}><Button size="sm" on:click={changeAddress}>Load</Button></Column>
    </Row>
    <Row>
        <Column sm={3}><TextInput labelText="My Identity" disabled size="sm" bind:value={myId} /></Column>
    </Row>
    <Row>
        <Column sm={3}><TextInput labelText="Access" disabled size="sm" bind:value={accessWrite} /></Column>
    </Row>
    <Row>
        <Column sm={3}><TextInput labelText="IPFS peers" disabled size="sm" bind:value={peers} /></Column>
    </Row>
    <Row>
        <Column sm={3}><Button size="sm" on:click={()=>{
            $orbitDB.drop()
            notify("Db dropped!")
        }}>Drop DB</Button></Column>
    </Row>
</Grid>