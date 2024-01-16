<template>
<div class="page-content">
    <div id="error-message" class="error-message"></div>
    <h1>Test</h1>
    <div class="annonces-section">
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
    </div>
</div>
</template>

<script setup>
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ref } from 'vue';
import { vMaska } from 'maska';

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
</style>