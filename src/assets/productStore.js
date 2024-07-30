// src/store/productStore.js

import { writable } from 'svelte/store';
import { get } from 'svelte/store';
import { derived } from 'svelte/store';

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
          state.filterItem !== "All categories"
            ? `https://fakestoreapi.com/products/category/${state.filterItem}`
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
        get().sortProducts();
        get().searchProducts();
      } catch (error) {
        update(state => ({ ...state, error }));
      } finally {
        const currentState = get();
        currentState.sortProducts();
        currentState.searchProducts();
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
    searchProducts: () => update(state => {
      if (state.searchTerm.trim() !== "") {
        const filteredProducts = state.originalProducts.filter(product =>
          product.title.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
        return {
          ...state,
          products: JSON.parse(JSON.stringify(filteredProducts))
        };
      }
    }),
  };
}

export const productStore = createProductStore();
