<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useGlobalStore } from '@/stores/globalStore.js';
import { Canvas } from 'fabric';
import {
  SiCustomink, CoTextSize, FlFilledDesignIdeas,
  MdChevronRight,
  MdChevronLeft,
} from '@kalimahapps/vue-icons';
import Toolbar from '@/components/Toolbar.vue';
import CanvasEditor from '@/components/CanvasEditor.vue';

// Refs
const canvasElement = ref(null);
const fontList = ref(['Arial', 'Times New Roman']);
const { 
  flyerImage,
  addObject,
  setEditor,
  editor,
  currentSelection,
  selectObject,
  editView,
  changeEditView,
} = useGlobalStore();
const fontSize = ref(14);

// Sample data
const editLinks = ref([
  { id: 'textbox', label: 'Text', icon: CoTextSize },
  { id: 'path', label: 'Elements', icon: FlFilledDesignIdeas },
  { id: 'brand', label: 'Brand', icon: SiCustomink },
]);

const authUser = ref({ username: 'jdoe', fullName: 'John Doe' });
const navIsOpen = ref(false)
// Functions

function toggleToolbar(){
  const elem = document.getElementById('toolbar');
  elem.classList.toggle('open')
  navIsOpen.value = !navIsOpen.value
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
    object.setControlsVisibility({
      mt: true, mb: true, ml: true, mr: true, bl: true, br: true, tl: true, tr: true, mtr: true,
    });
    
    object.on('selected', function() {
      selectObject(object);
      changeEditView({ type: object.type, action: 'create', scope: null})
    });

    object.on('deselected', function(){
      console.log("Object Lost Focus")
      selectObject(null)
      changeEditView({ type: object.type, action: 'create', scope: null})
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

  setEditor(canvas);
  return canvas;
}

const url = `${document.location.protocol}//${document.location.host}`

function handleKeyboardEvent(event){
  const activeObject = currentSelection.element;
  if (activeObject && activeObject.isEditing){
    return;
  }

  event.preventDefault();
  if (event.key === 'Delete' || event.key === 'Backspace') {
    if (currentSelection && currentSelection.element) {
      editor.canvas.remove(currentSelection.element);
      editor.canvas.discardActiveObject();
      editor.canvas.renderAll();
      selectObject(null)
    }
  }else{
    // any other key event <Arrow keys>
    if (currentSelection && currentSelection.element) {
      const step = 1.25; // Amount of pixels to move the object
      let moved = false;

      switch (event.key) {
        case 'ArrowUp':
          currentSelection.element.top -= step;
          moved = true;
        break;
        case 'ArrowDown':
          currentSelection.element.top += step;
          moved = true;
        break;
        case 'ArrowLeft':
          currentSelection.element.left -= step;
          moved = true;
        break;
        case 'ArrowRight':
          currentSelection.element.left += step;
          moved = true;
        break;
      }
      if (moved) {
        currentSelection.element.setCoords(); // Update the object's coordinates
        editor.canvas.renderAll(); // Re-render the canvas to show the changes
      }
    }
  }
}

// On mounted
onMounted(() => {
  try {
    // editor.value = createEditor(canvasElement.value);
    window.addEventListener('keydown', handleKeyboardEvent);
    createEditor(canvasElement.value);
    canvasElement.value.style.backgroundImage = `url('${url}/${flyerImage}')`;
    canvasElement.value.style.backgroundSize = '100%';
    canvasElement.value.style.backgroundSize = 'cover';
    canvasElement.value.style.backgroundBlendMode = 'color';
    canvasElement.value.style.backgroundPositionX = '0px';
    canvasElement.value.style.backgroundPositionY = '0px';
    canvasElement.value.style.backgroundRepeat = 'no-repeat';

    console.log("Canvas initialized:", editor.canvas);
  } catch (error) {
    console.log("Error initializing canvas:", error);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyboardEvent);
})

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
  backgroundImage.src = `${url}/${flyerImage}`; // The URL of your background image
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
