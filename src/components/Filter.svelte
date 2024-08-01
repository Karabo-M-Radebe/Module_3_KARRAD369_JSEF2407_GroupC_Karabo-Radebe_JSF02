<script>

  /**
   * Exported properties for the component.
   *
   * @property {string[]} categories - An array of category names.
   * @property {string} selectedCategory - The currently selected category.
   * @property {(category: string) => void} onCategoryChange - A callback function to handle category changes.
   */
  export let categories = [];
  export let selectedCategory = '';
  export let onCategoryChange = () => {};

  /**
   * This function handles the change event of the category select dropdown.
   * It calls the provided `onCategoryChange` function with the selected category value.
   *
   * @param {Event} event - The change event object.
   * @returns {void}
   */
  const handleChange = (event) => {
    // @ts-ignore
    onCategoryChange(event.target.value);
  }
</script>

<style></style>

<div class="flex sm:w-[95%] max-w-[21rem] md:w-full">
  <label for="category" class="w-20 my-auto font-semibold">
    Filter:
  </label>
  <select id="category" on:change={handleChange} bind:value={selectedCategory} class="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
    <option value="">All categories</option>
    {#each categories as category}
      <option value={category}>{category}</option>
    {/each}
  </select>
</div>