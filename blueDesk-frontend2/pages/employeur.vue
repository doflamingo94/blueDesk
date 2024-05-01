<template>
  <div class="page-content">
        <div id="error-message" class="error-message"></div>
        <div id="notif-message" class="notif-message"></div>
        <div v-if="employeursData" class="user-profile">
            <div v-if="!employeursData.url_banniere" class="banner">
              <img src="../assets/images/background-original.jpg" alt="Banner Image" />
            </div>

            <div v-else class="banner">
              <p>heloooooooo</p>
            </div> 
            
            <div v-if="!employeursData.url_logo" class="profile-picture">
              <img src="../assets/images/background-pexels-mo-eid-11592804.jpg" alt="Profile Picture" />
            <CldUploadWidget
              v-slot="{ open }"
              uploadPreset="employeur-logo"
              :options="{ clientAllowedFormats: ['png', 'jpeg'], maxFiles: 1 }"
              @upload="handleSuccess"
            >
                <p @click="open" class="overlay-text">Ajouter un logo</p>
            </CldUploadWidget>
            </div>
            
            <div v-else class="profile-picture">
              <CldImage :src="employeursData.url_logo" @click="visible = true" />
            </div>

            <Dialog v-model:visible="visible" modal :style="{ width: '25rem' }">
              <CldImage :src="employeursData.url_logo" />
              <CldUploadWidget
              v-slot="{ open }"
              uploadPreset="employeur-logo"
              :options="{ clientAllowedFormats: ['png', 'jpeg'], maxFiles: 1 }"
              @upload="modifLogo"
              >
                <Button label="modifier" @click="open"/>
              </CldUploadWidget>
            </Dialog>
            
            <h1><span>{{ `${employeursData.nom}` }}</span> </h1>
        </div>

        <div v-if="employeursData" class="employer-profile">
          <h2 class="profile-heading">Mon Profil</h2>
          <div class="profile-info">
            <div class="row">
              <div class="col-sm-4">
                <strong>Ville:  </strong> <Icon v-if="employeursData.ville" name="heroicons-solid:pencil-square" @click="villeModal = true" class="modif-icon" aria-label="RRRRRR" />
              </div>
              <div v-if="employeursData.ville" class="col-sm-8">
                <span>{{ `${employeursData.ville}` }}</span> 
              </div>
              <div v-else class="col-sm-8">
                <span> <Button class="yooooo" label="Renseigner" @click="villeModal = true"/> </span>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-4">
                <strong>Secteur d'activité:  </strong> <Icon v-if="employeursData.secteur" name="heroicons-solid:pencil-square" class="modif-icon" @click="secteurModal = true" />
              </div>
              <div v-if="employeursData.secteur" class="col-sm-8">
                <span>{{ `${employeursData.secteur}` }}</span>
              </div>
              <div v-else class="col-sm-8">
                <span><Button class="yooooo" label="Renseigner" @click="secteurModal = true"/></span>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-4">
                <strong>Description:  </strong> <Icon v-if="employeursData.description" name="heroicons-solid:pencil-square" class="modif-icon" @click="descriptionModal = true" /> 
              </div>
              <div v-if="employeursData.description" class="col-sm-8">
                <p v-dompurify-html="employeursData.description"></p>
              </div>
              <div v-else class="col-sm-8">
                <span><Button class="yooooo" label="Renseigner" @click="descriptionModal = true" /></span>
              </div>
            </div>
          </div>
        </div>
        <Dialog v-model:visible="villeModal" modal :style="{ width: '100%', height: 'auto', padding: '12px' }">
            <div class="wrapper">
              <div class="title-text">
                <div class="title" :style="{marginLeft: loginMargin}">Renseigner votre ville</div>
              </div>
              <div class="form-container">
                <div class="form-inner">
                  <form @submit.prevent class="login" :style="{marginLeft: loginFormMargin}">
                    <div class="field">
                      <input type="text"
                           placeholder="Nom de la Ville *" v-model="ville">
                    </div>
                    <div class="field btn">
                      <div class="btn-layer"></div>
                      <button ref="annonceButton" @click="insertVille" type="submit" class="clkbtn">Renseigner</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Dialog>

          <Dialog v-model:visible="secteurModal" modal :style="{ width: '100%', height: 'auto', padding: '12px' }">
            <div class="wrapper">
              <div class="title-text">
                <div class="title" :style="{marginLeft: loginMargin}">Renseigner votre ville</div>
              </div>
              <div class="form-container">
                <div class="form-inner">
                  <form @submit.prevent class="login" :style="{marginLeft: loginFormMargin}">
                    <div class="field">
                      <input type="text"
                           placeholder="Nom du secteur d'activité *" v-model="secteur">
                    </div>
                    <div class="field btn">
                      <div class="btn-layer"></div>
                      <button ref="annonceButton" @click="insertSecteur" type="submit" class="clkbtn">Renseigner</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Dialog>

          <Dialog v-model:visible="descriptionModal" modal :style="{ width: '100%', height: 'auto', padding: '12px' }">
            <div class="wrapper">
              <div class="title-text">
                <div class="title" :style="{marginLeft: loginMargin}">Renseigner une description de votre business</div>
              </div>
              <div class="form-container">
                <div class="form-inner">
                  <form @submit.prevent class="login" :style="{marginLeft: loginFormMargin}">
                    <div class="editor-container">
                      <Editor v-model="description" editorStyle="min-height: 320px" />
                    </div>
                    <div class="field btn">
                      <div class="btn-layer"></div>
                      <button ref="annonceButton" @click="insertDescription" type="submit" class="clkbtn">Renseigner</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Dialog>
        
        <div class="annonces-section">
          <!-- <Button label="Poster une annonce" @click="postAnnonceModal = true"/> -->
          <Dialog v-model:visible="postAnnonceModal" modal :style="{ width: '100%', height: '90vh' }">
            <div class="wrapper">
              <div class="title-text">
                <div class="title" :style="{marginLeft: loginMargin}">Rédiger votre annonce</div>
              </div>
              <div class="form-container">
                <div class="form-inner">
                  <form @submit.prevent class="login" :style="{marginLeft: loginFormMargin}">
                    <div class="field">
                      <input type="text"
                           placeholder="Titre *" v-model="newAnnonce.titre">
                    </div>
                    <div class="field">
                      <input type="text"
                           placeholder="Lieu *" v-model="newAnnonce.lieu">
                    </div>
                    <div class="field">
                      <input v-maska data-maska="##/##/####" type="text"
                           placeholder="Date de début *" v-model="newAnnonce.date_debut">
                    </div>
                    <div class="field">
                      <input v-maska data-maska="##/##/####" type="text"
                           placeholder="Date de fin" v-model="newAnnonce.date_fin">
                    </div>
                    <div class="field">
                      <input type="text"
                           placeholder="Nom du poste *" v-model="newAnnonce.poste">
                    </div>
                    <div class="field">
                      <input type="text"
                           placeholder="Salaire *" v-model="newAnnonce.salaire">
                    </div>
                    <div class="editor-container">
                      <Editor v-model="newAnnonce.description_poste" editorStyle="min-height: 320px" />
                    </div>
                    <div class="field btn">
                      <div class="btn-layer"></div>
                      <button ref="annonceButton" @click="publish" type="submit" class="clkbtn">publier</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Dialog>
          <!-- <div class="red"></div> -->
          <div>
              <!-- <div v-if="annoncesData" class="box">
                  <h2>Mes annonces</h2>
                  <ul v-if="annonces.length > 0" v-for="annonce in paginatedAnnonces" :key="annonce.annonce_id">
                    <li><nuxt-link :to="'annonce/'+ annonce.annonce_id">{{ `${annonce.poste}` }}</nuxt-link> le {{ `${annonce.date_creation}` }}               <nuxt-link :to="'candidatures/'+ annonce.annonce_id">candidatures</nuxt-link>                <button @click="deleteAnnonce(annonce.annonce_id)" >Annuler</button></li>
                  </ul>
                  <p v-else>Vous n'avez pas encore posté d'annonces</p>
                  <Paginator
                  v-if="annoncesData"
                  v-model:first="first"
                  :rows="10"
                  :totalRecords="annonces.length"
                  />
              </div> -->
              <table v-if="annoncesData">
                <caption>Mes annonces</caption>
                <thead>
                  <tr>
                    <th scope="col" v-for="header in headers" :key="header">{{ header }}</th>
                  </tr>
                </thead>
                <tbody v-if="annonces.length > 0" v-for="annonce in paginatedAnnonces" :key="annonce.annonce_id">
                  <tr>
                    <td><span class="only-small-mobile">Poste</span> <nuxt-link :to="'annonce/'+ annonce.annonce_id">{{ `${annonce.poste}` }}</nuxt-link> </td>
                    <td><span class="only-small-mobile">Date de publication</span> {{ `${annonce.date_creation}` }}</td>
                    <td><span class="only-small-mobile">Candidatures</span> <nuxt-link :to="'candidatures/'+ annonce.annonce_id">candidatures</nuxt-link></td>
                    <td><span class="only-small-mobile">Cloturer</span> <Button @click="deleteAnnonce(annonce.annonce_id)" >Annuler</button></td>
                  </tr>
                </tbody>
              </table>
              <Paginator
                  v-if="annoncesData"
                  v-model:first="first"
                  :rows="10"
                  :totalRecords="annonces.length"
                  />
          </div>
          <Button class="yooooo" label="Poster une annonce" @click="postAnnonceModal = true"/>
        </div>
  </div>
        
</template>
<script setup>
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ref } from 'vue';
import { vMaska } from 'maska';
import Dialog from 'primevue/dialog'
import Editor from 'primevue/editor';
import VueDOMPurifyHTML from 'vue-dompurify-html';

const headers = ['Poste', 'Date de publication', 'Candidatures', 'Cloturer'];

const visible = ref(false);
const postAnnonceModal = ref(false);
const villeModal = ref(false);
const ville = ref(null);
const secteurModal = ref(false);
const secteur = ref(null);
const descriptionModal = ref(false);
const description = ref(null);
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
const annonces = ref([]);
const first = ref(0);
const config = useRuntimeConfig();

const handleSuccess = async (data, extra) => {
    const publicId = data._rawValue.info.public_id;
    try {
          const response = await axios.post(`${config.public.backend}/api/v1/employeurs/logo`, {
          url_logo: publicId,
          id: userId
      });
      window.location.href = `/employeur`
    } catch (err) {
        console.log(err);
    }
}

const modifLogo = async (data, extra) => {
 const oldPublicId = employeursData.value.url_logo;
 const newPublicId = data._rawValue.info.public_id;
            try {
                const firstResponse = await axios.post(`${config.public.backend}/api/v1/employeurs/logo`, {
                    url_logo: newPublicId,
                    id: userId
                });
                const secondResponse = await axios.post(`${config.public.backend}/api/v1/cloudinary/deleteFile`, {
                    publicId: oldPublicId
                });
                window.location.href = `/employeur`
            } catch (e) {
                console.log(e);
            }
}

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
        const response = await axios.get(`${config.public.backend}/api/v1/employeurs/${userId}`);
        employeursData.value = response.data.data[0];
        console.log(response.data.data[0]);
        console.log(employeursData.value);
  } catch(err) {
      console.log(err)
  }
}

const mesAnnonces = async () => {
    try {
        const response = await axios.post(`${config.public.backend}/api/v1/employeurs/mesAnnonces`, {
            id_employeur: userId
        });

        annoncesData.value = response.data.data;
        annonces.value = annoncesData.value;
        formatAnnoncesDates(annoncesData.value)

        console.log('Formatted Data:', annoncesData.value);
    } catch (err) {
        console.log(err);
    }
};

const paginatedAnnonces = computed(() => {
        const startIndex = first.value;
        const endIndex = startIndex + 5; // Change 15 to the number of jobs per page
        return annonces.value.slice(startIndex, endIndex);
    });

const deleteAnnonce = async (annonceId) => {
    try {
                const response = await axios.post(`${config.public.backend}/api/v1/employeurs/deleteAnnonce`, {
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

const publish = async () => {
  postAnnonceModal.value = false;
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
        const response = await axios.post(`${config.public.backend}/api/v1/annonces`, {
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
}

const insertVille = async () => {
  villeModal.value = false;
  if (
      !ville.value
    ) {
      showError("Veuillez renseigner une ville");
    } else if (ville.value.length < 3) {
      showError("Renseigner une ville d'au moins 3 lettres");
    } else {
      try {
        const response = await axios.post(`${config.public.backend}/api/v1/employeurs/ville`, {
          ville: ville.value,
          id: userId
        });

        console.log('Status Code:', response.status);
        console.log('Response Data:', response.data);

        // newAnnonce.value = {};
        window.location.href = `/employeur`
      } catch (err) {
        console.log(err);
      }
  }
}

const insertSecteur = async () => {
  secteurModal.value = false;
  if (
      !secteur.value
    ) {
      showError("Veuillez renseigner un Secteur d'activité");
    } else if (secteur.value.length < 3) {
      showError("Minimum 3 lettres");
    } else {
      try {
        const response = await axios.post(`${config.public.backend}/api/v1/employeurs/secteur`, {
          secteur: secteur.value,
          id: userId
        });

        console.log('Status Code:', response.status);
        console.log('Response Data:', response.data);

        // newAnnonce.value = {};
        window.location.href = `/employeur`
      } catch (err) {
        console.log(err);
      }
  }
}

const insertDescription = async () => {
  descriptionModal.value = false;
  if (
      !description.value
    ) {
      showError("Veuillez renseigner une description");
    } else {
      try {
        const response = await axios.post(`${config.public.backend}/api/v1/employeurs/description`, {
          description: description.value,
          id: userId
        });

        console.log('Status Code:', response.status);
        console.log('Response Data:', response.data);

        // newAnnonce.value = {};
        window.location.href = `/employeur`
      } catch (err) {
        console.log(err);
      }
  }
}

// onMounted(() => {
//   if(annonceButton.value){
//     const createAnnonce = annonceButton.value;
//     createAnnonce.addEventListener('click', async ()=>{
//     console.log(newAnnonce.value);
  
//     if (
//       !newAnnonce.value.titre ||
//       !newAnnonce.value.lieu ||
//       !newAnnonce.value.date_debut ||
//       !newAnnonce.value.poste ||
//       !newAnnonce.value.salaire ||
//       !newAnnonce.value.description_poste
//     ) {
//       showError("Veuillez remplir 'tous' les champs obligatoires (*).");
//     }else {
//       try {
//         const date_debut = convertDateFormat(newAnnonce.value.date_debut);
//         if(newAnnonce.value.date_fin.length > 0){
//           newAnnonce.value.date_fin = convertDateFormat(newAnnonce.value.date_fin);
//         }
//         const response = await axios.post(`${config.public.backend}/api/v1/annonces`, {
//           titre: newAnnonce.value.titre,
//           lieu: newAnnonce.value.lieu,
//           date_debut: date_debut,
//           poste: newAnnonce.value.poste,
//           salaire: newAnnonce.value.salaire,
//           description_poste: newAnnonce.value.description_poste,
//           date_fin: newAnnonce.value.date_fin,
//           id_employeur: userId
//         });

//         console.log('Status Code:', response.status);
//         console.log('Response Data:', response.data);

//         newAnnonce.value = {};
//         window.location.href = `/employeur`
//       } catch (err) {
//         console.log(err);
//       }
//   } 
//    });
//   }
  
  
// })


</script>
<style scoped>
:deep(.p-paginator) {
    background-color: transparent;
    justify-content: center;
    margin-bottom: 5px;
}
.modif-icon:hover {
  color: blue;
  cursor: pointer;
}
:deep(.p-button){
      background-color: #03a9f4;
    }
.only-small-mobile {
  display: none;
}
.box {
    width: auto;
    border-bottom: 20px solid #03a9f4;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    margin-bottom: 20px;
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
    flex-direction: column;
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
    top: 11rem;
    left: 13%;
    transform: translateX(-50%);
    border-radius: 50%;
    border: 4px solid #fff; 
    overflow: hidden;
    width: 150px; 
    height: 150px;
    cursor: pointer;
  }

  .overlay-text {
  position: absolute;
  top: 50%; /* Adjust as per your requirement */
  left: 50%; /* Adjust as per your requirement */
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);
  background-color: rgba(60, 60, 60, 0.448); /* Adjust background color and opacity */
  width: 150px; 
    height: 150px;
  padding: 10px;
  border-radius: 50%;
  font-size: 16px;
  color: white;
  transition: 0.7s ease-in-out;
}

.overlay-text:hover {
  font-size: 19px;
  color: #25bcff;
  background-color: rgba(255, 255, 255, 0.834);
  cursor: pointer;
}

  .blockA{
    background-color: white;
    width: auto;
    height: auto;
    margin: auto;
  }

  .container {
    display: none;
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

  @media (max-width:1086px) and (min-width:769px) {
    .box {
      width: auto;
    }
  }

  @media (max-width:768px) and (min-width:500px) {
    /* .box {
      width: 420px;
      margin: 45px 0 0 0 !important;
    } */
  }

  @media (max-width:499px) and (min-width:350px) {
    /* .box {
      width: 450px !important; 
      margin: 35px 0 0 0 !important;
    } */
  }

  @media (max-width:349px) and (min-width:150px) {
    /* .box {
      width: 250px !important; 
      margin: 25px 0 0 0 !important;
    } */
  }

  @media screen and (max-width: 770px) {
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
      .annonces-section{
        flex-direction: column;
        align-items: center;
        width: auto;
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
::selection{
  background: #34a7d3;
  color: #fff;
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
    display: none; /* Initially hidden */
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
    display: none; /* Initially hidden */
    border-radius: 6px;
  }
  .editor-container {
    margin-top: 20px;
  }
  table {
    border: 1px solid #ccc;
    border-collapse: collapse;
    /* margin-bottom: 20px; */
    padding: 0;
    width: 100%;
    table-layout: fixed;
  }
  
  table caption {
    font-size: 1.5em;
    margin: .5em 0 .75em;
  }
  
  table tr {
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    padding: .35em;
  }
  
  table th,
  table td {
    padding: .625em;
    text-align: center;
  }
  
  table th {
    font-size: .85em;
    letter-spacing: .1em;
    text-transform: uppercase;
  }
  
  @media screen and (max-width: 600px) {
    table {
      border: 0;
      margin: 0;
    }

    .only-small-mobile {
      display: inline;
      position: absolute;
      left: 20px;
    }
  
    table caption {
      font-size: 1.3em;
    }
    
    table thead {
      border: none;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }
    
    table tr {
      border-bottom: 3px solid #ddd;
      display: block;
      margin-bottom: .625em;
    }
    
    table td {
      border-bottom: 1px solid #ddd;
      display: block;
      font-size: .8em;
      text-align: right;
    }
    
    table td::before {
      content: attr(data-label);
      float: left;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    table td:last-child {
      border-bottom: 0;
    }
  }

  .employer-profile {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  margin: 0 13px;
  margin-bottom: 20px;
  margin-top: 45px;
}

.profile-heading {
  font-size: 24px;
  margin-top: 0;
  margin-bottom: 20px;
}

.profile-info .row {
  margin-bottom: 10px;
}

.profile-info strong {
  font-weight: bold;
}

.profile-info span {
  display: inline-block;
  width: 100%;
}

.profile-info p {
  margin-top: 0;
}
</style>