<script>
     import {selectedAddress} from "../../stores.js";
     import {addContact, deleteContact, updateContact} from "../../operations.js";
     import {Button, Checkbox, Column, Grid, Row, TextInput} from "carbon-components-svelte";
</script>

<section>
    <Grid>
        <Row>
            <Column><TextInput size="sm" labelText="firstname" placeholder="Enter firstname..."
                               bind:value={$selectedAddress.firstname} /></Column>
            <Column><TextInput size="sm" labelText="lastname" placeholder="Enter lastname..."
                               bind:value={$selectedAddress.lastname} /></Column>
        </Row>
        <Row>
            <Column><TextInput  size="sm" labelText="street" placeholder="Enter street..."
                                bind:value={$selectedAddress.street}  /></Column>
            <Column><TextInput  size="sm" labelText="zipcode" placeholder="Enter zipcode..."
                                bind:value={$selectedAddress.zipcode}  /></Column>
        </Row>
        <Row>
            <Column><TextInput  size="sm" labelText="city" placeholder="Enter city..."
                                bind:value={$selectedAddress.city}  /></Column>
            <Column><TextInput  size="sm" labelText="country" placeholder="Enter country..."
                                bind:value={$selectedAddress.country}  /></Column>
        </Row>
        <Row>
            <Column><Checkbox labelText="my own" bind:checked={$selectedAddress.own} /></Column>
        </Row>
        <Row>
            <Column>
                {#if $selectedAddress.id}
                    <Button size="sm" on:click={() => updateContact()}>Update</Button>
                    <Button size="sm" on:click={() => deleteContact()}>Delete</Button>
                    <Button size="sm" on:click={() => $selectedAddress = {}}>New</Button>
                {:else}
                    <Button size="sm" on:click={() => addContact()}>Add </Button>
                {/if}
            </Column>
        </Row>
    </Grid>
</section>