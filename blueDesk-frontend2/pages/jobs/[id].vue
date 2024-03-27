<template>
    <div class="page-content">
        <h1>Recherche un poste</h1>
        <div class="container">
            <SearchBar @clicked="handleSearch" />
        </div>
        <JobCards v-if="testAnnonces" :message="paginatedJobs" />
        <h2 class="no-result" v-else-if="vide">Faites une recherche de poste ;)</h2>
        <h2 class="no-result" v-else>
            Pas d'annonces pour ce poste :/
        </h2>
        <Paginator
        v-if="testAnnonces && jobs.length > 15"
        v-model:first="first"
        :rows="10"
        :totalRecords="jobs.length"
        />
    </div>
</template>
<script setup>
import axios from 'axios';
const route = useRoute();
const router = useRouter();
const search = ref('');
const config = useRuntimeConfig();
const annonces = ref(null);
const testAnnonces = ref(false);
const jobs = ref([]);
const vide = ref(false);

   
jobs.value = annonces;
const first = ref(0);

if(route.params.id){
    search.value = route.params.id;
}

if(search.value === 'kazisearch'){
    vide.value = true;
}

const handleSearch = (searchValue) => {
    if(searchValue.length > 0){
            const routePath = `/jobs/${searchValue}`;
            router.push(routePath);
        } else {
            vide.value = true;
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
            jobs.value = response.data.data
            
        } catch (err) {
            console.log(err);
        }
    }
}

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
h1{
    text-align: center;
}
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
.no-result {
    text-align: center;
    margin-top: 20vh;
}
</style>