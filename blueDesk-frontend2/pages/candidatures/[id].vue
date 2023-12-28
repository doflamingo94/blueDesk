<template>
    <div class="page-content">
        <div class="header">
            <h1 v-if="candidaturesData">Candidatures pour le poste de {{ `${candidaturesData[0].poste}` }} </h1>
            <h1 v-else>Pas encore de candidatures</h1>
        </div>
        <div v-if="candidaturesData" class="candidatures-block">
            <!-- <ul v-for="candidature in candidaturesData" :key="candidature.id">
                <li>{{ `${candidature.prenom}` }}</li>
            </ul> -->
            <ul v-for="candidature in candidaturesData" :key="candidature.id">
                <li>{{ `${candidature.prenom}` }}  {{ `${candidature.nom}` }} {{ `${ calculateAge(candidature.date_naissance) }` }} ans</li>
            </ul>
        </div>
    </div>
</template>
    
<script setup>
import axios from 'axios';
const route = useRoute();
let annonceId = route.params.id; 
const candidaturesData = ref(null);

const candidatures = async () => {
    try {
            const response = await axios.post('http://localhost:3001/api/v1/annonces/candidatures', {
                id_annonce: annonceId
            });

            candidaturesData.value = response.data.data;

            console.log('Status Code:', response.status);
            console.log('Response Data:', response.data.data[0].poste);
            console.log(candidaturesData.value);
            // window.location.href = `/annonce/${annonceId}`
        } catch (err) {
            console.log(err);
        }
}

onBeforeMount(async ()=>{
    await candidatures();
    })

function calculateAge(birthdate) {
    // Parse the MySQL DATETIME string into a JavaScript Date object
    var birthDate = new Date(birthdate);

    // Get the current date
    var currentDate = new Date();

    // Calculate the difference in years
    var age = currentDate.getFullYear() - birthDate.getFullYear();

    // Check if the birthday has already occurred this year
    if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
            currentDate.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}
    
</script>
    
<style scoped>

.header, .candidatures-block{
    padding-top: 30px;
    display: flex;
    justify-content: center;
}

.candidatures-block{
    flex-direction: column;
    align-items: center;
}

ul{
    list-style: none;
}



</style>