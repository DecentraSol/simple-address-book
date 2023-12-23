<script>
    import { createHelia } from 'helia';
    import { json } from '@helia/json';
    import { onMount } from 'svelte';
    import axios from 'axios'

    /** helia IPFS node instance
     (could be held in a Svelte store) */
    let helia;
    let j;

    /** last cid which holds the current count */
    let cid = '';
    /** current count according the data in IPFS network */
    let count = 0;

    /**
     * As the button component mounts we spin up an IFPS-node
     * inside the browser which is by default connecting
     * the the public ipfs network via WebRTC.
     * then we load the last count our Helia (IPFS) node.
     */
    onMount(async () => {
        helia = await createHelia();
        j = json(helia);
        if(cid) count = await j.get(cid)
    });

    const pin = async (cid) => {

        const data = JSON.stringify({
            hashToPin: cid
        })

        const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4OThhZmZjOC1iNmMwLTQxNjItYjk2Zi1mOWIyMzcyMmY3N2MiLCJlbWFpbCI6Im5pY29AbGUtc3BhY2UuZGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYWJjZDM5NjZmMWNlMTU1ZWE5MzEiLCJzY29wZWRLZXlTZWNyZXQiOiIzMWFkYzdhYmY0OGZmZTMxMDkwZGZlYTdkM2FlYzdmNTA3ODY2YzhjZDNiMWU5NmY0ZGIxOGJkZjk4YjJkNWE2IiwiaWF0IjoxNjk5MDIwNzYyfQ.8O3EmnjzpDOG0ygp5KEZVLf_pn6z9K3k9N7rh9UvJeA"
        // const res = await axios.post('https://api.pinata.cloud/pinning/pinByHash', {
        //     headers: {
        //         accept: 'application/json',
        //         authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4OThhZmZjOC1iNmMwLTQxNjItYjk2Zi1mOWIyMzcyMmY3N2MiLCJlbWFpbCI6Im5pY29AbGUtc3BhY2UuZGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYWJjZDM5NjZmMWNlMTU1ZWE5MzEiLCJzY29wZWRLZXlTZWNyZXQiOiIzMWFkYzdhYmY0OGZmZTMxMDkwZGZlYTdkM2FlYzdmNTA3ODY2YzhjZDNiMWU5NmY0ZGIxOGJkZjk4YjJkNWE2IiwiaWF0IjoxNjk5MDIwNzYyfQ.8O3EmnjzpDOG0ygp5KEZVLf_pn6z9K3k9N7rh9UvJeA'
        //     },
        //     body: data
        // })
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4OThhZmZjOC1iNmMwLTQxNjItYjk2Zi1mOWIyMzcyMmY3N2MiLCJlbWFpbCI6Im5pY29AbGUtc3BhY2UuZGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYWJjZDM5NjZmMWNlMTU1ZWE5MzEiLCJzY29wZWRLZXlTZWNyZXQiOiIzMWFkYzdhYmY0OGZmZTMxMDkwZGZlYTdkM2FlYzdmNTA3ODY2YzhjZDNiMWU5NmY0ZGIxOGJkZjk4YjJkNWE2IiwiaWF0IjoxNjk5MDIwNzYyfQ.8O3EmnjzpDOG0ygp5KEZVLf_pn6z9K3k9N7rh9UvJeA'
            }
        };

        fetch('https://api.pinata.cloud/pinning/pinByHash', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
    }
    /**
     * Increments count and stores it back to IPFS.
     */
    const increment = async () => {
        cid = await j.add(++count+" ich bin noch nicht im ipfs");
        await pin(cid.toString())
    };
</script>

<button on:click={increment}>
    IPFS-Counter: {count}
</button>

{#if cid}
    <div>
        <a href={`https://ipfs.io/ipfs/${cid}`}
           target="_blank">stored at cid: {cid}</a>
    </div>
{/if}

<style>
    button {
        background: yellowgreen;
        color: black;
    }
</style>