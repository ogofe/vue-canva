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
</script>

<template>
  <div v-bind="currentSelection" v-if="currentSelection.type === 'textbox'">
      <button @click="() => changeEditView({ type: 'textbox', action: 'edit', scope: 'font'})" class="flex align-center gap-x-2 px-3 font-semibold text-[12px] py-2 rounded bg-[#cfcdcdad]">
          {{ currentSelection.element.fontFamily }}
          <BsChevronDown class="font-bold" />
      </button>
  </div>

  <div v-bind="currentSelection" v-if="currentSelection.type === 'textbox'">
    <button @click="() => changeEditView({ type: 'textbox', action: 'edit', scope: 'color'})" class="px-3 font-semibold text-[12px] py-2 rounded bg-[#cfcdcdad]"><MdRoundFormatColorText class="text-[20px]" /></button>
  </div>

  <div class="flex" v-bind="currentSelection" v-if="currentSelection.type === 'textbox'">
    <button class="btn font-bold" @click="reduceFont">-</button>
    <input @input="(e) => setFontSize(e.target.value)" class="input w-[50px] text-center" type="number" :min="8" :max="64" v-model="fontSize" />
    <button class="btn font-bold" @click="addFont">+</button>
  </div>

  <div class="flex rounded bg-[#ddd]" v-bind="currentSelection" v-if="currentSelection.type === 'textbox'">
    <button class="py-2 font-bold px-2" @click="() => changeAlignment('left')"><ClTextAlignLeft class="text-[19px]" /></button>
    <button class="py-2 font-bold px-2" @click="() => changeAlignment('center')"><ClTextAlignCenter class="text-[19px]" /></button>
    <button class="py-2 font-bold px-2" @click="() => changeAlignment('right')"><ClTextAlignRight class="text-[19px]" /></button>
  </div>

  <div class="flex" v-bind="currentSelection" v-if="currentSelection.type === 'textbox'">
      <button @click="toggleTextBold" class="btn font-mono font-bold">B</button>
      <!-- <button @click="toggleTextUnderline" class="btn font-bold font-mono underline">U</button> -->
      <button @click="toggleTextItalic" class="btn font-bold font-serif"><i>I</i></button>
  </div>
</template>


<style>
</style>
