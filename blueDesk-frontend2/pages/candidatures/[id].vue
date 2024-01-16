<template>
    <div v-if="!candidaturesData" class="page-content">
        <div class="header">
            <h1>Pas encore de candidature</h1>
        </div>
    </div>
    <div v-else class="page-content">
        <div class="header">
            <h1>Candidatures pour le poste de {{ `${candidaturesData[0].poste}` }} </h1>
        </div>
        <div v-if="candidaturesData" class="candidatures-block">
            <ul v-for="candidature in candidaturesData" :key="candidature.id">
                <li @click="checkProfile(candidature.id, annonceId, candidature.statut)">{{ `${candidature.prenom}` }}  {{ `${candidature.nom}` }} {{ `${ calculateAge(candidature.date_naissance) }` }} ans</li>
            </ul>
        </div>
    </div>
</template>
    
<script setup>
import { useAuthStore } from '~/store/auth';
import { useProfile } from '~/store/profile';
import axios from 'axios';
const route = useRoute();
const router = useRouter();
let annonceId = route.params.id; 
const candidaturesData = ref(null);
const profileStore = useProfile();
const authStore = useAuthStore();
const userId = authStore.getId;
console.log(userId);
const config = useRuntimeConfig();

const candidatures = async () => {
    try {
            const response = await axios.post(`${config.public.backend}/api/v1/annonces/candidatures`, {
                id_annonce: annonceId,
                id_employeur: userId
            });
            if(response.data.data){
               candidaturesData.value = response.data.data;
            }
            else {
                console.log('Aucune candidature');
            }
            
        } catch (err) {
            console.log(err);
        }
}

onBeforeMount(async ()=>{
    await candidatures();
    })

function calculateAge(birthdate) {
    var birthDate = new Date(birthdate);

    var currentDate = new Date();

    var age = currentDate.getFullYear() - birthDate.getFullYear();

    if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
            currentDate.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}

const checkProfile = (profileId, annonceId, statut) => {
    profileStore.setProfile(profileId);
    profileStore.setAnnonce(annonceId);
    profileStore.setStatus(statut);
    router.push('/profile-candidat');
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