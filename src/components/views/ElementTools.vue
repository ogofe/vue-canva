<script setup>
import {onMounted, ref, } from 'vue';
import {Path}  from 'fabric';
import { useGlobalStore } from '@/stores/globalStore';
import { BsLayerBackward, BsLayerForward, BsTransparency, IoSharpColorPalette } from '@kalimahapps/vue-icons';

const {
    currentSelection,
    editView,
    addObjectToCanvas,
    editor,
} = useGlobalStore();

function handleAddShape(svg){
    try {
        const shape = new Path(svg, {
            left: 100,
            top: 100,
            scaleX: 1,
            scaleY: 1,
            visible: true,
            evented: true,
            selectable: true,
            hasControls: true,
            fill: '#fff',
        })
        addObjectToCanvas(shape);
    }catch(error){
        alert(`An error occured: ${error.message}`)
    }
}

onMounted(async () => {

})


const shapeList = [
    { shape: 'triangle', svg: 'M10 80 L50 10 L90 80 Z' },
    { shape: 'bloby', svg: 'M43.1,-56C58.8,-47.9,76.6,-39.3,78.3,-27.1C79.9,-15,65.3,0.7,53.8,11.7C42.3,22.7,33.9,28.8,25.4,37.9C17,46.9,8.5,58.7,-4.5,64.9C-17.5,71.1,-35,71.6,-44.6,63C-54.2,54.4,-56,36.6,-54.1,22.3C-52.2,8.1,-46.5,-2.6,-40,-10.1C-33.6,-17.6,-26.3,-21.9,-19.5,-33C-12.7,-44,-6.3,-61.9,3.7,-67C13.7,-72,27.3,-64.2,43.1,-56Z' },
    { shape: 'circle', svg: 'M 50, 50 m -50, 0 a 50,50 0 1,0 100,0 a 50,50 0 1,0 -100,0' },
    { shape: 'square', svg: 'M10 10 H 90 V 90 H 10 L 10 10' },
    { shape: 'rectangle', svg: 'M10 20 H 90 V 80 H 10 L 10 20' },
    { shape: 'ellipse', svg: 'M50,20 A30,15 0 1,0 50.01,20 Z' },
    { shape: 'pentagon', svg: 'M50 15 L61 35 L49 55 L31 55 L19 35 Z' },
    { shape: 'hexagon', svg: 'M50 15 L61 30 L61 50 L50 65 L39 50 L39 30 Z' },
    { shape: 'star', svg: 'M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z' },
    { shape: 'blob1', svg: 'M45.8,-49.2C58.1,-37.1,61.3,-15.6,55.5,-0.8C49.8,14,35.1,28.1,22.5,40.8C10,53.4,-0.5,64.7,-12.3,62.8C-24,61,-37,45.9,-43.6,29.3C-50.2,12.7,-50.3,-5.6,-44.5,-19.8C-38.7,-34,-27,-44.1,-13.6,-52C-0.2,-60,15,-65.8,28.6,-60.3C42.3,-54.7,54.4,-37.8,45.8,-49.2Z' },
    { shape: 'blob2', svg: 'M57.3,-43.2C70.3,-29.1,71.6,-3.8,64.9,17.6C58.3,39,43.8,55.5,25.2,62.7C6.5,69.8,-16.3,67.6,-31.7,56.2C-47.1,44.8,-55,24.2,-55.8,3.2C-56.6,-17.8,-50.3,-38.4,-36.3,-52.2C-22.2,-66,-0.4,-72.9,19.8,-70.6C40,-68.4,57.6,-57.3,57.3,-43.2Z' },
    { shape: 'promoBanner1', svg: 'M10,50 H90 L75,75 H25 Z' },
    { shape: 'promoBanner2', svg: 'M10,10 H90 L50,60 Z' },
    { shape: 'ribbon1', svg: 'M10,50 L50,10 L90,50 L50,90 Z' },
    { shape: 'ribbon2', svg: 'M10,70 L30,10 L70,10 L90,70 Z' },
    { shape: 'wave', svg: 'M0,30 C20,60 40,0 60,30 C80,60 100,0 120,30 L120,60 L0,60 Z' },
    { shape: 'cloud', svg: 'M30,60 A20,20 0 0,1 70,60 A30,30 0 0,1 90,30 A40,40 0 0,1 30,30 A20,20 0 0,1 10,60 Z' },
    { shape: 'arc', svg: 'M50,20 A30,30 0 1,1 49.9,20 Z' },
    { shape: 'leaf', svg: 'M50,20 Q70,50 50,80 Q30,50 50,20 Z' },
    { shape: 'lightning', svg: 'M20,10 L50,40 L40,40 L70,80 L30,50 L40,50 Z' },
    { shape: 'cog', svg: 'M50,30 L60,40 L70,40 L80,50 L70,60 L60,60 L50,70 L40,60 L30,60 L20,50 L30,40 L40,40 Z' }
];


function showColorPicker(elem){
    document.getElementById(elem).click()
}


function setTransparent(prop){
    currentSelection.element.set(prop, 'transparent');
    currentSelection.element.setCoords();
    editor.canvas.renderAll();
}

function setColor(prop, color){
    currentSelection.element.set(prop, color);
    currentSelection.element.setCoords();
    editor.canvas.renderAll();
}



</script>

<template>
    <div :v-bind="editView.action" v-if="editView.action === 'create'">
        <h3 class="font-bold mb-4 text-white"> Default Shapes and Elements </h3>
        <div class="grid grid-cols-2 gap-x-3 gap-y-5">
            <div @click="() => handleAddShape(shape.svg)" class="border-2 transition-all hover:border-[tomato] rounded px-2 py-2" v-for="shape in shapeList" :key="shape.shape" :v-bind="shape.shape">
                <svg class="w-[100%] h-[100%]" preserve-aspect-ratio="xMidYmid meet" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path :d="shape.svg" fill="azure" />
                </svg>
            </div>
        </div>
    </div>
    
    <div :v-bind="editView.action" v-if="editView.action === 'edit'">
        <h3 class="font-bold mb-4 text-white"> Shape Fill Color </h3>

        <div class="mb-4">
            <div 
                :style="{ backgroundColor: currentSelection.element.fill }" 
                class="w-[100%] my-2 px-1 h-[40px] rounded border"
            ></div>
            
            <!-- <div :v-bind="currentSelection.element.backgroundColor" :class="`w-[100%] my-2 px-1 h-[40px] rounded border bg-[${currentSelection.element.backgroundColor}]`"></div> -->
            <input @input="(e) => setColor('fill', e.target.value)" type="color" class="btn rounded hidden" id="bgColor" />
            
            <div class="flex align-center justify-start gap-x-2">
                <button @click="() => setTransparent('backgroundColor')" class="px-2 py-2 rounded my-1 bg-[#8080805c]" > <BsTransparency class="text-[20px] fill-w" /> </button>
                <button @click="() => showColorPicker('bgColor')" class="px-2 py-2 rounded my-1 bg-[#8080805c]" > <IoSharpColorPalette class="text-[20px] fill-w" /> </button>                
            </div>
            
        </div>
    </div>


</template>


