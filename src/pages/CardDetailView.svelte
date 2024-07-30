<script>
    import { onMount } from 'svelte';
    import LoadingCard from '../components/LoadingCard.svelte';
    import Error from '../components/Error.svelte';
  
    let product = {};
    let error = null;
    let loading = false;
  
    export let id;
  
    async function getProductDetails(productId) {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
  
        if (!response.ok) {
          throw new error('Network response was not ok');
        }
  
        const data = await response.json();
        return { response: data, error: null };
      } catch (error) {
        return { response: null, error: error.message };
      }
    }
  
    onMount(async () => {
      loading = true;
      const { response, error: fetchError } = await getProductDetails(id);
      if (fetchError) {
        error = fetchError;
      } else {
        product = response;
      }
      loading = false;
    });
  </script>
  
  {#if error}
    <div class="flex justify-center p-5">
      <Error message={error} />
    </div>
  {:else if loading}
    <div class="flex justify-center p-5">
      <LoadingCard />
    </div>
  {:else}
  <div class="grid m-10 space-y-5">
    <a href="/">
        <button class="bg-gray-500 text-white py-2 px-4 rounded">Back</button>
    </a>
    <div class="flex flex-col items-center bg-white border-2 border-gray-500 p-4">
      
      <img class="object-contain h-48 mt-3 mb-3" src={product.image} alt={product.title} />
      <h1 class="text-lg line-clamp-2 font-extrabold leading-snug text-slate-600">{product.title}</h1>
      <p class="mt-2 text-center text-gray-700 mb-3">{product.description}</p>
      <h2 class="text-base line-clamp-2 font-extrabold text-slate-500 leading-snug mb-3">$ {product.price}</h2>
      <div class="justify-start flex-1 mt-2 mb-3">
          <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{product.category}</span>
      </div>
      <p class="mt-2 text-gray-700 mb-3">⭐ {product.rating?.rate}</p>
      <p class="mt-1 text-gray-700 mb-3">Reviews: {product.rating?.count}</p>
    </div>
  </div>
  
  {/if}