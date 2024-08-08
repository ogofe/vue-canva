<script setup>
import {onMounted, ref, } from 'vue';
    import {Canvas, FabricText, FabricImage, FabricObject}  from 'fabric';
    import { useGlobalStore } from '@/stores/globalStore';

const {
    currentSelection,
    editView,
    addObjectToCanvas,
    editor,
} = useGlobalStore();

function handleAddText(size=27){
    let content;
    switch(size){
        case 42:
            content = "A Heading Text"
            break;
        case 27:
            content = "A Sub heading Text"
            break;
        case 15:
            content = "A Paragraph Text"
            break;
        default:
            content = "A Sub heading Text"
        break;
    }

    try {
        const text = new FabricText(content, {
            left: 10,
            top: 10,
            visible: true,
            fontSize: size,
            evented: true,
            selectable: true,
            hasControls: true,
            fill: '#fff',
            selectable: true,
        })
        addObjectToCanvas(text)
        text.setControlsVisibility({
            mt: true, // middle top
            mb: true, // middle bottom
            ml: true, // middle left
            mr: true, // middle right
            bl: true, // bottom left
            br: true, // bottom right
            tl: true, // top left
            tr: true, // top right
            mtr: true, // middle top rotator
        })
    }catch(error){
        alert(`An error occured: ${error.message}`)
    }
}

onMounted(async () => {

})
</script>

<template>
    <div :v-bind="editView.action" v-if="editView.action === 'create'">
        <h3 class="font-bold mb-4 text-white"> Default Shapes </h3>
    </div>
    
</template>


