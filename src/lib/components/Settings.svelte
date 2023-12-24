<script>
    import { Button, TextInput, Dropdown, Column, Grid, Row } from "carbon-components-svelte";
    import {myAddressBook, myDal, identity} from "../../stores.js"
    import {notify} from "../../utils.js";
    let nameOfDb, dbNameOrAddress,id;

    $:window.localStorage.setItem('identity', $identity);
</script>
<!--
 @component Settings component displays current address of db and my identity
 The identity is used in order to set write permissions for the databases
*/
-->
<Grid>
    <Row>
        <Column sm={3}><TextInput labelText="My Identity"  size="sm" bind:value={$identity} /></Column>

        <!--   <Column sm={3}><TextInput labelText="IPFS pubSubPeers" readonly size="sm" bind:value={pubSubPeers} /></Column>-->
    </Row>
    <Row>
        <Column sm={3}><TextInput labelText="DB name" dsize="sm" readonly size="sm" bind:value={nameOfDb} />

        </Column>
    </Row>
    <Row>
        <Column sm={2}><TextInput labelText="Current DB-Address" size="sm" bind:value={dbNameOrAddress} /></Column>
        <Column sm={1}><Button size="sm" on:click={() => {
            //change-address
             }
            }>Load</Button></Column>
    </Row>

<!--    <Row>-->
<!--        <Column sm={3}><TextInput labelText="Access" readonly size="sm" bind:value={accessWrite} /></Column>-->
<!--    </Row>-->
    <Row>
        <Column sm={3}><TextInput labelText="IPFS Peer ID" readonly size="sm" bind:value={id} /></Column>

        <!--   <Column sm={3}><TextInput labelText="IPFS pubSubPeers" readonly size="sm" bind:value={pubSubPeers} /></Column>-->
    </Row>
    <Row>
<!--        <Column sm={3}> <Dropdown-->
<!--                titleText="Ipfs.Swarm.Peers"-->
<!--                items={-->
<!--                peerList.map( p => {-->

<!--                    return { id: p?.id, text: p?.id+" - ("+p?.addrs?.length+") - "+p.addrs[0].toString()}-->
<!--                })-->
<!--                }-->
<!--        /></Column>-->
    </Row>
    <Row>
<!--        <Column sm={3}><Button data-cy="dropDB" size="sm" on:click={()=>{-->
<!--            $myAddressBook.drop()-->
<!--            $myDal.drop()-->
<!--            notify("Db dropped!")-->
<!--        }}>Drop DB</Button></Column>-->
    </Row>
</Grid>