<template>
    <div v-if="annonceData" class="annonce-container">
        <div class="header">
          <h1>{{ `${annonceData.titre}` }}</h1>
          <p>{{ `${annonceData.poste}` }} chez {{ `${annonceData.employeur_name}` }}</p>
        </div>
        <div class="details">
          <p>Date de début: {{ `${date_debut}` }}</p>
          <p v-if="annonceData.date_fin">Date de fin: {{ `${date_fin}` }}</p>
          <p>Salaire: {{ `${annonceData.salaire}` }}</p>
        </div>
        <div class="description">
          <h2>Description</h2>
          <p>{{ `${annonceData.description_poste}` }}</p>
        </div>
        <div class="apply-button" v-if="(userRole === 'candidat' && !hasApplied)" >
            <button @click="candidate">postuler</button>
        </div>
        <div class="apply-button" v-else-if="!isLoggedIn">
            <button><nuxt-link to="/login">Inscrivez vous pour postuler</nuxt-link></button>
        </div>
        <div class="apply-button" v-else-if="userRole === 'employeur' || (userRole === 'candidat' && hasApplied)" style="display: none;">
        </div>
        <div v-else style="display: none;">
        </div>
      </div>
</template>
<script setup>
import axios from 'axios';
import { useAuthStore } from '~/store/auth';

const annonceData = ref(null);
const route = useRoute();
let annonceId = route.params.id;
const authStore = useAuthStore();
const hasApplied = ref(null);
hasApplied.value = false;
let userId = null;
let userRole = null;
const isLoggedIn = ref(null);
const candidater = ref(null);
isLoggedIn.value = authStore.isLoggedIn;
const date_debut = ref(null);
const date_fin = ref(null);

if(isLoggedIn){
    userId = authStore.getId;
    userRole = authStore.getRole;
}

const verifCandidature = async () => {
    if(authStore.isLoggedIn && userRole !== 'employeur'){
        try {
            annonceId = parseInt(annonceId, 10);

            const response = await axios.post('https://13.39.156.186:3001/api/v1/candidats/candidature', {
                    id_candidat: userId,
                    id_annonce: annonceId
            });

            if(response.data.data[0] === undefined){
                console.log('pas encore candidaté', hasApplied.value)
            } else if (response.data.data[0].id_candidat) {
                hasApplied.value = true;
                console.log('déjà candidaté', response.data.data[0]);
            }
        } catch(err) {
                console.log(err)
        }
  }
}

const candidate = async () => {
    try {
                const response = await axios.post('https://13.39.156.186:3001/api/v1/candidats/candidater', {
                    id_annonce: annonceId,
                    id_candidat: userId,
                    statut: 'en cours'
                });

                console.log('Status Code:', response.status);
                console.log('Response Data:', response.data);
                console.log('Vous avez bien candidaté à cet offre');
                window.location.href = `/annonce/${annonceId}`
            } catch (err) {
                console.log(err);
            }
}

onBeforeMount(async ()=>{
    await Promise.all([hydrateUser(), verifCandidature()]);
    })

const hydrateUser = async () => {
  try  {
        const response = await axios.get(`https://13.39.156.186:3001/api/v1/annonces/${annonceId}`);
        annonceData.value = response.data.data[0];
        date_debut.value = formatterDateSQL(annonceData.value.date_debut)
        if(annonceData.value.date_fin){
          date_fin.value = formatterDateSQL(annonceData.value.date_fin)
        }
  } catch(err) {
      console.log(err)
  }
}

const formatterDateSQL = (dateSQL) => {
    // Convertir la chaîne de date SQL en objet Date
    var dateObj = new Date(dateSQL);

    // Extraire le jour, le mois et l'année
    var jour = dateObj.getDate();
    var mois = dateObj.getMonth() + 1; // Les mois commencent à partir de zéro
    var annee = dateObj.getFullYear();

    // Ajouter un zéro au jour et au mois si nécessaire
    jour = (jour < 10) ? '0' + jour : jour;
    mois = (mois < 10) ? '0' + mois : mois;

    // Formater la date en jj/mm/aaaa
    var dateFormatee = jour + '/' + mois + '/' + annee;

    return dateFormatee;
}

</script>


  <style scoped>
  .annonce-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .header {
    background-color: #007bff;
    color: #fff;
    padding: 15px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  
  h1 {
    font-size: 28px;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 18px;
    margin-bottom: 8px;
  }
  
  .details {
    padding: 15px;
  }
  
  .description {
    margin-top: 20px;
  }
  
  .description h2 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #007bff;
  }
  
  .description p {
    font-size: 18px;
    line-height: 1.6;
  }
  </style>