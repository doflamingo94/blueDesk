<template>
<div class="page-content">
    <div id="error-message" class="error-message"></div>
    <!-- <div class="annonces-section">
        <div class="container">
            <div class="form-section" v-if="previousAnnonceData">

              <form @submit.prevent class="login-box">
                  <input type="text"
                         class="name ele"
                         :placeholder="previousAnnonceData.titre" v-model="newAnnonce.titre">
                  <input type="text"
                         class="name ele"
                         :placeholder="previousAnnonceData.lieu" v-model="newAnnonce.lieu">
                  <input v-maska data-maska="##/##/####" type="text"
                         class="name ele"
                         :placeholder="date_debut" v-model="newAnnonce.date_debut">
                  <input v-if="date_fin" v-maska data-maska="##/##/####" type="text"
                         class="name ele"
                         :placeholder="date_fin" v-model="newAnnonce.date_fin">
                  <input v-else v-maska data-maska="##/##/####" type="text"
                         class="name ele"
                         placeholder="Date de fin" v-model="newAnnonce.date_fin">
                  <input type="text"
                         class="name ele"
                         :placeholder="previousAnnonceData.poste" v-model="newAnnonce.poste">
                  <input type="text"
                         class="name ele"
                         :placeholder="previousAnnonceData.salaire" v-model="newAnnonce.salaire">
                  <textarea name="description_poste ele" cols="34" rows="70" :placeholder="previousAnnonceData.description_poste" v-model="newAnnonce.description_poste"></textarea>
                  <button @click="updateAnnonce">test</button>
              </form>
            </div> 
        </div>
    </div> -->
    <div v-if="previousAnnonceData" class="wrapper">
              <div class="title-text">
                <div class="title" :style="{marginLeft: loginMargin}">Modifiez votre annonce</div>
              </div>
              <div class="form-container">
                <div class="form-inner">
                  <form @submit.prevent class="login" :style="{marginLeft: loginFormMargin}">
                    <div class="field">
                      <input type="text"
                      :placeholder="previousAnnonceData.titre" v-model="newAnnonce.titre">
                    </div>
                    <div class="field">
                      <input type="text"
                      :placeholder="previousAnnonceData.lieu" v-model="newAnnonce.lieu">
                    </div>
                    <div class="field">
                      <input v-maska data-maska="##/##/####" type="text"
                      :placeholder="date_debut" v-model="newAnnonce.date_debut">
                    </div>
                    <div class="field">
                      <input v-if="date_fin" v-maska data-maska="##/##/####" type="text"
                      :placeholder="date_fin" v-model="newAnnonce.date_fin">
                      <input v-else v-maska data-maska="##/##/####" type="text"
                      placeholder="Date de fin" v-model="newAnnonce.date_fin">
                    </div>
                    <div class="field">
                      <input type="text"
                      :placeholder="previousAnnonceData.poste" v-model="newAnnonce.poste">
                    </div>
                    <div class="field">
                      <input type="text"
                      :placeholder="previousAnnonceData.salaire" v-model="newAnnonce.salaire">
                    </div>
                    <div class="editor-container">
                      <Editor :placeholder="previousAnnonceData.description_poste" v-model="newAnnonce.description_poste" editorStyle="min-height: 320px" />
                    </div>
                    <div class="field btn">
                      <div class="btn-layer"></div>
                      <button ref="annonceButton" @click="updateAnnonce" type="submit" class="clkbtn">modifier</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
</div>
</template>

<script setup>
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ref } from 'vue';
import { vMaska } from 'maska';
import Editor from 'primevue/editor';

const router = useRouter();
const route = useRoute();
let annonceId = route.params.id;
const authStore = useAuthStore();
const userId = authStore.getId;
const userRole = authStore.getRole;
const annonceButton = ref(null);
const previousAnnonceData = ref(null);
const date_debut = ref(null);
const date_fin = ref(null);
const config = useRuntimeConfig();
const newAnnonce = ref({
  titre: '',
  lieu: '',
  date_debut: '',
  date_fin: '',
  poste: '',
  salaire: '',
  description_poste: ''
});

console.log(userId)

if(!authStore.isLoggedIn){
        router.push({path: '/'})
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

function convertDateFormat(dateString) {
  const parts = dateString.split('/');

  if (parts.length === 3) {
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    const newDateString = `${year}/${month}/${day}`;

    return newDateString;
  } else {
    return 'Invalid date format';
  }
}

function showError(message) {
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';

  setTimeout(() => {
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
  }, 5000);
}

const hydrateUser = async () => {
  try  {
        const response = await axios.get(`${config.public.backend}/api/v1/annonces/${annonceId}`);
        previousAnnonceData.value = response.data.data[0];
        date_debut.value = formatterDateSQL(previousAnnonceData.value.date_debut)
        if(previousAnnonceData.value.date_fin){
          date_fin.value = formatterDateSQL(previousAnnonceData.value.date_fin)
        }
        console.log(previousAnnonceData.value.date_debut);
  } catch(err) {
      console.log(err)
  }
}

const updateAnnonce = async () => {
    if (
      !newAnnonce.value.titre ||
      !newAnnonce.value.lieu ||
      !newAnnonce.value.date_debut ||
      !newAnnonce.value.poste ||
      !newAnnonce.value.salaire ||
      !newAnnonce.value.description_poste
    ) {
      showError("Veuillez remplir 'tous' les champs obligatoires (*).");
     } else {
      try {
        const date_debut = convertDateFormat(newAnnonce.value.date_debut);
        if(newAnnonce.value.date_fin.length > 0){
          newAnnonce.value.date_fin = convertDateFormat(newAnnonce.value.date_fin);
        }
        const response = await axios.put(`${config.public.backend}/api/v1/annonces/${annonceId}`, {
          titre: newAnnonce.value.titre,
          lieu: newAnnonce.value.lieu,
          date_debut: date_debut,
          poste: newAnnonce.value.poste,
          salaire: newAnnonce.value.salaire,
          description_poste: newAnnonce.value.description_poste,
          date_fin: newAnnonce.value.date_fin,
        });

        console.log('Status Code:', response.status);
        console.log('Response Data:', response.data);

        newAnnonce.value = {};
        window.location.href = `/annonce/${annonceId}`
      } catch (err) {
        console.log(err);
      }
     }
}

onBeforeMount(async ()=>{
    await hydrateUser();
})



</script>

<style scoped>
.annonces-section{
    width: 100%;
    display: flex;
    justify-content: center;
}
.container {
    height: 700px;
    width: 500px;
    background-color: rgb(56, 177, 233);
    box-shadow: 8px 8px 20px rgb(128, 128, 128);
    position: relative;
    overflow: hidden;
    margin-top: 20px;
    border-radius: 10px;
}

.form-section {
    height: 500px;
    padding: 20px 0;
    display: flex;
    position: relative;
    transition: all 0.5s ease-in-out;
    left: 0px;
}

.login-box {
  height: 100%;
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px 40px;
  padding-top: 83px;
  gap: 50px;
}

.error-message {
    position: fixed;
    top: 120px;
    width: 300px;
    z-index: 2;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgb(255, 78, 78);
    color: white;
    padding: 6px;
    display: none; 
    border-radius: 6px;
  }

.clkbtn {
  height: 60px;
  color: white;
  width: 150px;
  border-radius: 50px;
  background-image: linear-gradient(to right,
          rgb(59, 228, 124),
          rgb(50, 254, 138));
  font-size: 22px;
  border: none;
  cursor: pointer;
}

.ele {
  height: 60px;
  width: 400px;
  outline: none;
  border: none;
  color: rgb(77, 77, 77);
  background-color: rgb(240, 240, 240);
  border-radius: 50px;
  padding-left: 30px;
  font-size: 18px;
}

textarea {
  width: 100%;
  height: auto;
  padding: 70px 20px;
  box-sizing: border-box;
  background-color: #f8f8f8;
  font-size: 16px;
  resize: none;
  outline: none;
  border: none;
  color: rgb(77, 77, 77);
  background-color: rgb(240, 240, 240);
  border-radius: 25px;
  padding-left: 30px;
  font-size: 18px;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none; 
  }
  textarea::-webkit-scrollbar {
    display: none;
  }

  @media screen and (max-width: 1023px) {
      .annonces-section{
        flex-direction: column;
        align-items: center;
      }
  }

  

  @media screen and (max-width: 650px) {
    .container {
        height: 600px;
        width: 300px;
    }
 
 
    .form-section {
        height: 500px;
        width: 600px;
        padding: 38px 0;
    }
 
    .ele {
        height: 50px;
        width: 250px;
        font-size: 15px;
    }
 
    .clkbtn {
        height: 50px;
        width: 130px;
        font-size: 19px;
    }
    textarea {
      width: 126%;
    }
}
 
@media screen and (max-width: 320px) {
    .container {
        height: 600px;
        width: 250px;
    }

 

 
    .form-section {
        height: 500px;
        width: 500px;
    }
 
 
    .ele {
        height: 50px;
        width: 204px;
        font-size: 15px;
    }
 
    .clkbtn {
        height: 50px;
        width: 130px;
        font-size: 19px;
    }

    textarea {
      width: 137%;
    }
}

.wrapper{
  overflow: hidden;
  max-width: 630px;
  margin: auto;
  background: #fff;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0px 15px 20px rgba(0,0,0,0.1);
}
.wrapper .title-text{
  display: flex;
  width: 200%;
}
.wrapper .title{
  width: 50%;
  font-size: 35px;
  font-weight: 600;
  text-align: center;
  transition: all 0.6s cubic-bezier(0.68,-0.55,0.265,1.55);
}
.format-input {
  height: 100%;
  width: 100%;
  outline: none;
  padding-left: 15px;
  border-radius: 5px;
  border: 1px solid lightgrey;
  border-bottom-width: 2px;
  font-size: 17px;
  transition: all 0.3s ease;
}
.wrapper .slide-controls{
  position: relative;
  display: flex;
  height: 50px;
  width: 100%;
  overflow: hidden;
  margin: 30px 0 10px 0;
  justify-content: space-between;
  border: 1px solid lightgrey;
  border-radius: 5px;
}
.slide-controls .slide{
  height: 100%;
  width: 100%;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  line-height: 48px;
  cursor: pointer;
  z-index: 1;
  transition: all 0.6s ease;
}
.slide-controls label.signup{
  color: #000;
}
.slide-controls .slider-tab{
  position: absolute;
  height: 100%;
  width: 50%;
  left: 0;
  z-index: 0;
  border-radius: 5px;
  background: -webkit-linear-gradient(left, #68cef7, #08b2f5);
  transition: all 0.6s cubic-bezier(0.68,-0.55,0.265,1.55);
}
input[type="radio"]{
  display: none;
}
#signup:checked ~ .slider-tab{
  left: 50%;
}
#signup:checked ~ label.signup{
  color: #fff;
  cursor: default;
  user-select: none;
}
#signup:checked ~ label.login{
  color: #000;
}
#login:checked ~ label.signup{
  color: #000;
}
#login:checked ~ label.login{
  cursor: default;
  user-select: none;
}
.wrapper .form-container{
  width: 100%;
  overflow: hidden;
}
.form-container .form-inner{
  display: flex;
  width: 200%;
}
.form-container .form-inner form{
  width: 50%;
  transition: all 0.6s cubic-bezier(0.68,-0.55,0.265,1.55);
}
.form-inner form .field{
  height: 50px;
  width: 100%;
  margin-top: 20px;
}
.form-inner form .field input{
  height: 100%;
  width: 100%;
  outline: none;
  padding-left: 15px;
  border-radius: 5px;
  border: 1px solid lightgrey;
  border-bottom-width: 2px;
  font-size: 17px;
  transition: all 0.3s ease;
}
textarea{
  margin-top: 20px;
  width: 100%;
  outline: none;
  padding-left: 15px;
  background-color: white;
  border-radius: 5px;
  border: 1px solid lightgrey;
  border-bottom-width: 2px;
  font-size: 17px;
  transition: all 0.3s ease;
}
.form-inner form .field input:focus{
  border-color: #34a7d3;
  /* box-shadow: inset 0 0 3px #fb6aae; */
}
.form-inner form .field input::placeholder{
  color: #999;
  transition: all 0.3s ease;
}
form .field input:focus::placeholder{
  color: #b3b3b3;
}
.form-inner form .pass-link{
  margin-top: 5px;
}
.form-inner form .signup-link{
  text-align: center;
  margin-top: 30px;
}
.form-inner form .pass-link a,
.form-inner form .signup-link a{
  color: #34a7d3;
  text-decoration: none;
}
.form-inner form .pass-link a:hover,
.form-inner form .signup-link a:hover{
  text-decoration: underline;
}
form .btn{
  height: 50px;
  width: 100%;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
}
form .btn .btn-layer{
  height: 100%;
  width: 300%;
  position: absolute;
  left: -100%;
  background: -webkit-linear-gradient(left, #68cef7, #08b2f5);
  border-radius: 5px;
  transition: all 0.4s ease;;
}
form .btn:hover .btn-layer{
  left: 0;
}
form .btn input[type="submit"]{
  height: 100%;
  width: 100%;
  z-index: 1;
  position: relative;
  background: none;
  border: none;
  color: #fff;
  padding-left: 0;
  border-radius: 5px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
}
form .btn button{
  height: 100%;
  width: 100%;
  z-index: 1;
  position: relative;
  background: none;
  border: none;
  color: #fff;
  padding-left: 0;
  border-radius: 5px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
}
.editor-container {
    margin-top: 20px;
  }
</style>