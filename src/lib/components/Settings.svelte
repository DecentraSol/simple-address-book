<script>
    import { Button, TextInput, Dropdown, Column, Grid, Row } from "carbon-components-svelte";
    import IpfsCounter from "$lib/components/IpfsCounter.svelte"
    // import {initOrbitDB} from "../../init.js"
    import {myAddressBook, dbMyDal} from "../../stores.js"
    import {notify} from "../../utils.js";

    let dbNameOrAddress;
    let nameOfDb;
    let id, version;
    let identity;
    let found;
    // let accessWrite;
    let pubSubPeers
    let peerList = [];
    // function mapToSting(map){
    //     let obj = ""
    //     for (let [k,v] of map)
    //         obj+=[k]+"<br>"
    //     return obj
    // }
    /*const getIpfsInfos = async () => {
        id =  (await $ipfs.id()).id
        version =  (await $ipfs.version()).version
        peerList = await $ipfs.swarm.addrs()
        console.log("IPFS version:", (await $ipfs.version()).version);
        console.log(`Peer ID:`,id);

        const myid = $ipfs.libp2p.id
        console.log("peerInfo",myid)
        const topic = 'fruit-of-the-day'
        const receiveMsg = async(msg) => {
            console.log(msg)
            const _id = msg.from
            if(_id==id){
                return
            }
                const p2pid = `/p2p-circuit/ipfs/${_id}`;
            await $ipfs.swarm.connect(p2pid);
        }

        await $ipfs.pubsub.subscribe(topic, receiveMsg)
        console.log(`subscribed to ${topic}`)

        await $ipfs.libp2p.pubsub.publish(
            topic, new TextEncoder().encode(myid));
            peerInfo.id.toB58String();
        console.log("libp2p ID:", myid);
        for (const ma of $ipfs.libp2p.peerInfo.multiaddrs.toArray()) {
            console.log("multiaddr:", ma.toString());
        }
    }*/
    $:{
        // if($ipfs){
        //     getIpfsInfos()
        // }
        // if($myAddressBook && !found){ //only one time
        //     dbNameOrAddress = $myAddressBook?.address
        //     // identity = $myAddressBook?.identity?.id
        //     // nameOfDb = $myAddressBook.name
        //     found = true
        //     // accessWrite= $myAddressBook.access.write
        //     // pubSubPeers = mapToSting($ipfs.libp2p.pubsub.peers)
        //
        // }
    }
  /*  const changeAddress = async () => {
            $myAddressBook  =  await initOrbitDB($ipfs,dbNameOrAddress)
            localStorage.setItem("dbName",$myAddressBook.address)
        {
            //TODO put this into a function to load all contacts after initializatino of database
            const dbAll = await $myAddressBook.all()
            //$contacts = (dbAll.map(a => {
                const newElement = a.value
                return newElement
            }));

            $myAddressBook.events.on("update", async (entry) => {
                console.log(entry) //it is not necessary to add this to the contacts because it is allready insdie
                const dbAll = await $myAddressBook.all()

                $contacts = (dbAll.map(a => {
                    const newElement = a.value
                    return newElement
                }));
            })
        }


        dbNameOrAddress = $myAddressBook.address
        nameOfDb = $myAddressBook.name
        notify(`main addres db loaded! address:${$myAddressBook.address}`);
    } */

</script>
<!--
 @component Settings component displays current address of db and my identity
 The identity is used in order to set write permissions for the databases
*/
-->
<Grid>
    <Row>
        <Column sm={3}><TextInput labelText="DB name" dsize="sm" readonly size="sm" bind:value={nameOfDb} />

        <IpfsCounter/>
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
        <Column sm={3}><TextInput labelText="My Identity" readonly size="sm" bind:value={identity} /></Column>

     <!--   <Column sm={3}><TextInput labelText="IPFS pubSubPeers" readonly size="sm" bind:value={pubSubPeers} /></Column>-->
    </Row>
    <Row>
        <Column sm={3}> <Dropdown
                titleText="Ipfs.Swarm.Peers"
                items={
                peerList.map( p => {

                    return { id: p?.id, text: p?.id+" - ("+p?.addrs?.length+") - "+p.addrs[0].toString()}
                })
                }
        /></Column>
    </Row>
    <Row>
        <Column sm={3}><Button data-cy="dropDB" size="sm" on:click={()=>{
            $myAddressBook.drop()
            $dbMyDal.drop()
            notify("Db dropped!")
        }}>Drop DB</Button></Column>
    </Row>
</Grid>