<script setup>
import { ref, onMounted } from 'vue';
import { useGlobalStore } from '@/stores/globalStore.js';
import { Canvas } from 'fabric';
import {
  BsLayersHalf,
  SiCustomink, BxSolidCloudDownload, CoTextSize, FlFilledDesignIdeas,
  ClTextAlignLeft,
  BsChevronDown,
  ClTextAlignCenter,
  ClTextAlignRight,
  MdRoundFormatColorText,
  FlFilledDelete,

} from '@kalimahapps/vue-icons';
import TextToolbar from './toolbars/TextToolbar.vue';

// Refs
const canvasElement = ref(null);
const { 
  flyerImage,
  currentSelection,
  editor,
  editView,
  deleteObject,
  changeEditView,
} = useGlobalStore();
const fontSize = ref(14);

// Functions

function saveCanvasAsImage() {
  const canvasElement = document.getElementById('canvas');
  const editorInstance = editor.canvas;

  // Create a temporary canvas to draw the background image
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = editorInstance.width;
  tempCanvas.height = editorInstance.height;
  const tempCtx = tempCanvas.getContext('2d');
  // Draw the background image on the temporary canvas
  const backgroundImage = new Image();
  backgroundImage.src = `http://localhost:3000/${flyerImage}`; // The URL of your background image
  backgroundImage.style.zIndex = 30;
  alert("Downloading...");

  try {
    backgroundImage.onload = () => {
      tempCtx.drawImage(backgroundImage, 0, 0, editorInstance.width, editorInstance.height);
  
      // Draw the content of the Fabric.js canvas on top of the background image
      const fabricImage = new Image();
      fabricImage.src = editorInstance.toDataURL();
      fabricImage.onload = () => {
        tempCtx.drawImage(fabricImage, 0, 0, editorInstance.width, editorInstance.height);
  
        // Convert the temporary canvas to a data URL and create a download link
        const dataURL = tempCanvas.toDataURL('image/jpeg');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'canvas_export.jpg';
        link.click();
      };
    };
  } catch (error) {
    alert(`Error saving image: ${error.message}`);
  }
}
</script>



<template>
    
    <div class="px-2 bg-[#ffffffd6] justify-between align-center flex flex-wrap flex-1 transition-all gap-1 py-2">
      <button class="rounded px-2 py-2 bg-[#ddd] font-bold" @click="saveCanvasAsImage"> <BxSolidCloudDownload class="text-[20px]" /> </button>
        
        <slot>
          <TextToolbar />
        </slot>
        
        <div class="flex gap-1 align-center justify-between flex-wrap">
          <button :v-bind="currentSelection" v-if="currentSelection.element !== null" class="transition-all text-[12px] animate-jump-in rounded px-3 py-2 bg-[#dddddd8c] font-bold" @click="() => changeEditView({ ...editView, action: 'edit', scope: 'layer'})"> Effects </button>
          <button :v-bind="currentSelection" v-if="currentSelection.element !== null" class="transition-all animate-jump-in rounded px-3 py-2 bg-[#dddddd8c] font-bold" @click="() => changeEditView({ ...editView, action: 'edit', scope: 'layer'})"> <BsLayersHalf class="text-[20px]" /> </button>
          <button :v-bind="currentSelection" v-if="currentSelection.element !== null" class="transition-all animate-jump-in rounded px-3 py-2 hover:bg-[#dddddd5c] font-bold" @click="deleteObject"> <FlFilledDelete class="text-[tomato] text-[20px]" /> </button>
        </div>
      </div>
          
</template>


  