<script>
  import { Router, Route,} from 'svelte-routing';
  import Navbar from './lib/Navbar.svelte';
  import Home from './lib/Home.svelte';
</script>

<Navbar />

<Router>
  <Route path="/" component={Home} />
</Router>

  