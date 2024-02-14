<template>
    <div class="page-content">
        <div class="user-profile">
            <div class="banner">
                <img src="../assets/images/background-original.jpg" alt="Banner Image" />
            </div>

            <div class="profile-picture">
                <img src="../assets/images/background-pexels-mo-eid-11592804.jpg" alt="Profile Picture" />
            </div>

            <h1><span v-if="candidatData">{{ `${candidatData.prenom}` }} {{ `${candidatData.nom}` }}</span> </h1>
            <div v-if="status != 'retenue' && status !='refusé'" class="decision">
                <button @click="valider">Valider</button> <button @click="refuser">Refuser</button>
            </div>
        </div>
        
    </div>
</template>
<script setup>
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ref } from 'vue';
import { useProfile } from '~/store/profile';

const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfile();
const annonceId = profileStore.getAnnonceId;
const userId = authStore.getId;
const candidatData = ref(null);
let profileId = profileStore.getProfileId;
const status = profileStore.getStatus;
const config = useRuntimeConfig();
console.log('khaledddddddd yoooo', profileId, 'bonjourrrr', annonceId, '3emeeee', status);

console.log(userId)

if (!authStore.isLoggedIn) {
    router.push({ path: '/' })
} else {
    onBeforeMount(async () => {
        await hydrateUser();
    })
}

const hydrateUser = async () => {
    try {
        const response = await axios.get(`${config.public.backend}/api/v1/candidats/${profileId}`);
        candidatData.value = response.data.data[0];
        console.log(response.data.data[0]);
        console.log(candidatData.value);
    } catch (err) {
        console.log(err)
    }
}

const refuser = async () => {
    try {
        const response = await axios.post(`${config.public.backend}/api/v1/employeurs/refuser`, {
                id_annonce: annonceId,
                id_candidat: profileId
            });
            console.log('Status Code:', response.status);
            console.log('La candidature a bien été refusée');
            router.push(`/candidatures/${annonceId}`);
    } catch (error) {
        console.log(error)
    }
}

const valider = async () => {
    try {
        const response = await axios.post(`${config.public.backend}/api/v1/employeurs/valider`, {
                id_annonce: annonceId,
                id_candidat: profileId
            });
            console.log('Status Code:', response.status);
            console.log('La candidature a bien été validée');
            router.push(`/candidatures/${annonceId}`);
    } catch (error) {
        console.log(error)
    }
}

</script>
<style scoped>
.user-profile {
    text-align: center;
}

.banner {
    width: 100%;
    height: 200px;
    overflow: hidden;
    position: relative;
}

.banner img {
    width: 100%;
    height: auto;
}

.profile-picture {
    position: absolute;
    top: 12rem;
    left: 13%;
    transform: translateX(-50%);
    border-radius: 50%;
    border: 4px solid #fff;
    overflow: hidden;
    width: 150px;
    height: 150px;
}



.profile-picture img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
}

.user-info {
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 8px;
    display: inline-block;
}

.user-info h2 {
    font-size: 24px;
    margin: 0;
}

@media screen and (max-width: 900px) {
    .profile-picture {
        position: absolute;
        top: 7rem;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50%;
        border: 4px solid #fff;
        overflow: hidden;
        width: 150px;
        height: 150px;
    }
}



@media screen and (max-width: 650px) {
    .title {
        font-size: 15px;
    }

}

@media screen and (max-width: 320px) {

    .heading {
        font-size: 30px;
    }

    .title {
        font-size: 10px;
    }

}
</style>