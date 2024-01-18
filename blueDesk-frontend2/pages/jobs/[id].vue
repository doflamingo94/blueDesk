<template>
    <h1>Recherche un poste</h1>
    <div class="container">
        <SearchBar @clicked="handleSearch" />
    </div>
    <JobCard v-if="testAnnonces" :message="annonces" />
    <h2 v-else>
        Pas d'annonces pour ce poste :/
    </h2>
</template>
<script setup>
import axios from 'axios';
const route = useRoute();
const router = useRouter();
const search = ref('');
const config = useRuntimeConfig();
const annonces = ref(null);
const testAnnonces = ref(false);

if(route.params.id){
    search.value = route.params.id;
}

const handleSearch = (searchValue) => {
    if(searchValue.length > 0){
            const routePath = `/jobs/${searchValue}`;
            router.push(routePath);
        } else {
            const routePath = `/jobs/jobs`;
            router.push(routePath);
        }
}

onMounted( async () => {
  await hydrateJobs();
})

const hydrateJobs = async () => {
    if(search.value.length > 3){
        try {
            console.log(search.value)
            const response = await axios.post(`${config.public.backend}/api/v1/annonces/search`, {
            search: search.value
            });
            if (response.data.data.length > 0){
                testAnnonces.value = true;
            }
            annonces.value = response.data.data
            
        } catch (err) {
            console.log(err);
        }
    }
}

</script>
<style scoped>
h1{
    text-align: center;
}
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>