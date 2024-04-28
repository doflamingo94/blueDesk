<template>
  <div class="page-content">
    <div v-if="annonceData" class="annonce-container">
      <div class="header">
        <h1>{{ annonceData.titre }}</h1>
        <p><span class="stand-out1">{{ annonceData.poste }}</span> chez <span class="stand-out"><nuxt-link :to="'/profilEmployeur/'+ annonceData.employeur_name">{{ annonceData.employeur_name }}</nuxt-link></span></p>
      </div>
      <div class="details">
        <p>Date de début: {{ `${date_debut}` }}</p>
        <p v-if="annonceData.date_fin">Date de fin: {{ `${date_fin}` }}</p>
        <p>Salaire: {{ annonceData.salaire }}</p>
      </div>
      <div class="description">
        <h2>Description</h2>
        <p v-dompurify-html="annonceData.description_poste"></p>
      </div>
      <div class="apply-button" v-if="(userRole === 'candidat' && !hasApplied)" >
            <button @click="candidate">postuler</button>
        </div>
        <div class="apply-button" v-else-if="!isLoggedIn">
            <button><nuxt-link to="/login">Inscrivez vous pour postuler</nuxt-link></button>
        </div>
        <div class="apply-button" v-else-if="userRole === 'employeur' || (userRole === 'candidat' && hasApplied)" style="display: none;">
        </div>
        <div class="apply-button" v-if="madeIt" >
          <nuxt-link :to="'/modifAnnonce/'+ annonceId"><button>Modifier</button></nuxt-link>
      </div>
        <div v-else style="display: none;">
        </div>
    </div>
  </div> 
 </template>
 
 <script setup>
 import axios from 'axios';
 import { useAuthStore } from '~/store/auth';
 import VueDOMPurifyHTML from 'vue-dompurify-html';
 
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
 const madeIt = ref(false);
 const config = useRuntimeConfig();
 
 if(isLoggedIn){
   userId = authStore.getId;
   userRole = authStore.getRole;
 }
 
 const verifCandidature = async () => {
   if(authStore.isLoggedIn && userRole !== 'employeur'){
       try {
           annonceId = parseInt(annonceId, 10);
 
           const response = await axios.post(`${config.public.backend}/api/v1/candidats/candidature`, {
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
               const response = await axios.post(`${config.public.backend}/api/v1/candidats/candidater`, {
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
       const response = await axios.get(`${config.public.backend}/api/v1/annonces/${annonceId}`);
       annonceData.value = response.data.data[0];
       date_debut.value = formatterDateSQL(annonceData.value.date_debut)
       if(annonceData.value.date_fin){
         date_fin.value = formatterDateSQL(annonceData.value.date_fin)
       }
       if(userRole === "employeur"){
         if(userId === annonceData.value.id_employeur){
           madeIt.value = true;
         }
       }
 } catch(err) {
     console.log(err)
 }
 }
 
 const formatterDateSQL = (dateSQL) => {
   var dateObj = new Date(dateSQL);
 
   var jour = dateObj.getDate();
   var mois = dateObj.getMonth() + 1; 
   var annee = dateObj.getFullYear();
 
   jour = (jour < 10) ? '0' + jour : jour;
   mois = (mois < 10) ? '0' + mois : mois;
 
   var dateFormatee = jour + '/' + mois + '/' + annee;
 
   return dateFormatee;
 }
 
 </script>
 
 <style scoped>
 .page-content {
   margin-top: 79px;
 }
 .annonce-container {
   max-width: 800px;
   margin: 0 auto;
   border: 1px solid rgb(212, 212, 212);
   padding: 20px;
   background-color: #f8f8f8;
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
   padding-left: 15px;
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
 
 .apply-button {
   text-align: center;
   margin-top: 20px;
 }
 
 .apply-button button {
   background-color: #007bff;
   color: #fff;
   border: none;
   border-radius: 4px;
   padding: 10px 20px;
   font-size: 16px;
   cursor: pointer;
   transition: background-color 0.3s ease;
 }
 
 .stand-out {
   color: rgb(250, 143, 143);
   font-weight: 600;
 }
 a:visited {
  color: inherit;
 }
 .stand-out1 {
   color: white;
   text-decoration: underline;
   font-weight: 600;
 }
 
 .apply-button a {
   color: white;
 }
 
 .apply-button button:hover {
   background-color: #0056b3;
 }
 
 a {
  color: inherit;
 }
 </style>