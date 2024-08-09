<script setup>
import TextTools from '@/components/views/TextTools.vue';
import ElementTools from '@/components/views/ElementTools.vue';
import BrandTools from '@/components/views/BrandTools.vue';
import { useGlobalStore } from '@/stores/globalStore.js';

const {
  editView,
} = useGlobalStore();

</script>

<template>
    <div id="toolbar" class="toolbar flex-1 bg-[#2b2929] text-white px-5 py-3">
        <div class="">
            <TextTools :v-bind="editView.type" v-if="editView.type === 'textbox'" />
            <ElementTools :v-bind="editView.type" v-if="editView.type === 'path' || editView.type === 'elements'" />
            <BrandTools :v-bind="editView.type" v-if="editView.type === 'brand'" />
        </div>
    </div>
</template>


<style scoped>
    .toolbar{
        overflow-y: auto;
    }
</style>

