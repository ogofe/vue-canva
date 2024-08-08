<script setup>
import { ref, onMounted } from 'vue';
import { useGlobalStore } from '@/stores/globalStore.js';
import { Canvas } from 'fabric';
import {
  BsLayersHalf,
  SiCustomink, BxSolidCloudDownload, CoTextSize, FlFilledDesignIdeas,
  ClTextAlignLeft,
  ClTextAlignCenter,
  ClTextAlignRight,
  MdRoundFormatColorText,
  FlFilledDelete,

} from '@kalimahapps/vue-icons';

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

      <div class="px-3 bg-[#ffffffd6] justify-between align-center flex flex-wrap flex-1 transition-all  gap-x-2 py-2">
        <button class="rounded px-3 py-2 bg-[#ddd] font-bold" @click="saveCanvasAsImage"> <BxSolidCloudDownload class="text-[20px]" /> </button>
        
        <div v-bind="currentSelection" v-if="currentSelection && (currentSelection.type === 'text' || currentSelection.type === 'textbox')" class="animate-fade flex-1 font-bold flex-wrap gap-y-2 flex px-3 bg-[#ffffffd6] align-middle justify-start gap-x-2">
          <div v-bind="currentSelection" v-if="currentSelection.type === 'textbox'">
            <button @click="() => changeEditView({ type: 'text', action: 'edit', scope: 'font'})" class="px-3 font-semibold text-[12px] py-2 rounded bg-[#cfcdcdad]">{{ currentSelection.element.fontFamily }}</button>
          </div>

          <div v-bind="currentSelection" v-if="currentSelection.type === 'textbox'">
            <button @click="() => changeEditView({ type: 'text', action: 'edit', scope: 'color'})" class="px-3 font-semibold text-[12px] py-2 rounded bg-[#cfcdcdad]"><MdRoundFormatColorText class="text-[20px]" /></button>
          </div>

          <div class="flex">
            <button class="btn font-bold" @click="reduceFont">-</button>
            <input @input="(e) => setFontSize(e.target.value)" class="input w-[50px] text-center" type="number" :min="8" :max="64" v-model="currentSelection.element.fontSize" />
            <button class="btn font-bold" @click="addFont">+</button>
          </div>

          <div class="flex">
            <button class="btn font-bold" @click="() => changeAlignment('left')"><ClTextAlignLeft /></button>
            <button class="btn font-bold" @click="() => changeAlignment('center')"><ClTextAlignCenter /></button>
            <button class="btn font-bold" @click="() => changeAlignment('right')"><ClTextAlignRight /> </button>
          </div>

          <div class="flex">
            <button @click="toggleTextBold" class="btn font-mono font-bold">B</button>
            <button @click="toggleTextUnderline" class="btn font-bold font-mono underline">U</button>
            <button @click="toggleTextItalic" class="btn font-bold font-serif"><i>I</i></button>
          </div>
        </div>

        <button :v-bind="currentSelection" v-if="currentSelection.element !== null" class="transition-all animate-jump-in rounded px-3 py-2 bg-[#dddddd8c] font-bold" @click="() => changeEditView({ ...editView, action: 'edit', scope: 'layer'})"> <BsLayersHalf class="text-[20px]" /> </button>
        <button :v-bind="currentSelection" v-if="currentSelection.element !== null" class="transition-all animate-jump-in rounded px-3 py-2 hover:bg-[#dddddd5c] font-bold" @click="deleteObject"> <FlFilledDelete class="text-[tomato] text-[20px]" /> </button>
      </div>
          

      <div class="w-[100%] absolute overflow-auto bg-[#dddddd] h-fill py-10 px-10">
        <div class="flex justify-center align-middle">
          <slot></slot>
        </div>
      </div>
    </div>
</template>

<style scoped>

</style>
