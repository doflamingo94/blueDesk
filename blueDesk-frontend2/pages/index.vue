
<template>
    <div class="container">
        <SearchBar />
    </div>
    <JobCard :message="annonces" />
</template>

<script setup>
import axios from 'axios';
   const response = await axios.get(`https://ae28qeazag.execute-api.eu-west-3.amazonaws.com/api/v1/annonces`);
   const annonces = response.data.data;
//    console.log(annonces)
   
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>