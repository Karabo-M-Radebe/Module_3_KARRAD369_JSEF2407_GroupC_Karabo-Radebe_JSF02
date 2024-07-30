import { writable, get, derived } from 'svelte/store';

function createProductStore() {
  const { subscribe, set, update } = writable({
    products: [],
    originalProducts: [],
    loading: false,
    error: false,
    sorting: "default",
    searchTerm: "",
    filterItem: "All categories",
  });

  return {
    subscribe,
    setSorting: (sorting) => update(state => ({ ...state, sorting })),
    setSearchTerm: (searchTerm) => update(state => ({ ...state, searchTerm })),
    setFilterItem: (category) => update(state => ({ ...state, filterItem: category })),
    fetchProducts: async () => {
      update(state => ({ ...state, loading: true }));
      
      try {
        const response = await fetch(
          get(productStore).filterItem !== "All categories"
            ? `https://fakestoreapi.com/products/category/${get(productStore).filterItem}`
            : `https://fakestoreapi.com/products`
        );
        if (!response.ok) {
          throw new Error("Data fetching failed, please check your network connection");
        }
        const data = await response.json();
        update(state => ({
          ...state,
          products: data,
          originalProducts: JSON.parse(JSON.stringify(data)),
          loading: false,
        }));
        productStore.sortProducts(); // Call sortProducts directly on productStore
      } catch (error) {
        update(state => ({ ...state, error }));
      } finally {
        // Remove this line, as it's not necessary
        // const currentState = get(productStore);
        // currentState.sortProducts();
      }
    },
    sortProducts: () => update(state => {
      if (state.sorting !== "default") {
        return {
          ...state,
          products: state.products.sort((a, b) =>
            state.sorting === "low" ? a.price - b.price : b.price - a.price
          )
        };
      } else {
        return {
          ...state,
          products: JSON.parse(JSON.stringify(state.originalProducts))
        };
      }
    }),
  };
}

export const productStore = createProductStore();