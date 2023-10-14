<script>
  import { Router, Route } from 'svelte-navigator'
  import Header from './layouts/header.svelte'
  import AuthenticationLogin from './pages/authenticationLogin.svelte'
  import NotFound from './pages/notFound.svelte'
  import Footer from './layouts/footer.svelte'
  import ContactsList from './pages/contactsList.svelte'
  import ContactForm from './pages/contactForm.svelte'
  import Contact from './components/contact.svelte'
  import { fade } from 'svelte/transition'
  import {ipfs, db, user, contacts, isLoading, showSnackbarErrorContact} from './stores'
  import Signup from './pages/authenticationSignup.svelte'
  import { onMount } from "svelte";
  import { getContactsList } from './services/contact.ts';
  async function initializeOrbitDB() {

    if (!$ipfs) {
      const IPFSmodule = await import('./modules/ipfs-core/ipfs-core.js');
      const IPFS = IPFSmodule.default;
      $ipfs = await IPFS.create({
        EXPERIMENTAL: { pubsub: true },
        repo: './ipfs/1' }
      )
    }

    if (!$db) {
      const OrbitDBModul = await import('./modules/orbitdb-core/index.js');
      const createOrbitDB = OrbitDBModul.createOrbitDB;
      const IPFSAccessController = OrbitDBModul.IPFSAccessController
      console.log("mounted ipfs:",$ipfs)
      const orbitdb = await createOrbitDB({ipfs:$ipfs});
      console.log("mounted orbitdb:",orbitdb)
      //localStorage.removeItem("deCad")
      //check if deCad in localstorage has an existing orbit db address, if so take it otherwise create it and store it for later use
      const deCad = localStorage.getItem("deCad");

      $db = await orbitdb.open(deCad?deCad:'contacts-db', {
        type: 'keyvalue',
        AccessController: IPFSAccessController({ write: ['*'] })
      })

      console.log("orbitdb is",$db)
      if(!deCad) localStorage.setItem("deCad",$db.address)
      console.log(localStorage.getItem("deCad"));
      // deCad===undefined?//store it for next time so we are not everytime creating a new address
      // TODO we need a backup system for the deCad and db  (maybe a custodial service)
    }
  }

  onMount(async ()=> {
    console.log("mounting orbitdb")
    await initializeOrbitDB()

    $isLoading = true;

    const response = await getContactsList($db,$user._id);
    if (response) {
      $contacts = response;
      setTimeout(function () {
        $isLoading = false;
      }, 2000);
    } else {
      $showSnackbarErrorContact = true;
    }
  })
</script>

<div class="container-app">
  <!-- routes -->
  {#if false }
    <Router>
      <Route primary={false} path="/">
        <div class="route-component" transition:fade={{ duration: 700 }}>
          <AuthenticationLogin />
        </div>
      </Route>
      <Route primary={false} path="/signup">
        <div class="route-component" transition:fade={{ duration: 700 }}>
          <Signup />
        </div>
      </Route>
      <Route class="route-component" primary={false} path="*"><NotFound /></Route>
      <Footer />
    </Router>
    <!-- protected routes -->
  {:else if true || $user.isAuthenticated}
    <Router>
      <div transition:fade={{ duration: 0 }}>
        <Header />
      </div>
      <Route primary={false} path="/">
        <div class="route-component" transition:fade={{ duration: 700 }}>
          <ContactsList />
        </div>
      </Route>
      <Route primary={false} path="/contact-form">
        <div class="route-component" transition:fade={{ duration: 700 }}>
          <ContactForm />
        </div>
      </Route>
      <Route primary={false} path="/contact">
        <div class="route-component" transition:fade={{ duration: 700 }}>
          <Contact />
        </div>
      </Route>
      <Route path="*"><NotFound /></Route>
      <Footer />
    </Router>
  {/if}
</div>
