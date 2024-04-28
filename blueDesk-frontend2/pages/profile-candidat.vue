<template>
    <div class="page-content">
        <div v-if="candidatData" class="user-profile">
            <div class="banner">
                <img src="../assets/images/background-original.jpg" alt="Banner Image" />
            </div>

            <div v-if="!candidatData.url_pp" class="profile-picture">
              <img src="../assets/images/background-pexels-mo-eid-11592804.jpg" alt="Profile Picture" />
          </div>
            
          <div v-else class="profile-picture">
            <CldImage :src="candidatData.url_pp" @click="visible = true" alt="test"/>
          </div>

            <!-- <h1><span v-if="candidatData">{{ `${candidatData.prenom}` }} {{ `${candidatData.nom}` }}</span> </h1> -->
            <div class="container">
              <div class="row">
                <div class="col-md-4">
                  <!-- <img class="profile-img" src="../assets/images/briefcase1.png" alt="Profile Picture">  -->
                  <h2 class="mt-3 text-center">{{ `${candidatData.prenom}` }} {{ `${candidatData.nom}` }}</h2>
                  <p class="text-muted text-center" v-if="candidatData.profession">{{ `${candidatData.profession}` }}</p>
                </div>
                <div class="col-md-8">
                    <div class="card mb-3">
                    <div class="card-header">
                      <h3>Description</h3>
                    </div>
                    <p v-if="candidatData.description" v-dompurify-html="candidatData.description" class="text-muted"/>
                  </div>
                  <div class="card mb-3">
                    <div class="card-header">
                      <h3>Expériences Professionnelles</h3>
                    </div>
                    <ul v-if="experienceData" class="list-group list-group-flush" v-for="experience in experienceData" :key="experience.id">
                      <li class="list-group-item">
                        <h5>{{ `${experience.employeur}` }} - {{ `${experience.poste}` }}</h5>
                        <p class="mb-0">du {{ `${experience.date_debut}` }} au <span v-if="experience.date_fin">{{ `${experience.date_fin}` }}</span></p>
                        <!-- <p class="text-muted">{{ experience.description }}</p> -->
                      </li>
                    </ul>
                  </div>
                  <div  class="card">
                    <div class="card-header">
                      <h3>Formations</h3>
                    </div>
                    <ul v-if="formationData" class="list-group list-group-flush" v-for="formation in formationData" :key="formation.id">
                      <li class="list-group-item">
                        <h5>{{ `${formation.ecole}` }} - {{ `${formation.nom}` }}</h5>
                        <p class="mb-0"> du {{ `${formation.date_debut}` }} au <span v-if="formation.date_fin">{{ `${formation.date_fin}` }}</span></p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="status != 'retenue' && status !='refusé'" class="decision">
                <Button label="Valider" @click="valider" /> <Button label="Refuser" @click="refuser" />
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
const experienceData = ref(null);
const formationData = ref(null);
console.log('khaledddddddd yoooo', profileId, 'bonjourrrr', annonceId, '3emeeee', status);

console.log(userId)

function formatterDateSQL(dateSQL) {
    var dateObj = new Date(dateSQL);

    var jour = dateObj.getDate();
    var mois = dateObj.getMonth() + 1; 
    var annee = dateObj.getFullYear();

    jour = (jour < 10) ? '0' + jour : jour;
    mois = (mois < 10) ? '0' + mois : mois;

    var dateFormatee = jour + '/' + mois + '/' + annee;

    return dateFormatee;
}

const formatExperiences = (experienceData) => {
    if (Array.isArray(experienceData)) {
        for (const experience of experienceData) {
            if (experience.date_debut && !experience.date_fin) {
                experience.date_debut = formatterDateSQL(experience.date_debut);
            }
            else if (experience.date_debut && experience.date_fin) {
              experience.date_debut = formatterDateSQL(experience.date_debut);
              experience.date_fin = formatterDateSQL(experience.date_fin);
            }
        }
    }
};

if (!authStore.isLoggedIn) {
    router.push({ path: '/' })
} else {
    onBeforeMount(async () => {
        await Promise.all([hydrateUser(), hydrateExperiences(), hydrateFormations()]);
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

const hydrateExperiences = async () => {
  try {
    const response = await axios.post(`${config.public.backend}/api/v1/candidats/experiences`, {
          id_candidat: profileId
        });
    experienceData.value = response.data.data;
    console.log(response.data.data, 'YYYYYYYYYYYYYYYYY');
    console.log(experienceData.value, 'YYYYYYYYYYYYYYYYY');
    formatExperiences(experienceData.value)
  } catch (err) {
    console.log(err)
  }
}

const hydrateFormations = async () => {
  try {
    const response = await axios.post(`${config.public.backend}/api/v1/candidats/formations`, {
          id_candidat: profileId
        });
    formationData.value = response.data.data;
    console.log(response.data.data[0], 'YYYYYYYYYYYYYYYYY');
    console.log(formationData.value, 'YYYYYYYYYYYYYYYYY');
    formatExperiences(formationData.value);
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
    top: 10rem;
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
        top: 5rem;
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

/* Container */
.container {
    padding: 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .row {
    width: 100%;
  }
  
  /* Columns */
  .col {
    flex: 0 0 50%;
    padding: 15px;
    background-color: #fff; /* White background for content */
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */
    margin-bottom: 20px;
  }
  
  .col-md-8 {
    text-align: left;
  }
  /* Profile Picture */
  .profile-picture {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 50%;
    /* border: 5px solid #e91e63; */
  }
  
  /* Cards */
  .card {
    padding: 21px;
    border-radius: 5px;
    background-color: #f5f5f5; /* Light gray background */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* More prominent shadow */
  }
  
  .card-header {
    border-bottom: 1px solid #e91e63; /* Pink border */
    padding-bottom: 10px;
    margin-bottom: 10px;
    color: #333; /* Darker text for better contrast */
  }

  .profile-img {
    height: 35px;
    width: 35px;
    border-radius: 50%;
  }
  
  /* Button */
  .btn {
    padding: 10px 20px;
    background-color: #e91e63; /* Pink button */
    color: #fff; /* White text */
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn:hover {
    background-color: #c2185b; /* Darker pink on hover */
  }
  
  /* Text Alignment */
  .text-center {
    text-align: center;
  }
  
  /* Titles and Headings */
  h2, h3, h5 {
    color: #333; /* Darker text for better contrast */
  }
  
  /* Description and Text */
  p {
    color: #666; /* Lighter text for readability */
  }
  
  /* Responsiveness (Optional) */
  @media (max-width: 768px) {
    .col {
      flex: 100%; /* Stack columns on smaller screens */
    }
  }

</style>