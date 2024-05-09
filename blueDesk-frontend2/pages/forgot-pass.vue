<template>
    <div class="page-content">
      <div id="error-message" class="error-message"></div>
      <div id="notif-message" class="notif-message"></div>
      <div class="form-container">
        <h2>Mot de passe oublié</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="userType">Choisissez le type d'utilisateur:</label>
            <select id="userType" v-model="resetData.typeUser">
              <option value="Candidat">Candidat</option>
              <option value="Employeur">Employeur</option>
            </select>
          </div>
          <div class="form-group">
            <label for="email">Adresse e-mail:</label>
            <input type="email" id="email" v-model="resetData.mail" required>
          </div>
          <button type="submit">Envoyer</button>
        </form>
      </div>
      <div v-if="showSpinner" class="progressSpin">
        <ProgressSpinner class="spinnerx" />
      </div>
    </div>
  </template>
  
<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { vMaska } from 'maska';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import ProgressSpinner from 'primevue/progressspinner';

const config = useRuntimeConfig();
const showSpinner = ref(false);

const resetData = ref({
  mail: '',
  typeUser: ''
});

function isValidEmail(email) {
    // Expression régulière pour vérifier la syntaxe de l'adresse email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Teste si l'email correspond à l'expression régulière
    return emailRegex.test(email);
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
  }, 10000);
}

const toggleBodyOverflow = (hideOverflow) => {
  if (hideOverflow) {
    document.documentElement.scrollTop = 0;
  } else {
    document.body.style.overflow = '';
  }
};

async function submitForm() {
  showSpinner.value = true;
  toggleBodyOverflow(true);
  if (
    !resetData.value.typeUser
  ) {
    showError("Veuillez selectionner votre role.");
  }
  else if(!resetData.value.mail){
    showError("Veuillez remplir tous les champs.")
  }
  else if(!isValidEmail(resetData.value.mail)){
    showError("Veuillez rédiger une adresse mail correcte.")
  }
  else{
        try {
          if (resetData.value.typeUser === 'Candidat') {
                const response = await axios.post(`${config.public.backend}/api/v1/candidats/forgotPass`, {
                mail: resetData.value.mail
            });
            if(response.data.status === "error" || response.data.data === "mail non existant" || response.data.status === "success"){
                showNotif(`Si un compte ${resetData.value.typeUser} possède votre adresse mail, vous recevrez un mail de réinitialisation dans un instant`)
            }

        } else if(resetData.value.typeUser === 'Employeur') {
            const response = await axios.post(`${config.public.backend}/api/v1/employeurs/forgotPass`, {
                mail: resetData.value.mail
            });
            if(response.data.status === "error" || response.data.data === "mail non existant" || response.data.status === "success"){
                showNotif(`Si un compte ${resetData.value.typeUser} possède votre adresse mail, vous recevrez un mail de réinitialisation dans un instant`)
            }
        }
        
      } catch (err) {
        console.log(err);
      } finally {
        showSpinner.value = false;
        toggleBodyOverflow(false);
      }
    }
  }
</script>
  
  <style scoped>
  .page-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .form-container {
    width: 400px;
    background-color: #f2f2f2;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    font-weight: bold;
  }
  
  input,
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  button:active {
    background-color: #004080;
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
  </style>
  