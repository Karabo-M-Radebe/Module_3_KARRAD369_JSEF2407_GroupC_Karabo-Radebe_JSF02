<script>
  import { Router, Route,} from 'svelte-routing';
  import Navbar from './lib/Navbar.svelte';
  import Home from './pages/Home.svelte';
  import CardDetailView from './pages/CardDetailView.svelte';
  import Login from './pages/Login.svelte';
</script>

<Navbar />

<Router>
  <Route path="/" component={Home} />
  <Route path="products/:id" component={CardDetailView} />
  <Route path="login" component={Login} />
</Router>

  