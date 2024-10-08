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
import EditorNavbar from './EditorNavbar.vue';

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


function toggleTextBold(){
  const text = currentSelection.element
  if (text.fontWeight === 'normal') {
    text.set('fontWeight', 'bold');
  } else {
    text.set('fontWeight', 'normal');
  }
  text.setCoords();
  editor.canvas.renderAll();
}

function toggleTextUnderline(){
  const text = currentSelection.element
  if (text.underline === true) {
    text.set('underline', false);
  } else {
    text.set('underline', true);
  }
  text.setCoords();
  editor.canvas.renderAll();
}

function toggleTextItalic(){
  const text = currentSelection.element
  if (text.fontStyle === 'normal') {
    text.set('fontStyle', 'italic');
  } else {
    text.set('fontStyle', 'normal');
  }
  text.setCoords();
  editor.canvas.renderAll();
}

function reduceFont() {
  if (currentSelection && currentSelection.element) {
    let size = currentSelection.element.fontSize;
    if (size > 8){
      if (size % 2 === 0){
        size -= 2
      }else{
        size -= 1
      }
      currentSelection.element.set('fontSize', size);
      fontSize.value = size
    }
    editor.canvas.renderAll();
  }
}

function setFontSize(val){
  if (currentSelection && currentSelection.element) {
    currentSelection.element.set('fontSize', val);
    currentSelection.element.setCoords();
    editor.canvas.renderAll();
  }
}

function addFont() {
  if (currentSelection && currentSelection.element) {
    let size = currentSelection.element.fontSize;
    if (size < 64){
      if (size % 2 === 0){
        size += 2
      }else{
        size += 1
      }
      currentSelection.element.set('fontSize', size);
      fontSize.value = size
    }
    editor.canvas.renderAll();
  }
}

function changeAlignment(align){
  if (currentSelection && currentSelection.element) {
    currentSelection.element.set('textAlign', align);
    editor.canvas.renderAll();
  }
}

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
    <div class="editor overflow-hidden flex-1 relative zoom-out">

      <EditorNavbar v-if="currentSelection.element && editView.type === 'path'">
        <button @click="() => changeEditView({ type: 'path', action: 'edit', scope: 'color'})" class="px-3 font-semibold text-[12px] py-2 rounded bg-[#cfcdcdad]"><MdRoundFormatColorText class="text-[20px]" /></button>
      </EditorNavbar>

      <EditorNavbar v-else />

      <div class="w-[100%] absolute overflow-auto bg-[#dddddd] h-fill py-10 px-10">
        <div class="flex justify-center align-middle">
          <slot></slot>
        </div>
      </div>
    </div>
</template>

<style scoped>

</style>
