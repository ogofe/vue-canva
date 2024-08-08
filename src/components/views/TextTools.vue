<script setup>
    import {onMounted, ref, } from 'vue';
    import {Canvas, FabricText, FabricImage, Textbox}  from 'fabric';
    import { useGlobalStore } from '@/stores/globalStore';
    import EditText from '@/components/editors/EditText.vue';

    const {
        editor,
        currentSelection,
        editView,
        addObjectToCanvas,
        objectDefaults,
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
            const text = new Textbox(content, {
                left: 10,
                top: 10,
                visible: true,
                fontSize: size,
                evented: true,
                selectable: true,
                hasControls: true,
                fill: '#fff',
                selectable: true,
                textAlign: 'left',
                styles: {
                    borderRadius: 5
                }
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
    
</script>

<template>
    <div :v-bind="editView.action" v-if="editView.action === 'create'">
        <h3 class="font-bold mb-4 text-white"> Default text styles </h3>
        <button @click="() => handleAddText(42)" class="bg-[transparent] my-2 text-[19px] border px-3 py-2 w-[100%] rounded-md font-bold"> Add a new Heading </button>
        <button @click="() => handleAddText()" class="bg-[transparent] my-2 text-[15px] border px-3 py-2 w-[100%] rounded-md font-bold"> Add a new Sub heading </button>
        <button @click="() => handleAddText(15)" class="bg-[transparent] my-2 text-[12px] border px-3 py-2 w-[100%] rounded-md"> Add a new Text </button>
    </div>

    <EditText :editor={editor} :v-bind="editView.action" v-if="editView.action === 'edit'" />
    
</template>


