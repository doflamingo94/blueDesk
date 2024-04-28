<template>
  <div class="page-content">
    <div id="error-message" class="error-message"></div>
    <div id="notif-message" class="notif-message"></div>
    <div v-if="candidatData" class="user-profile">
        <div class="banner">
            <img src="../assets/images/background-original.jpg" alt="Banner Image" />
        </div>

          <div v-if="!candidatData.url_pp" class="profile-picture">
              <img src="../assets/images/background-pexels-mo-eid-11592804.jpg" alt="Profile Picture" />
            <CldUploadWidget
              v-slot="{ open }"
              uploadPreset="candidat-pp"
              :options="{ clientAllowedFormats: ['png', 'jpeg'], maxFiles: 1 }"
              @upload="handleSuccess"
            >
                <p @click="open" class="overlay-text">Ajouter une photo</p>
            </CldUploadWidget>
          </div>
            
          <div v-else class="profile-picture">
            <CldImage :src="candidatData.url_pp" @click="visible = true" />
          </div>

            <Dialog v-model:visible="visible" modal :style="{ width: '25rem' }">
              <CldImage :src="candidatData.url_pp" />
              <CldUploadWidget
              v-slot="{ open }"
              uploadPreset="candidat-pp"
              :options="{ clientAllowedFormats: ['png', 'jpeg'], maxFiles: 1 }"
              @upload="modifLogo"
              >
                <Button label="modifier" @click="open"/>
              </CldUploadWidget>
            </Dialog>

            <div class="container">
              <div class="row">
                <div class="col-md-4">
                  <!-- <img class="profile-img" src="../assets/images/briefcase1.png" alt="Profile Picture">  -->
                  <h2 class="mt-3 text-center">{{ `${candidatData.prenom}` }} {{ `${candidatData.nom}` }}</h2>
                  <p class="text-muted text-center" v-if="candidatData.profession">{{ `${candidatData.profession}` }}</p>
                  <Button v-else label="Rajouter une profession" @click="professionModal = true" />
                </div>
                <div class="col-md-8">
                    <div class="card mb-3">
                    <div class="card-header">
                      <h3>Description</h3>
                    </div>
                    <p v-if="candidatData.description" v-dompurify-html="candidatData.description" class="text-muted"/>
                    <div v-else>
                      <Button label="Rajouter une description" @click="descriptionModal = true"/>
                    </div>
                  </div>
                  <div class="card mb-3">
                    <div class="card-header">
                      <h3>Professional Experience</h3>
                    </div>
                    <ul v-if="experienceData" class="list-group list-group-flush" v-for="experience in experienceData" :key="experience.id">
                      <li class="list-group-item">
                        <h5>{{ `${experience.employeur}` }} - {{ `${experience.poste}` }}</h5>
                        <p class="mb-0">du {{ `${experience.date_debut}` }} au <span v-if="experience.date_fin">{{ `${experience.date_fin}` }}</span></p>
                        <!-- <p class="text-muted">{{ experience.description }}</p> -->
                      </li>
                    </ul>
                    <Button label="Ajouter une experience" @click="experienceModal = true" />
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
                    <Button label="Ajouter une formation" @click="formationModal = true" />
                  </div>
                </div>
              </div>
            </div>

            <Dialog v-model:visible="professionModal" modal :style="{ width: '100%', height: 'auto', padding: '12px' }">
            <div class="wrapper">
              <div class="title-text">
                <div class="title" :style="{marginLeft: loginMargin}">Renseigner votre profession</div>
              </div>
              <div class="form-container">
                <div class="form-inner">
                  <form @submit.prevent class="login" :style="{marginLeft: loginFormMargin}">
                    <div class="field">
                      <input type="text"
                           placeholder="Nom de votre profession *" v-model="profession">
                    </div>
                    <div class="field btn">
                      <div class="btn-layer"></div>
                      <button @click="insertProfession" type="submit" class="clkbtn">Renseigner</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Dialog>

          <Dialog v-model:visible="descriptionModal" modal :style="{ width: '100%', height: 'auto', padding: '12px' }">
            <div class="wrapper">
              <div class="title-text">
                <div class="title" :style="{marginLeft: loginMargin}">Décriver vous, vos compétences, vos interets, etc..</div>
              </div>
              <div class="form-container">
                <div class="form-inner">
                  <form @submit.prevent class="login" :style="{marginLeft: loginFormMargin}">
                    <div class="editor-container">
                      <Editor v-model="description" editorStyle="min-height: 320px" />
                    </div>
                    <div class="field btn">
                      <div class="btn-layer"></div>
                      <button @click="insertDescription" type="submit" class="clkbtn">Renseigner</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Dialog>

          <Dialog v-model:visible="experienceModal" modal :style="{ width: '100%', height: '90vh' }">
            <div class="wrapper">
              <div class="title-text">
                <div class="title" :style="{marginLeft: loginMargin}">Renseignez une experience professionnelle</div>
              </div>
              <div class="form-container">
                <div class="form-inner">
                  <form @submit.prevent class="login" :style="{marginLeft: loginFormMargin}">
                    <div class="field">
                      <input type="text"
                           placeholder="employeur *" v-model="experience.employeur">
                    </div>
                    <div class="field">
                      <input v-maska data-maska="##/##/####" type="text"
                           placeholder="Date de début *" v-model="experience.date_debut">
                    </div>
                    <div class="field">
                      <input v-maska data-maska="##/##/####" type="text"
                           placeholder="Date de fin" v-model="experience.date_fin">
                    </div>
                    <div class="field">
                      <input type="text"
                           placeholder="Nom du poste *" v-model="experience.poste">
                    </div>
                    <div class="field btn">
                      <div class="btn-layer"></div>
                      <button @click="insertExperience" type="submit" class="clkbtn">renseigner</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Dialog>

          <Dialog v-model:visible="formationModal" modal :style="{ width: '100%', height: '90vh' }">
            <div class="wrapper">
              <div class="title-text">
                <div class="title" :style="{marginLeft: loginMargin}">Renseignez une formation</div>
              </div>
              <div class="form-container">
                <div class="form-inner">
                  <form @submit.prevent class="login" :style="{marginLeft: loginFormMargin}">
                    <div class="field">
                      <input type="text"
                           placeholder="ecole *" v-model="formation.ecole">
                    </div>
                    <div class="field">
                      <input v-maska data-maska="##/##/####" type="text"
                           placeholder="Date de début *" v-model="formation.date_debut">
                    </div>
                    <div class="field">
                      <input v-maska data-maska="##/##/####" type="text"
                           placeholder="Date de fin" v-model="formation.date_fin">
                    </div>
                    <div class="field">
                      <input type="text"
                           placeholder="Nom de la formation *" v-model="formation.nom">
                    </div>
                    <div class="field btn">
                      <div class="btn-layer"></div>
                      <button @click="insertFormartion" type="submit" class="clkbtn">renseigner</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Dialog>

        <!-- <h1><span >{{ `${candidatData.prenom}` }} {{ `${candidatData.nom}` }}</span> </h1> -->
        <!-- <div class="box-container">
            <div v-if="candidaturesData" class="box">
                <h2>Mes candidatures</h2>
                <ul v-for="candidature in candidaturesData" :key="candidature.date_candidature">
                  <li><nuxt-link :to="'annonce/'+ candidature.id_annonce">{{ `${candidature.poste}` }} chez {{ `${candidature.employeur_nom}` }}</nuxt-link> le {{ `${candidature.date_candidature}` }}  STATUT : {{ `${candidature.statut}` }}  <button v-if="candidature.statut != 'refusé' && candidature.statut != 'retenue'" @click="deleteCandidature(candidature.id_annonce)" >Annuler</button></li>
                </ul>
            </div>
        </div> -->
        <table v-if="candidaturesData">
          <caption>Mes candidatures</caption>
          <thead>
            <tr>
              <th scope="col" v-for="header in headers" :key="header">{{ header }}</th>
            </tr>
          </thead>
          <tbody v-if="candidaturesTable.length > 0" v-for="candidature in paginatedCandidatures" :key="candidature.id_annonce">
            <tr v-if="candidature.statut === 'retenue'" class="retenue">
              <td class="poste-style"><span class="only-small-mobile">Poste</span> <nuxt-link :to="'annonce/'+ candidature.id_annonce">{{ `${candidature.poste}` }}</nuxt-link> </td>
              <td><span class="only-small-mobile">Employeur</span> {{ `${candidature.employeur_nom}` }}</td>
              <td><span class="only-small-mobile">Date de candidatures</span>{{ `${candidature.date_candidature}` }}</td>
              <td><span class="only-small-mobile">Statut</span>{{ `${candidature.statut}` }}</td>
            </tr>
            <tr v-else-if="candidature.statut === 'refusé'" class="refuse">
              <td class="poste-style"><span class="only-small-mobile">Poste</span> <nuxt-link :to="'annonce/'+ candidature.id_annonce">{{ `${candidature.poste}` }}</nuxt-link> </td>
              <td><span class="only-small-mobile">Employeur</span> {{ `${candidature.employeur_nom}` }}</td>
              <td><span class="only-small-mobile">Date de candidatures</span>{{ `${candidature.date_candidature}` }}</td>
              <td><span class="only-small-mobile">Statut</span>{{ `${candidature.statut}` }}</td>
            </tr>
            <tr v-else>
              <td class="poste-style"><span class="only-small-mobile">Poste</span> <nuxt-link :to="'annonce/'+ candidature.id_annonce">{{ `${candidature.poste}` }}</nuxt-link> </td>
              <td><span class="only-small-mobile">Employeur</span> {{ `${candidature.employeur_nom}` }}</td>
              <td><span class="only-small-mobile">Date de candidatures</span>{{ `${candidature.date_candidature}` }}</td>
              <td><span class="only-small-mobile">Statut</span>{{ `${candidature.statut}` }}</td>
              <td><span class="only-small-mobile">Annulation</span> <Button v-if="candidature.statut != 'refusé' && candidature.statut != 'retenue'" @click="deleteCandidature(candidature.id_annonce)" >Annuler</button></td>
            </tr>
          </tbody>
        </table>
        <Paginator
            v-if="candidaturesData"
            v-model:first="first"
            :rows="5"
            :totalRecords="candidaturesTable.length"
        />
    </div>
</div>
    
</template>
<script setup>
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ref } from 'vue';
import Editor from 'primevue/editor';
import VueDOMPurifyHTML from 'vue-dompurify-html';


const visible = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const userId = authStore.getId;
const candidatData = ref(null);
const candidaturesData = ref(null);
const config = useRuntimeConfig();
const headers = ['Poste', 'Employeur', 'Date de candidature', 'Statut', 'Annulation'];
const candidaturesTable = ref([]);
const first = ref(0);
const experienceData = ref(null);
const formationData = ref(null);
const professionModal = ref(false);
const profession = ref(null);
const descriptionModal = ref(false);
const description = ref(null);
const experienceModal = ref(false);
const experience = ref({
  poste: '',
  employeur: '',
  date_debut: '',
  date_fin: ''
});
const formationModal = ref(false);
const formation = ref({
  nom: '',
  ecole: '',
  date_debut: '',
  date_fin: ''
});


console.log(userId)

if (!authStore.isLoggedIn) {
  router.push({ path: '/' })
} else {
  onBeforeMount(async () => {
    await Promise.all([hydrateUser(), candidatures(), hydrateExperiences(), hydrateFormations()]);
  })
}

const hydrateUser = async () => {
  try {
    const response = await axios.get(`${config.public.backend}/api/v1/candidats/${userId}`);
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
          id_candidat: userId
        });
    experienceData.value = response.data.data;
    formatExperiences(experienceData.value)
    console.log(response.data.data);
    console.log(experienceData.value);
  } catch (err) {
    console.log(err)
  }
}

const hydrateFormations = async () => {
  try {
    const response = await axios.post(`${config.public.backend}/api/v1/candidats/formations`, {
          id_candidat: userId
        });
    formationData.value = response.data.data;
    formatExperiences(formationData.value);
    console.log(response.data.data[0]);
    console.log(formationData.value);
  } catch (err) {
    console.log(err)
  }
}

const candidatures = async () => {
  try {
    const response = await axios.post(`${config.public.backend}/api/v1/candidats/candidatures`, {
      id_candidat: userId
    });
    
    candidaturesData.value = response.data.data;
    candidaturesTable.value = candidaturesData.value;
    
    formatCandidatureDates(candidaturesData.value);
    
    console.log('Formatted Data:', candidaturesData.value);
  } catch (err) {
    console.log(err);
  }
};

const paginatedCandidatures = computed(() => {
        const startIndex = first.value;
        const endIndex = startIndex + 5; // Change 15 to the number of jobs per page
        return candidaturesTable.value.slice(startIndex, endIndex);
    });

const deleteCandidature = async (annonceId) => {
    try {
                const response = await axios.post(`${config.public.backend}/api/v1/candidats/deleteCandidature`, {
                    id_annonce: annonceId,
                    id_candidat: userId
                });

                console.log('Status Code:', response.status);
                console.log('Response Data:', response.data);
                console.log('Vous avez bien annulé votre candidature');
                window.location.href = `/candidat`
            } catch (err) {
                console.log(err);
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

const formatCandidatureDates = (candidaturesData) => {
    if (Array.isArray(candidaturesData)) {
        for (const candidature of candidaturesData) {
            if (candidature.date_candidature) {
                candidature.date_candidature = formatterDateSQL(candidature.date_candidature);
            }
        }
    }
};

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

function showNotif(message) {
    const notifMessage = document.getElementById('notif-message');
    notifMessage.textContent = message;
    notifMessage.style.display = 'block';

    setTimeout(() => {
        notifMessage.style.display = 'none';
        notifMessage.textContent = '';
    }, 5000);
}

const handleSuccess = async (data, extra) => {
    const publicId = data._rawValue.info.public_id;
    try {
          const response = await axios.post(`${config.public.backend}/api/v1/candidats/update_pp`, {
          url_pp: publicId,
          id: userId
      });
      window.location.href = `/candidat`
    } catch (err) {
        console.log(err);
    }
}

const modifLogo = async (data, extra) => {
 const oldPublicId = candidatData.value.url_pp;
 const newPublicId = data._rawValue.info.public_id;
            try {
                const firstResponse = await axios.post(`${config.public.backend}/api/v1/candidats/update_pp`, {
                    url_pp: newPublicId,
                    id: userId
                });
                const secondResponse = await axios.post(`${config.public.backend}/api/v1/cloudinary/deleteFile`, {
                    publicId: oldPublicId
                });
                window.location.href = `/candidat`
            } catch (e) {
                console.log(e);
            }
}

const insertProfession = async () => {
  professionModal.value = false;
  if (
      !profession.value
    ) {
      showError("Veuillez renseigner une profession");
    } else if (profession.value.length < 2) {
      showError("Renseigner une profession d'au moins 2 lettres");
    } else {
      try {
        const response = await axios.post(`${config.public.backend}/api/v1/candidats/insertProf`, {
          profession: profession.value,
          id: userId
        });

        console.log('Status Code:', response.status);
        console.log('Response Data:', response.data);
        profession.value = null;

        // newAnnonce.value = {};
        window.location.href = `/candidat`
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
        const response = await axios.post(`${config.public.backend}/api/v1/candidats/insertDesc`, {
          description: description.value,
          id: userId
        });

        console.log('Status Code:', response.status);
        console.log('Response Data:', response.data);
        description.value = null;

        // newAnnonce.value = {};
        window.location.href = `/candidat`
      } catch (err) {
        console.log(err);
      }
  }
}

const insertExperience = async () => {
  experienceModal.value = false;
  if (
      !experience.value.poste ||
      !experience.value.employeur ||
      !experience.value.date_debut
    ) {
      showError("Veuillez remplir 'tous' les champs obligatoires (*).");
    }else {
      try {
        const date_debut = convertDateFormat(experience.value.date_debut);
        if(experience.value.date_fin.length > 0){
          experience.value.date_fin = convertDateFormat(experience.value.date_fin);
        }
        const response = await axios.post(`${config.public.backend}/api/v1/candidats/insertExp`, {
          employeur: experience.value.employeur,
          date_debut: date_debut,
          poste: experience.value.poste,
          date_fin: experience.value.date_fin,
          id_candidat: userId
        });

        console.log('Status Code:', response.status);
        console.log('Response Data:', response.data);

        experience.value = {};
        window.location.href = `/candidat`
      } catch (err) {
        console.log(err);
      }
  }
}

const insertFormartion = async () => {
  formationModal.value = false;
  if (
      !formation.value.nom ||
      !formation.value.ecole ||
      !formation.value.date_debut
    ) {
      showError("Veuillez remplir 'tous' les champs obligatoires (*).");
    }else {
      try {
        const date_debut = convertDateFormat(formation.value.date_debut);
        if(formation.value.date_fin.length > 0){
          formation.value.date_fin = convertDateFormat(formation.value.date_fin);
        }
        const response = await axios.post(`${config.public.backend}/api/v1/candidats/insertForm`, {
          nom: formation.value.nom,
          date_debut: date_debut,
          ecole: formation.value.ecole,
          date_fin: formation.value.date_fin,
          id_candidat: userId
        });

        console.log('Status Code:', response.status);
        console.log('Response Data:', response.data);

        formation.value = {};
        window.location.href = `/candidat`
      } catch (err) {
        console.log(err);
      }
  }
}

</script>
<style scoped>
.only-small-mobile {
  display: none;
}
.box-container {
    width: 100%;
    display: flex;
    justify-content: center;
}
a:visited {
  color: inherit;
}
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
.user-profile {
    text-align: center;
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
  transition: 0.3s ease-in-out;
}

.overlay-text:hover {
  font-size: 18px;
  color: #25bcff;
  background-color: rgba(255, 255, 255, 0.834);
  cursor: pointer;
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
    cursor: pointer;
}

.profile-picture img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
}


@media (max-width:1086px) and (min-width:769px) {
    .box {
      width: 420px;
      margin: 45px 0 0 15px !important;
    }
  }

  @media (max-width:768px) and (min-width:500px) {
    .box {
      width: 420px;
      margin: 45px 0 0 0 !important;
    }
  }

  @media (max-width:499px) and (min-width:350px) {
    .box {
      width: 300px !important; 
      margin: 35px 0 0 0 !important;
    }
  }

  @media (max-width:349px) and (min-width:150px) {
    .box {
      width: 250px !important; 
      margin: 25px 0 0 0 !important;
    }
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

.retenue {
    background-color: rgb(127, 232, 127);
    color: white;
}

.refuse {
    background-color: rgb(255, 138, 138);
    color: white;
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
  
.poste-style {
  color: rgb(54, 71, 227) !important;
  font-weight: 700;
}

 /* Container */
 .container {
    padding: 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: #f0f2f5; /* Light background */
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

  .wrapper .form-container{
  width: 100%;
  overflow: hidden;
}
.wrapper {
  padding: 14px;
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
</style>