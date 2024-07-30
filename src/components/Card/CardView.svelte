<script>
    import { onMount } from 'svelte';
    import CardSkeleton from './CardSkeleton.svelte';
    import Error from "../Error.svelte";
    import Filter from '../Filter.svelte';
    import Sort from '../Sort.svelte';

    let products = [];
    let filteredProducts = [];
    let loading = true;
    let error = null;
    let categories = [];
    let selectedCategory = '';
    let selectedSort = 'default';

  async function getProducts() {
  try {
    let response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new error("Failed to fetch products");
    }
    products = await response.json();
      // Extract unique categories from products
      categories = [...new Set(products.map(product => product.category))];
      filteredProducts = [...products]; // Set initial filtered products
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
      sortProducts(selectedSort);
    }
  }

  async function getProductsByCategory(category) {
    try {
      loading = true;
      error = null;
      let response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
    products = await response.json();
    filteredProducts = [...products];
  } catch (err) {
    error = err.message;
  } finally {
    loading = false;
    sortProducts(selectedSort);
  }
}

  function handleCategoryChange(category) {
    selectedCategory = category;
    if (selectedCategory) {
      getProductsByCategory(selectedCategory);
    } else {
      getProducts();
  }
}

function sortProducts(option) {
  selectedSort = option;
  if (option === 'lowToHigh') {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (option === 'highToLow') {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  } else {
    filteredProducts = [...products];
  }
}

function handleSortChange(option) {
  sortProducts(option);
}

onMount(() => {
  getProducts();
});

</script>

<style>
  .container {
  display: grid;
  gap: 1rem; 
  column-gap: 12rem;
  margin-top: 0.75rem; 
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  }

  @media (min-width: 1024px) { 
  .container {
      display: flex;
      align-items: flex-start;
  }
}
</style>

<div>
  <div class="container">
    <Filter {categories} {selectedCategory} onCategoryChange={handleCategoryChange} />
    <Sort  onSortChange={handleSortChange} />
  </div>
  {#if loading}
    <div class="grid justify-center">
      <div class="lg:max-h-[130rem] max-w-xl mx-auto grid gap-4 grid-cols-1 lg:grid-cols-4 md:grid-cols-2 items-center lg:max-w-none my-4">
        {#each new Array(20).fill(null) as _, index}
          <CardSkeleton />
        {/each}
      </div>
    </div>
    
  {:else if error}
    <Error message={error} />
  {:else if filteredProducts.length > 0}
    <div class="grid justify-center">
      <div class="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 my-4 ">
        {#each filteredProducts as product}
          <a href={`/products/${product.id}`} class="flex flex-col max-h-[130rem] cursor-pointer max-w-80 hover:-translate-y-1 hover:scale-105 duration-300 bg-white border border-slate-200 shadow shadow-slate-950/5 rounded-2xl overflow-hidden">
            <img class="object-contain h-48 mt-3" src={product.image} alt={product.title} />
            <div class="flex-1 flex flex-col p-6">
              <div class="flex-1">
                <header class="mb-2 flex-2">
                  <h2 class="text-lg line-clamp-2 font-extrabold leading-snug text-slate-600">{product.title}</h2>
                </header>
              </div>
              <!-- Ratings -->
              <div class="flex items-left -ml-2 mb-2">
                {#each Array(Math.round(product.rating.rate)) as _, index}
                  <svg class="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                {/each}
                {#each Array(5 - Math.round(product.rating.rate)) as _, index}
                  <svg class="w-4 h-4 ms-1 text-gray-300 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                {/each}
              </div>
              <div class="text-base line-clamp-2 font-extrabold text-slate-500 leading-snug">
                <h2>$ {product.price}</h2>
              </div>
              <div class="flex mt-1 space-x-2 my-3">
                <div class="justify-start flex-1">
                  <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {product.category}
                  </span>
                </div>
                <div class="justify-end space-x-2">
                  <button aria-label="Add to Favourites">
                    <svg class="me-1.5 h-5 w-5 hover:fill-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" transform="scale(1.6)">
                      <path stroke="currentColor" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                    </svg>
                  </button>
                </div>
              </div>
              <button class="flex rounded-lg justify-center mt-3 bg-cyan-700 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-900 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300">
                Add To Cart
              </button>
            </div>
          </a>
        {/each}
      </div>
    </div>
    {:else}
      <p class="grid justify-center">No products found.</p>
    {/if}
  </div>