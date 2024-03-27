<template>
    <!-- <div class="hero-container"> -->
        <!-- <he-ro /> -->
        <HeroTest />
        <!-- <VueCardCarousel /> -->
       <!-- <div class="titles">
            <h1>Rechercher un emploi aux Comores</h1>
            
       </div>  -->
    <!-- </div> -->
    <!-- <div class="container">
        <SearchBar @clicked="handleSearch" />
    </div> -->
    <div class="titles">
        <h1>Nos annonces</h1>
    </div> 
    <JobCards :message="paginatedJobs" />
    <Paginator
    v-model:first="first"
    :rows="10"
    :totalRecords="jobs.length"
    />
</template>

<script setup>
import axios from 'axios';
   const config = useRuntimeConfig();
   const router = useRouter();
   const response = await axios.get(`${config.public.backend}/api/v1/annonces`);
   console.log('Khaled', config.public.backend)
   const annonces = response.data.data;
   const jobs = ref([]);

   
   jobs.value = annonces;
   const first = ref(0);

//    const handleSearch = (searchValue) => {
//         if(searchValue.length > 0){
//             const routePath = `/jobs/${searchValue}`;
//             router.push(routePath);
//         } else {
//             const routePath = `/jobs/jobs`;
//             router.push(routePath);
//         }
//    };

   // Compute paginated jobs based on current page and jobs per page
    const paginatedJobs = computed(() => {
        const startIndex = first.value;
        const endIndex = startIndex + 15; // Change 15 to the number of jobs per page
        return jobs.value.slice(startIndex, endIndex);
    });

</script>

<style scoped>
:deep(.p-paginator) {
    background-color: transparent;
    justify-content: center;
}
.titles{
    background-color: white;
    width: auto;
    padding: 0px 15px 15px 15px;
    margin-top: 22px;
    color: rgb(13 102 132);
}
h1, h2{
    text-align: center;
}
h1 {
    padding-top: 19px;
}
h2{
    padding-top: 30px;
}
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
.hero-container {
    height: 95vh;
    width: 100vw;
}
</style>