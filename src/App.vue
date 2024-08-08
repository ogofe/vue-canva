<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'

</script>

<template>
  <Navbar />

  <div class="page">
    <RouterView />
  </div>
</template>

<style scoped>
  .page {
    /* overflow-x: scroll ; */
    /* padding: 20px; */
  }
</style>
