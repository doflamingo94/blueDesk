<template>
  <div class="page-content">
        <div id="error-message" class="error-message"></div>
        <div id="notif-message" class="notif-message"></div>
        <div class="user-profile">
            <div class="banner">
              <img src="../assets/images/background-original.jpg" alt="Banner Image" />
            </div>
            
            <div class="profile-picture">
              <img src="../assets/images/background-pexels-mo-eid-11592804.jpg" alt="Profile Picture" />
            </div>
            
            <h1><span v-if="employeursData">{{ `${employeursData.nom}` }}</span> </h1>
        </div>
        <div class="annonces-section">
          <div class="container">
              <div class="form-section">
 
                <form @submit.prevent class="login-box">
                    <input type="text"
                           class="name ele"
                           placeholder="Titre *" v-model="newAnnonce.titre">
                    <input type="text"
                           class="name ele"
                           placeholder="Lieu *" v-model="newAnnonce.lieu">
                    <input v-maska data-maska="##/##/####" type="text"
                           class="name ele"
                           placeholder="Date de début *" v-model="newAnnonce.date_debut">
                    <input v-maska data-maska="##/##/####" type="text"
                           class="name ele"
                           placeholder="Date de fin" v-model="newAnnonce.date_fin">
                    <input type="text"
                           class="name ele"
                           placeholder="Nom du poste *" v-model="newAnnonce.poste">
                    <input type="text"
                           class="name ele"
                           placeholder="Salaire *" v-model="newAnnonce.salaire">
                    <textarea name="description_poste ele" cols="34" rows="70" placeholder="Description du poste *" v-model="newAnnonce.description_poste"></textarea>
                    <button ref="annonceButton" type="submit" class="clkbtn">test</button>
                </form>
              </div> 
          </div>
          <!-- <div class="red"></div> -->
          <div>
              <div v-if="annoncesData" class="box">
                  <h2>Mes annonces</h2>
                  <ul v-for="annonce in annoncesData" :key="annonce.annonce_id">
                    <li><nuxt-link :to="'annonce/'+ annonce.annonce_id">{{ `${annonce.poste}` }}</nuxt-link> le {{ `${annonce.date_creation}` }}               <nuxt-link :to="'candidatures/'+ annonce.annonce_id">candidatures</nuxt-link>                <button @click="deleteAnnonce(annonce.annonce_id)" >Annuler</button></li>
                  </ul>
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
const authStore = useAuthStore();
const userId = authStore.getId;
const employeursData = ref(null);
const annonceButton = ref(null);
const annoncesData = ref(null);
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
} else {
    onBeforeMount(async()=>{
      await Promise.all([hydrateUser(), mesAnnonces()]);
    })
}

const hydrateUser = async () => {
  try  {
        const response = await axios.get(`http://localhost:3001/api/v1/employeurs/${userId}`);
        employeursData.value = response.data.data[0];
        console.log(response.data.data[0]);
        console.log(employeursData.value);
  } catch(err) {
      console.log(err)
  }
}

const mesAnnonces = async () => {
    try {
        const response = await axios.post('http://localhost:3001/api/v1/employeurs/mesAnnonces', {
            id_employeur: userId
        });

        annoncesData.value = response.data.data;
        formatAnnoncesDates(annoncesData.value)

        console.log('Formatted Data:', annoncesData.value);
    } catch (err) {
        console.log(err);
    }
};

const deleteAnnonce = async (annonceId) => {
    try {
                const response = await axios.post('http://localhost:3001/api/v1/employeurs/deleteAnnonce', {
                    id_annonce: annonceId,
                    id_employeur: userId
                });
                console.log('Status Code:', response.status);
                console.log('Response Data:', response.data);
                console.log('Vous avez bien supprimé votre annonce');
                window.location.href = `/employeur`
            } catch (err) {
                console.log(err);
            }
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

const formatAnnoncesDates = (annoncesData) => {
    if (Array.isArray(annoncesData)) {
        for (const annonce of annoncesData) {
            if (annonce.date_creation) {
                annonce.date_creation = formatterDateSQL(annonce.date_creation);
            }
        }
    }
};


function showError(message) {
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';

  setTimeout(() => {
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
  }, 5000);
}

function showNotif(message) {
  const notifMessage = document.getElementById('notif-message');
  notifMessage.textContent = message;
  notifMessage.style.display = 'block';

  setTimeout(() => {
    notifMessage.style.display = 'none';
    notifMessage.textContent = '';
  }, 5000);
}

onMounted(() => {
  const createAnnonce = annonceButton.value;
  createAnnonce.addEventListener('click', async ()=>{
    console.log(newAnnonce.value);
  
    if (
      !newAnnonce.value.titre ||
      !newAnnonce.value.lieu ||
      !newAnnonce.value.date_debut ||
      !newAnnonce.value.poste ||
      !newAnnonce.value.salaire ||
      !newAnnonce.value.description_poste
    ) {
      showError("Veuillez remplir 'tous' les champs obligatoires (*).");
    }else {
      try {
        const date_debut = convertDateFormat(newAnnonce.value.date_debut);
        if(newAnnonce.value.date_fin.length > 0){
          newAnnonce.value.date_fin = convertDateFormat(newAnnonce.value.date_fin);
        }
        const response = await axios.post('http://localhost:3001/api/v1/annonces', {
          titre: newAnnonce.value.titre,
          lieu: newAnnonce.value.lieu,
          date_debut: date_debut,
          poste: newAnnonce.value.poste,
          salaire: newAnnonce.value.salaire,
          description_poste: newAnnonce.value.description_poste,
          date_fin: newAnnonce.value.date_fin,
          id_employeur: userId
        });

        console.log('Status Code:', response.status);
        console.log('Response Data:', response.data);

        newAnnonce.value = {};
        window.location.href = `/employeur`
      } catch (err) {
        console.log(err);
      }
  } 
   });
  
})


</script>
<style scoped>

.box {
    width: 550px;
    border-bottom: 20px solid #03a9f4;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    margin: 75px 0 0 53px;
  }
  .box h2 {
    color: #fff;
    background: #03a9f4;
    padding: 10px 20px;
    font-size: 20px;
    font-weight: 700;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .box ul {
    position: relative;
    background: #fff;
  }
  .box ul:hover li {
    opacity: 0.2;
  }
  .box ul li {
    list-style: none;
    padding: 10px;
    background: #fff;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
    transition: transform 0.5s;
    text-align: left;
  }
  .box ul li:hover {
    transform: scale(1.1);
    z-index: 5;
    background: #25bcff;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
    color: #fff;
    opacity: 1;
  }
  .box ul li span {
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    background: #25bcff;
    color: #fff;
    display: inline-block;
    border-radius: 50%;
    margin-right: 10px;
    font-size: 12px;
    font-weight: 600;
    transform: translateY(-2px);
  }
  .box ul li:hover span {
    background: #fff;
    color: #25bcff;
  }
  .annonces-section{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 13px;
  }
  .user-profile {
    text-align: center;
  }

  .red{
    width: 50%;
    height: 200px;
    background-color: Red;
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

  .notif-message {
    position: fixed;
    top: 120px;
    width: 300px;
    z-index: 2;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgb(78, 167, 255);
    color: white;
    padding: 6px;
    display: none;
    border-radius: 6px;
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

  .blockA{
    background-color: white;
    width: auto;
    height: auto;
    margin: auto;
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
  
  .profile-picture img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
  }
  
  .dashboard {
    display: flex;
    flex-direction: row;
    background-color: gray;
    width: 100%;
    height: 20rem;
    margin-top: 2rem;
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
 
    .title {
        font-size: 15px;
    }
 
    .btn {
        height: 50px;
        width: 200px;
        margin: 20px auto;
    }
 
    .login{
        font-size: 16px;
    }
 
    .slider {
        height: 50px;
        width: 100px;
        left: 50px;
    }
 
    .moveslider {
        left: 150px;
    }
 
    .form-section {
        height: 500px;
        width: 600px;
        padding: 38px 0;
    }
 
    .form-section-move {
        left: -300px;
    }
 
    .login-box{
        height: 100%;
        width: 222px;
        padding-top: 0;
        gap: 29px;
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
 
    .heading {
        font-size: 30px;
    }
 
    .title {
        font-size: 10px;
    }
 
    .btn {
        height: 50px;
        width: 200px;
        margin: 20px auto;
    }
 
    .login{
        font-size: 16px;
    }
 
    .slider {
        height: 50px;
        width: 100px;
        left: 25px;
    }
 
    .moveslider {
        left: 127px;
    }
 
    .form-section {
        height: 500px;
        width: 500px;
    }
 
    .form-section-move {
        left: -250px;
        padding: 38px 0;
    }
 
    .login-box{
        height: 100%;
        width: 170px;
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