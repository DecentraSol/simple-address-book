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
  import { user, contacts,isLoading} from './stores'
  import Signup from './pages/authenticationSignup.svelte'
  // import {
  //   user,
  //   filteredContacts,
  //   contacts,
  //   isLoading,
  //   showSnackbarErrorContact,
  // } from '../stores';

  import {ipfsTest} from "./simple-ipfs-test";

  ipfsTest()
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
