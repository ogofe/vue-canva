<script setup>
  import { ref } from 'vue';
  import { useGlobalStore } from '@/stores/globalStore'; // Adjust the import path as needed
  import { FabricPath } from 'fabric'; // Assuming Fabric.js was imported this way
  
  defineProps({
    svgPath: {
      type: String,
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 100,
    }
  });
  
  const { addObjectToCanvas } = useGlobalStore(); // Your custom function to add objects to the canvas
  
  function addToCanvas() {
    const path = new FabricPath(svgPath, {
      left: 100,
      top: 100,
      fill: 'black', // Default color
      scaleX: 1,
      scaleY: 1,
    });
    addObjectToCanvas(path); // Adding the SVG path to the Fabric.js canvas
  }
</script>

<!-- SvgPreview.vue -->
<template>
    <div class="svg-preview">
      <div class="preview-container">
        <!-- <svg :width="width" :height="height" viewBox="0 0 100 100">
          <path d="M50,0 L100,35 L80,90 L20,90 L0,35 Z" fill="red" />
        </svg> -->
      </div>
      <button class="add-button" @click="addToCanvas">Add to Canvas</button>
    </div>
  </template>
  
  
<style scoped>
  .svg-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .preview-container {
    width: 100px;
    height: 100px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .add-button {
    padding: 5px 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .add-button:hover {
    background-color: #45a049;
  }
</style>
  