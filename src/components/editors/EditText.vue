<script setup>
import { onMounted, ref } from 'vue';
import { useGlobalStore } from '@/stores/globalStore';
import { BsLayerBackward, BsLayerForward, BsTransparency, IoSharpColorPalette } from '@kalimahapps/vue-icons';


const {
    currentSelection,
    editor,
    editView,
} = useGlobalStore();

function handleBackgroundChange(color) {
    if (editor.canvas && currentSelection.element) {
        console.log("Changing the font", currentSelection.element);
        currentSelection.element.set('backgroundColor', color);
        currentSelection.element.setCoords();
        editor.canvas.renderAll();
    } else {
        console.error('Editor or currentSelection is not defined.');
    }
}

function showColorPicker(elem){
    document.getElementById(elem).click()
}

function setColor(prop, color){
    currentSelection.element.set(prop, color);
    currentSelection.element.setCoords();
    editor.canvas.renderAll();
}

function setTransparent(prop){
    currentSelection.element.set(prop, 'transparent');
    currentSelection.element.setCoords();
    editor.canvas.renderAll();
}

function sendToBack(){
    editor.canvas.sendBackwards(currentSelection.element)
}

function sendToFront(){
    editor.canvas.bringForward(currentSelection.element)
}


function handleFontChange(font) {
    if (editor.canvas && currentSelection.element) {
        console.log("Changing the font", currentSelection.element);
        currentSelection.element.set('fontFamily', font);
        currentSelection.element.setCoords();
        editor.canvas.renderAll();
    } else {
        console.error('Editor or currentSelection is not defined.');
    }
}

const fontList = [
    'Amaranth',
    'Arial',
    'Times New Roman',
    'Sankofa Display',
    'Pacifico',
    'Calibri',
    'Fantasy',
    'Cursive',
    'Poppins',
    'Roboto',
    'Gothic sans',
    'Helvetica',
    'Monteserrat',
];

const bgColor = ref(null)

onMounted(async () => {
    console.log("Editor:", editor.canvas)
})

</script>

<template>

    <div class="animate-fade" :v-bind="editView.scope" v-if="editView.scope === 'font'">
        <h3 class="font-bold mb-4 text-white"> Default Fonts </h3>
        <div class="h-[200px] overflow-y-auto">
            <ul class="px-0">
                <li @click="() => handleFontChange(font)" class="rounded hover:opacity-[.5] transition-opacity cursor-pointer bg-[#9b9c9b57] my-2 w-100 p-2" v-for="font in fontList" :key="font">{{ font }}</li>
            </ul>
        </div>

        <hr class="my-3" />

        <h3 class="font-bold mb-4 text-white"> Special Fonts </h3>
        <div class="">

        </div>
    </div>

    <div class="animate-fade" :v-bind="editView.scope" v-if="editView.scope === 'color'">
        <h3 class="font-bold mb-4 text-white"> Background Color </h3>
        <div class="mb-4">
            <div 
                :style="{ backgroundColor: currentSelection.element.backgroundColor }" 
                class="w-[100%] my-2 px-1 h-[40px] rounded border"
            ></div>
            
            <!-- <div :v-bind="currentSelection.element.backgroundColor" :class="`w-[100%] my-2 px-1 h-[40px] rounded border bg-[${currentSelection.element.backgroundColor}]`"></div> -->
            <input @input="(e) => setColor('backgroundColor', e.target.value)" type="color" class="btn rounded hidden" id="bgColor" />
            
            <div class="flex align-center justify-start gap-x-2">
                <button @click="() => setTransparent('backgroundColor')" class="px-2 py-2 rounded my-1 bg-[#8080805c]" > <BsTransparency class="text-[20px] fill-w" /> </button>
                <button @click="() => showColorPicker('bgColor')" class="px-2 py-2 rounded my-1 bg-[#8080805c]" > <IoSharpColorPalette class="text-[20px] fill-w" /> </button>                
            </div>
            
        </div>
        
        <hr class="my-3" />
        
        <h3 class="font-bold mb-4 text-white"> Text Color </h3>
        <div class="">
            <div 
                :style="{ backgroundColor: currentSelection.element.fill }" 
                class="w-[100%] my-2 px-1 h-[40px] rounded border"
            ></div>
            
            <input @input="(e) => setColor('fill', e.target.value)" type="color" class="btn rounded hidden" id="textColor" />
            <div class="">
                <button @click="() => showColorPicker('textColor')" class="px-2 py-2 rounded my-1 bg-[#8080805c]" > <IoSharpColorPalette class="text-[20px] fill-w" /> </button>                
            </div>
        </div>
    </div>

    <div class="animate-fade" :v-bind="editView.scope" v-if="editView.scope === 'layer'">
        <h3 class="font-bold mb-4 text-white"> Object Layer </h3>
        <div class="mb-4">
                        
            <div class="block">
                <button @click="sendToBack" class="px-2 py-2 rounded my-3 bg-[#8080805c] flex align-center gap-x-6 w-full" > <BsLayerBackward class="text-[20px] fill-w" /> Send To Back </button>
                <button @click="sendToFront" class="px-2 py-2 rounded my-3 bg-[#8080805c] flex align-center gap-x-6 w-full" > <BsLayerForward class="text-[20px] fill-w" /> Bring To Front </button>                
            </div>
            
        </div>
        
        <hr class="my-3" />
        
        <h3 class="font-bold mb-4 text-white"> Opacity </h3>
    </div>
</template>
