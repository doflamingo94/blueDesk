<template>
    <div class="page-content">
        <div id="error-message" class="error-message"></div>
        <div id="notif-message" class="notif-message"></div>
        <div v-if="userData" class="settings">
          <section class="personal-info">
            <h2>Informations personnelles</h2>
            <div v-if="role === 'candidat'" class="info-item">
              <label>Prénom:</label>
              <div class="info-value">{{ `${userData.prenom}` }}</div>
              <button @click="prenomModal = true">Modifier</button>
            </div>
            <div class="info-item">
              <label>Nom:</label>
              <div class="info-value">{{ `${userData.nom}` }}</div>
              <button @click="nomModal = true">Modifier</button>
            </div>
            <div v-if="role === 'candidat'" class="info-item">
              <label>Date de naissance:</label>
              <div class="info-value">{{ `${userData.date_naissance}` }}</div>
              <button @click="dateNaissanceModal = true">Modifier</button>
            </div>
            <div class="info-item">
              <label>Adresse e-mail:</label>
              <div class="info-value">{{ `${userData.mail}` }}</div>
              <button @click="mailModal = true">Modifier</button> 
            </div>
            <div class="info-item">
              <label>Numéro de téléphone:</label>
              <div class="info-value">{{ `${userData.phone}` }}</div>
              <button @click="phoneModal = true">Modifier</button>
            </div>
            <div class="info-item">
              <label>Mot de passe:</label>
              <div class="info-value">*******</div>
              <button @click="passModal = true">Modifier</button>
            </div>
          </section>
      
          <section class="cgu">
            <h2>Conditions Générales d'Utilisation</h2>
            <button @click="cguModal = true">Consulter</button>
          </section>
      
          <section class="delete-account">
            <h2>Supprimer mon compte</h2>
            <button @click="deleteModal = true">Supprimer</button>
          </section>

          <Dialog v-model:visible="mailModal" modal :style="{ width: 'auto', height: 'auto', padding: '12px' }">
            <div class="wrapper">
              <div class="title-text">
                <div class="title" :style="{marginLeft: loginMargin}">Pour modifier votre e-mail nous allons vous envoyer un lien de modification sur votre e-mail actuelle</div>
              </div>
                    <div class="field btn">
                      <div class="btn-layer"></div>
                      <button @click="emailCheck" type="submit" class="clkbtn">Envoyer</button>
                    </div>
            </div>
          </Dialog>
          <Dialog v-model:visible="deleteModal" modal :style="{ width: 'auto', height: 'auto', padding: '12px' }">
            <div class="wrapper">
              <div class="title-text">
                <div class="title" :style="{marginLeft: loginMargin}">Etes vous sur de vouloir supprimer votre compte ?</div>
              </div>
                    <div class="field btn">
                      <div class="btn-layer"></div>
                      <button @click="deleteAccount" type="submit" class="clkbtn">Supprimer</button>
                    </div>
            </div>
          </Dialog>
          <Dialog v-model:visible="cguModal" modal :style="{ width: 'auto', height: 'auto', padding: '12px' }">
            <div class="wrapper">
              <div class="title-text">
                <div class="title" :style="{marginLeft: loginMargin}">CGU</div>
              </div>
                    <div class="field btn">
                      <div class="btn-layer"></div>
                      <button type="submit" class="clkbtn">Fermer</button>
                    </div>
            </div>
          </Dialog>
          <Dialog v-model:visible="passModal" modal :style="{ width: 'auto', height: 'auto', padding: '12px' }">
            <div class="wrapper">
              <div class="title-text">
                <div class="title" :style="{marginLeft: loginMargin}">Pour modifier votre mot de passe nous allons vous envoyer un lien de réinitialisation par mail.</div>
              </div>
                    <div class="field btn">
                      <div class="btn-layer"></div>
                      <button @click="changePass" type="submit" class="clkbtn">Envoyer</button>
                    </div>
            </div>
          </Dialog>
          <Dialog v-model:visible="dateNaissanceModal" modal :style="{ width: 'auto', height: 'auto', padding: '12px' }">
            <div class="wrapper">
              <div class="title-text">
                <div class="title" :style="{marginLeft: loginMargin}">Corriger votre date de naissance</div>
              </div>
              <div class="form-container">
                <div class="form-inner">
                  <form @submit.prevent class="login" :style="{marginLeft: loginFormMargin}">
                    <div class="field">
                      <input v-maska data-maska="##/##/####" v-model="modifData.date_naissance" type="text"
                         placeholder="date de naissance">
                    </div>
                    <div class="field btn">
                      <div class="btn-layer"></div>
                      <button @click="dateChange" type="submit" class="clkbtn">Renseigner</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Dialog>
          <Dialog v-model:visible="nomModal" modal :style="{ width: 'auto', height: 'auto', padding: '12px' }">
            <div class="wrapper">
              <div class="title-text">
                <div class="title" :style="{marginLeft: loginMargin}">Corrigez votre nom</div>
              </div>
              <div class="form-container">
                <div class="form-inner">
                  <form @submit.prevent class="login" :style="{marginLeft: loginFormMargin}">
                    <div class="field">
                      <input v-maska:[options] data-maska="A A" type="text"
                           placeholder="Nom" v-model="modifData.nom">
                    </div>
                    <div class="field btn">
                      <div class="btn-layer"></div>
                      <button @click="nomChange" type="submit" class="clkbtn">Renseigner</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Dialog>
          <Dialog v-model:visible="prenomModal" modal :style="{ width: 'auto', height: 'auto', padding: '12px' }">
            <div class="wrapper">
              <div class="title-text">
                <div class="title" :style="{marginLeft: loginMargin}">Corrigez votre prénom</div>
              </div>
              <div class="form-container">
                <div class="form-inner">
                  <form @submit.prevent class="login" :style="{marginLeft: loginFormMargin}">
                    <div class="field">
                      <input v-maska:[options] data-maska="A A" type="text"
                           placeholder="Prénom" v-model="modifData.prenom">
                    </div>
                    <div class="field btn">
                      <div class="btn-layer"></div>
                      <button @click="prenomChange" type="submit" class="clkbtn">Renseigner</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Dialog>
          <Dialog v-model:visible="phoneModal" modal :style="{ width: 'auto', height: 'auto', padding: '12px' }">
            <div class="wrapper">
              <div class="title-text">
                <div class="title" :style="{marginLeft: loginMargin}">Corrigez votre numéro</div>
              </div>
              <div class="form-container">
                <div class="form-inner">
                  <form @submit.prevent class="login" :style="{marginLeft: loginFormMargin}">
                    <div class="field">
                      <input type="text"
                           placeholder="Numéro de téléphone" v-model="modifData.phone">
                    </div>
                    <div class="field btn">
                      <div class="btn-layer"></div>
                      <button @click="phoneChange" type="submit" class="clkbtn">Renseigner</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Dialog>

      
          <!-- <modal v-if="showModal" @close="showModal = false">
            
          </modal> -->
        </div>
        <div v-if="showSpinner" class="progressSpin">
            <ProgressSpinner class="spinnerx" />
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
import VueDOMPurifyHTML from 'vue-dompurify-html';
import ProgressSpinner from 'primevue/progressspinner';

const showSpinner = ref(false);
const config = useRuntimeConfig();
const router = useRouter();
const authStore = useAuthStore();
const role = authStore.getRole;
const userId = authStore.getId;
const userData = ref(null);
const mailModal = ref(false);
const passModal = ref(false);
const dateNaissanceModal = ref(false);
const nomModal = ref(false);
const prenomModal = ref(false);
const phoneModal = ref(false);
const deleteModal = ref(false);
const cguModal = ref(false);
const modifData = ref({
  prenom: '',
  nom: '',
  date_naissance: '',
  phone: ''
});

const options = {
  tokens: {
    A: {
      pattern: /[A-Z]/,
      multiple: true,
      transform: chr => chr.toUpperCase()
    }
  }
}

console.log(role)

const toggleBodyOverflow = (hideOverflow) => {
  if (hideOverflow) {
    document.documentElement.scrollTop = 0;
  } else {
    document.body.style.overflow = '';
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

function showNotif(message) {
  const notifMessage = document.getElementById('notif-message');
  notifMessage.textContent = message;
  notifMessage.style.display = 'block';

  setTimeout(() => {
    notifMessage.style.display = 'none';
    notifMessage.textContent = '';
  }, 10000);
}

if (!authStore.isLoggedIn) {
  router.push({ path: '/' })
} else {
    onBeforeMount(async()=>{
      await hydrateUser();
    })
}

const hydrateUser = async () => {
    if(role === 'candidat') {
        try {
            const response = await axios.get(`${config.public.backend}/api/v1/candidats/${userId}`);
            console.log(response);
            console.log(response.data);
            userData.value = response.data.data[0];
            console.log(userData.value);
            formatDates(userData.value)
            console.log(userData.value, 'testttttt')
        } catch (err) {
            console.log(err)
        } finally {
            showSpinner.value = false;
            toggleBodyOverflow(false);
        }
    } else if (role === 'employeur') {
        try {
            const response = await axios.get(`${config.public.backend}/api/v1/employeurs/${userId}`);
            console.log(response);
            console.log(response.data);
            userData.value = response.data.data[0];
            console.log(userData.value);
        } catch (err) {
            console.log(err)
        } finally {
            showSpinner.value = false;
            toggleBodyOverflow(false);
            mailModal.value = false;
        }
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

const formatDates = (candidatureData) => {
    // if (Array.isArray(candidaturesData)) {
    //     for (const candidature of candidaturesData) {
            if (candidatureData.date_naissance) {
                candidatureData.date_naissance = formatterDateSQL(candidatureData.date_naissance);
            }
        // }
    // }
};

const emailCheck = async () => {
    mailModal.value = false;
    showSpinner.value = true;
    toggleBodyOverflow(true);
    if (role === 'candidat') {
        try {
            const response = await axios.post(`${config.public.backend}/api/v1/candidats/changeMail`, {
                mail: userData.value.mail
            })
            if(response.data.status === "error") {
                
                showError(`Une erreur est survenue, verifiez que votre adresse e-mail soit correcte.`)
            } else if (response.data.status === 'success') {
                
                showNotif("Un mail de modification vous a été envoyé, veuillez le consulter")
            }
        } catch (error) {
            console.log(error);
        } finally {
            showSpinner.value = false;
            toggleBodyOverflow(false);
        }
    } else if (role === 'employeur') {
        try {
                const response = await axios.post(`${config.public.backend}/api/v1/employeurs/changeMail`, {
                mail: userData.value.mail
            })
            if(response.data.status === "error") {
                
                showError(`Une erreur est survenue, verifiez que votre adresse e-mail soit correcte.`)
            } else if (response.data.status === 'success') {
                
                showNotif("Un mail de modification vous a été envoyé, veuillez le consulter")
            }
        } catch (error) {
            console.log(error);
        } finally {
            
            showSpinner.value = false;
            toggleBodyOverflow(false);
        }
    }
}

const changePass = async () => {
    passModal.value = false;
    showSpinner.value = true;
    toggleBodyOverflow(true);
    if (role === 'candidat') {
        try {
            const response = await axios.post(`${config.public.backend}/api/v1/candidats/forgotPass`, {
                mail: userData.value.mail
            })
            if(response.data.status === "error") {
                
                showError(`Une erreur est survenue`)
            } else if (response.data.status === 'success') {
                
                showNotif("Un mail de réinitialisation a été envoyé, veuillez le consulter")
            }
        } catch (error) {
            console.log(error);
        } finally {
            showSpinner.value = false;
            toggleBodyOverflow(false);
        }
    } else if (role === 'employeur') {
        try {
                const response = await axios.post(`${config.public.backend}/api/v1/employeurs/forgotPass`, {
                mail: userData.value.mail
            })
            if(response.data.status === "error") {
                
                showError(`Une erreur est survenue.`)
            } else if (response.data.status === 'success') {
                
                showNotif("Un mail de réinitialisation a été envoyé, veuillez le consulter")
            }
        } catch (error) {
            console.log(error);
        } finally {
            
            showSpinner.value = false;
            toggleBodyOverflow(false);
        }
    }
}

const prenomChange = async () => {
    prenomModal.value = false;
    showSpinner.value = true;
    toggleBodyOverflow(true);
    if(modifData.value.prenom.length < 2) {
      showError('prénom trop court');
    } else {
      try {
          const response = await axios.post(`${config.public.backend}/api/v1/candidats/corrigePrenom`, {
              prenom: modifData.value.prenom,
              id: userId
          })
          if(response.data.status === "error") {
              
              showError(`Une erreur est survenue`)
          } else if (response.data.status === 'success') {
              window.location.href = `/settings`;
          }
      } catch (error) {
          console.log(error);
      } finally {
          showSpinner.value = false;
          toggleBodyOverflow(false);
      }
    }
}

const dateChange = async () => {
    dateNaissanceModal.value = false;
    const dateConv = convertDateFormat(modifData.value.date_naissance)
    showSpinner.value = true;
    toggleBodyOverflow(true);
      try {
          const response = await axios.post(`${config.public.backend}/api/v1/candidats/corrigeDateNaissance`, {
              date_naissance: dateConv,
              id: userId
          })
          if(response.data.status === "error") {
              
              showError(`Une erreur est survenue`)
          } else if (response.data.status === 'success') {
              window.location.href = `/settings`;
          }
      } catch (error) {
          console.log(error);
      } finally {
          showSpinner.value = false;
          toggleBodyOverflow(false);
      }
}

const nomChange = async () => {
    nomModal.value = false;
    showSpinner.value = true;
    toggleBodyOverflow(true);
    if (role === 'candidat') {
        try {
            const response = await axios.post(`${config.public.backend}/api/v1/candidats/corrigeNom`, {
                nom: modifData.value.nom,
                id: userId
            })
            if(response.data.status === "error") {
                
                showError(`Une erreur est survenue.`)
            } else if (response.data.status === 'success') {
              window.location.href = '/settings';
            }
        } catch (error) {
            console.log(error);
        } finally {
            showSpinner.value = false;
            toggleBodyOverflow(false);
        }
    } else if (role === 'employeur') {
        try {
            const response = await axios.post(`${config.public.backend}/api/v1/employeurs/corrigeNom`, {
                nom: modifData.value.nom,
                id: userId
            })
            if (response.data.message === 'nom existant') {
              showError("Un employeur possède déjà ce nom.")
            }
            else if(response.data.status === "error") {       
                showError(`Une erreur est survenue`)
            } else if (response.data.status === 'success') {
                window.location.href = '/settings';
            }
        } catch (error) {
            console.log(error);
        } finally {
            
            showSpinner.value = false;
            toggleBodyOverflow(false);
        }
    }
}

const phoneChange = async () => {
    phoneModal.value = false;
    showSpinner.value = true;
    toggleBodyOverflow(true);
    if (role === 'candidat') {
        try {
            const response = await axios.post(`${config.public.backend}/api/v1/candidats/corrigePhone`, {
                phone: modifData.value.phone,
                id: userId
            })
            if (response.data.message === 'téléphone existant') {
              showError("Un utilisateur possède déjà ce numero.")
            }
            else if(response.data.status === "error") {
                showError(`Une erreur est survenue.`)
            } else if (response.data.status === 'success') {
              window.location.href = '/settings';
            }
        } catch (error) {
            console.log(error);
        } finally {
            showSpinner.value = false;
            toggleBodyOverflow(false);
        }
    } else if (role === 'employeur') {
        try {
            const response = await axios.post(`${config.public.backend}/api/v1/employeurs/corrigePhone`, {
                phone: modifData.value.phone,
                id: userId
            })
            if(response.data.status === "error") {       
                showError(`Une erreur est survenue`)
            } else if (response.data.status === 'success') {
                window.location.href = '/settings';
            }
        } catch (error) {
            console.log(error);
        } finally {
            
            showSpinner.value = false;
            toggleBodyOverflow(false);
        }
    }
}

const deleteAccount = async () => {
    deleteModal.value = false;
    showSpinner.value = true;
    toggleBodyOverflow(true);
    if (role === 'candidat') {
        try {
            const response = await axios.post(`${config.public.backend}/api/v1/candidats/supprimeCompteCandidat`, {
                id: userId
            })
            if(response.data.status === "error") {
                showError(`Une erreur est survenue.`)
            } else if (response.data.status === 'success') {
              authStore.logout();
              window.location.href = '/';
            }
        } catch (error) {
            console.log(error);
        } finally {
            showSpinner.value = false;
            toggleBodyOverflow(false);
        }
    } else if (role === 'employeur') {
      try {
            const response = await axios.post(`${config.public.backend}/api/v1/employeurs/supprimeCompteEmployeur`, {
                id: userId
            })
            if(response.data.status === "error") {
                showError(`Une erreur est survenue.`)
            } else if (response.data.status === 'success') {
              authStore.logout();
              window.location.href = '/';
              console.log(response)
            }
        } catch (error) {
            console.log(error);
        } finally {
            
            showSpinner.value = false;
            toggleBodyOverflow(false);
        }
    }
}

</script>
  
<style scoped>
.settings {
max-width: 800px;
margin: 0 auto;
padding: 20px;
}

h2 {
color: #333;
}

/* Add border styles to sections */
section {
border: 2px solid #ddd;
border-radius: 10px;
padding: 20px;
margin-bottom: 20px;
}

.info-item {
margin-bottom: 25px;
display: flex;
flex-wrap: wrap;
}

label {
font-weight: bold;
color: #555;
flex-basis: 100%;
margin-bottom: 5px;
}

.info-value {
margin-left: 10px;
font-style: italic;
color: #777;
flex-basis: calc(100% - 120px);
}

button {
background-color: #4caf50;
color: #fff;
border: none;
padding: 10px 20px;
border-radius: 5px;
cursor: pointer;
transition: background-color 0.3s ease;
}

button:hover {
background-color: #388e3c;
}

.cgu button {
background-color: #ff9800;
}

.cgu button:hover {
background-color: #f57c00;
}

.delete-account button {
background-color: #f44336;
}

.delete-account button:hover {
background-color: #d32f2f;
}

.modal {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
z-index: 9999;
}

.modal-content {
background-color: #fff;
padding: 20px;
border-radius: 10px;
max-width: 500px;
overflow: auto;
box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
margin-top: 0;
color: #333;
}

.page-content {
margin-top: 90px;
}

.modal-close {
position: absolute;
top: 10px;
right: 10px;
cursor: pointer;
color: #666;
}

/* Responsive Styles */

@media screen and (max-width: 768px) {
    .info-value {
    flex-basis: calc(100% - 130px);
    }
}

@media screen and (max-width: 480px) {
    .info-item {
    flex-direction: column;
    align-items: flex-start;
    }

    label {
    flex-basis: auto;
    }

    .info-value {
    flex-basis: auto;
    margin-left: 0;
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

  .progressSpin {
  width: 100%; height: 100%;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center; z-index: 19;
  background-color:rgba(255, 255, 255, 0.8);
}
.progressSpin .spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
}
/* .left-text {
  text-align: left;
} */
</style>
