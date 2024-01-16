
<template>
    <div class="container">
        <SearchBar />
    </div>
    <JobCard :message="annonces" />
</template>

<script setup>
   import axios from 'axios';
   const config = useRuntimeConfig();
   const response = await axios.get(`${config.public.backend}/api/v1/annonces`);
   console.log('Khaled', config.public.backend)
   const annonces = response.data.data;
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>