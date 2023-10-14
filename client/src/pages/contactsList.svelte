<script>
    import GenericBtn from '../components/genericBtn.svelte';

    import { t } from '../i18n/i18n';
    import {
        db,
        user,
        filteredContacts,
        contacts,
        isLoading,
        showSnackbarErrorContact,
    } from '../stores';

    import Searchbar from '../components/searchbar.svelte';
    import GenericSnackbar from '../components/genericSnackbar.svelte';
    import ContactItem from '../components/contactItem.svelte';
    import { fade } from 'svelte/transition';
    import { ProgressLinear } from 'smelte';
    $: console.log("contacts", contacts)
</script>

<GenericSnackbar />
<div class="link-div">
    <GenericBtn
        testid="add-contact-btn"
        methodBtn="addContact"
        colorBtn="secondary"
        textBtn="addContact"
        iconBtn="add"
    />
</div>
<Searchbar />
<div class="list">
    {#if $isLoading}
        <span transition:fade={{ duration: 2000 }}>
            <ProgressLinear color="success" /></span>
    {:else}
        <ul transition:fade={{ duration: 1000 }}>
            {#if !$filteredContacts}
                <p>{$t('noContactRegistered')}</p>
            {/if}
            {#each $filteredContacts as contactItem}
                <li>
                    <ContactItem {contactItem} />
                </li>
            {/each}
        </ul>
    {/if}
</div>
