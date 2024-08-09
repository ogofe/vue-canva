<script setup>
import { ref, onMounted } from 'vue';
import dummyData from '@/assets/data.json';
import {useGlobalStore} from '@/stores/globalStore.js';
import router from '@/router';

const data = ref(null);
const imageCategories = ref([]);
const selectedCategory = ref('all'); // Fixed typo here
const images = ref([]);
const {setFlyerImage, flyerImage} = useGlobalStore();

function changeCategory(cat) {
  selectedCategory.value = cat;

  if (cat === 'all') {
    images.value = getAllImages();
  } else {
    images.value = data.value[cat]; // array of images
  }
}

function getAllImages() {
  let array = [];
  for (let _cat of imageCategories.value) { // Use .value here
    let _images = data.value[_cat]; // Access category directly
    array.push(..._images); // Use spread operator to add images
  }
  return array;
}

function beginEdit(file){
  setFlyerImage(file);
  router.push('/edit/')
}

onMounted(() => {
  try {
    // Load images data from JSON file
    const keys = Object.keys(dummyData.images);

    data.value = dummyData.images;
    imageCategories.value = keys;
    images.value = getAllImages();
  } catch (error) {
    console.log("Error initializing canvas:", error);
  }
});
</script>

<template>
  <main class="block relative bg-[#e6e6e69f]">
    <div class="block bg-[tomato] px-5 py-2">
      <div class="flex flex-wrap gap-y-2 align-middle justify-between">
        <h4 class="text-white flex-1 mb-0 py-2 font-bold align-text-bottom">Choose a category</h4>
        <select class="w-[250px] py-2 rounded uppercase" @input="(e) => changeCategory(e.target.value)">
          <option value="all">All categories</option>
          <option v-for="category in imageCategories" :key="category" class="uppercase" :value="category">{{ category }}</option>
        </select>
      </div>
    </div>

    <div class="px-5 py-7 min-h-[90vh]">
      <h2 class="font-bold">Showing 
        <span v-if="selectedCategory !== 'all'"> Images for {{ selectedCategory }} </span>
        <span v-else>All Images</span>
      </h2>

      <div class="grid lg:grid-cols-4 sm:grid-cols-2 flex-wrap gap-4 align-middle justify-center mt-7">
        <div  @click="() => beginEdit(image.file)" class="py-2 cursor-pointer bg-white rounded  px-2 img-item" v-for="image in images" :key="image.id">
          <div class="rounded w-[100%] h-[350px]">
            <img :src="image.file" class="w-[100%] h-[100%] rounded" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.img-item {
  border: 4px solid transparent;
  transition: border 0.5s;
}

.img-item:hover {
  border-color: tomato;
}
</style>
