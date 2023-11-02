
<template>
    <div class="container">
        <SearchBar />
    </div>
    <JobCard :message="annonces" />
</template>

<script setup>
import { useAuthStore } from '../store/auth';   
   const authStore = useAuthStore();
   const { data: responses } = await useFetch('http://localhost:3001/api/v1/annonces')
   const annonces = responses._rawValue.data

   console.log(authStore.isLoggedIn) 
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>