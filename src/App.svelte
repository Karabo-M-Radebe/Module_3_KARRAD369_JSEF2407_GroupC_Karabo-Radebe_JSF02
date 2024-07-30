<script>
  import { Router, Route,} from 'svelte-routing';
  import Navbar from './lib/Navbar.svelte';
  import Home from './pages/Home.svelte';
</script>

<Navbar />

<Router>
  <Route path="/" component={Home} />
</Router>

  