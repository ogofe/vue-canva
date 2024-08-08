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
  MdChevronRight,
  MdChevronLeft,
  FlFilledDelete,

} from '@kalimahapps/vue-icons';
import Toolbar from '@/components/Toolbar.vue';
import CanvasEditor from '@/components/CanvasEditor.vue';

// Refs
const canvasElement = ref(null);
const fontList = ref(['Arial', 'Times New Roman']);
const { 
  flyerImage,
  fabricObjects,
  addObject,
  currentSelection,
  setEditor,
  editor,
  selectObject,
  editView,
  deleteObject,
  addObjectToCanvas,
  changeEditView,
} = useGlobalStore();
const fontSize = ref(14);

// Sample data
const editLinks = ref([
  { id: 'text', label: 'Text', icon: CoTextSize },
  { id: 'elements', label: 'Elements', icon: FlFilledDesignIdeas },
  { id: 'brand', label: 'Brand', icon: SiCustomink },
]);

const authUser = ref({ username: 'jdoe', fullName: 'John Doe' });
const navIsOpen = ref(false)
// Functions

function toggleToolbar(){
  const elem = document.getElementById('toolbar');
  elem.classList.toggle('open')
  navIsOpen.value = !navIsOpen.value
  // if (elem.classList.contains('open')){
  //   elem.classList.add('open')
  // }else{
  //   elem.classList.remove('open')
  // }
}

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

function createEditor(ctx) {
  const canvas = new Canvas(ctx, {
    allowTouchScrolling: true,
    height: 480,
    width: 350,
    controlsAboveOverlay: true,
  });

  canvas.on('object:added', function(options) {
    const object = options.target;
    addObject({ type: object.type, element: object });
    object.canvas = canvas
    
    object.on('selected', function() {
      selectObject(object);
      if (object.type === 'text'){
        fontSize.value = object.fontSize
      }
    });

    object.setControlsVisibility({
      mt: true, mb: true, ml: true, mr: true, bl: true, br: true, tl: true, tr: true, mtr: true,
    });

    object.on('deselected', function(){
      console.log("Object Lost Focus")
      canvas.discardActiveObject()
      selectObject(null)
      changeEditView({ type: 'text', action: 'create'})
    })
    
    object.set('lockRotation', false);
    object.set('lockScalingX', false);
    object.set('lockScalingY', false);
    object.set('lockMovementX', false);
    object.set('lockMovementY', false);
  });

  canvas.on('selection:created', function(options) {
    const selection = options.selected;
    const object = selection[0]; // If only one object is selected
    console.log("Selection", object)
    // if (selection.length > 1) {
    //   selectObject({ type: 'selection', element: selection });
    // } else {
    //   selectObject({ type: object.type, element: object });
    // }
  });


  canvas.on('mouse:dblclick', function (options) {
    const object = options.target;

    if (object && object.type === 'text') {
      const newText = prompt('Enter new text:', object.text);
      if (newText !== null) {
        object.set('text', newText);
        canvas.renderAll();
      }
    }
  });

  setEditor(canvas);
  return canvas;
}

// On mounted
onMounted(() => {
  try {
    // editor.value = createEditor(canvasElement.value);
    createEditor(canvasElement.value);
    canvasElement.value.style.backgroundImage = `url('http://localhost:3000/${flyerImage}')`;
    canvasElement.value.style.backgroundSize = '100%';
    canvasElement.value.style.backgroundSize = 'cover';
    canvasElement.value.style.backgroundBlendMode = 'color';
    canvasElement.value.style.backgroundPositionX = '0px';
    canvasElement.value.style.backgroundPositionY = '0px';
    canvasElement.value.style.backgroundRepeat = 'no-repeat';

    console.log("Canvas initialized:", editor.value);
  } catch (error) {
    console.log("Error initializing canvas:", error);
  }
});

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
  <main class="block relative">
    <div class="h-[100%] w-[100%]">

      <div class="wrapper absolute w-[100%]">
        <div class="flex h-[100%]">
          <div class="sidebar flex-1 flex">
            <div class="bg-[#000000cf] text-white">
              <ul class="nav-links">
                <li v-for="link in editLinks" :key="link.id" :class="editView.type === link.id ? 'nav-link active' : 'nav-link'">
                  <button @click="() => changeEditView({type: link.id, action: 'create'})" type="button" class="bg-transparent block hover:opacity-100 transition-opacity opacity-40 hover:text-white">
                    <h2 class="w-[max-content] mx-auto text-[25px]"><component :is="link.icon" /></h2>
                    <h6 class="text-[11px] font-[500]">{{ link.label }}</h6>
                  </button>
                </li>
                
                <li class="nav-link toggler">
                  <button @click="toggleToolbar" type="button" class="bg-transparent block hover:opacity-100 transition-opacity opacity-40 hover:text-white">
                    <h2 class="w-[max-content] mx-auto text-[25px]">
                      <MdChevronRight :v-bind="navIsOpen" v-if="navIsOpen === false" />
                      <MdChevronLeft :v-bind="navIsOpen" v-if="navIsOpen === true" />
                      <h6 class="text-[11px] font-[500]">Tools</h6>
                    </h2>
                  </button>
                </li>
              </ul>
            </div>
  
            <Toolbar :v-bind="editView.type" />
           
          </div>
  
          <CanvasEditor>
            <canvas ref="canvasElement" id="canvas" class="mt-2 block relative w-[350px] h-[500px]"></canvas>
          </CanvasEditor>
        </div>
        
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
