<script setup>
import { RouterLink } from 'vue-router';
import { SiCustomink } from '@kalimahapps/vue-icons';

    function openNav(){

    }

    function closeNav(){

    }
</script>

<template>
    <div class="navbar">
        <div class="d-flex">
            <RouterLink to="/">
                <div class="font-bold gap-2 align-center text-center flex justify-between text-[tomato] text-[18px]"> <h2 class="text-[25px]"><SiCustomink /></h2> <h2> Brandify </h2></div>
            </RouterLink>

            <div class="d-flex">
                <RouterLink class="nav-link" to="/"> Home </RouterLink>
                <RouterLink class="nav-link" to="/edit"> Campaigns </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
    
</style>