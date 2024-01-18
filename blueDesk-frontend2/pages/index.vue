<template>
    <div class="container">
        <SearchBar @clicked="handleSearch" />
    </div>
    <JobCard :message="annonces" />
</template>

<script setup>
   import axios from 'axios';
   const config = useRuntimeConfig();
   const router = useRouter();
   const response = await axios.get(`${config.public.backend}/api/v1/annonces`);
   console.log('Khaled', config.public.backend)
   const annonces = response.data.data;

   const handleSearch = (searchValue) => {
  // Use the search value and navigate to another route
        if(searchValue.length > 0){
            const routePath = `/jobs/${searchValue}`;
            router.push(routePath);
        } else {
            const routePath = `/jobs/jobs`;
            router.push(routePath);
        }
   };

</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>