<template>
    <div class="reset-password-container">
        <div id="error-message" class="error-message"></div>
        <div id="notif-message" class="notif-message"></div>
        <div class="reset-password-form">
            <h2>Modifier mon adresse mail</h2>
            <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="newPassword">Nouvelle adresse mail:</label>
                <input id="newPassword" v-model="newMail" required>
            </div>
            <button type="submit">Confirmer</button>
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

const authStore = useAuthStore();
const router = useRouter();
const config = useRuntimeConfig();
const newMail = ref(null);
const showSpinner = ref(false);

authStore.logout()

onBeforeMount(() => {
    if(!router.currentRoute.value.query.role || !router.currentRoute.value.query.token) {
        router.push({path: `/`})
    }
})

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

function passwordRules(chaine) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(chaine);
}

function isValidEmail(email) {
    // Expression régulière pour vérifier la syntaxe de l'adresse email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Teste si l'email correspond à l'expression régulière
    return emailRegex.test(email);
}

async function submitForm() {
  showSpinner.value = true;
  toggleBodyOverflow(true);
  if (!isValidEmail(newMail.value)) {
      showSpinner.value = false;
      toggleBodyOverflow(false);
      showError("Veuillez rédiger une adresse e-mail valide.");
    } else {
        try {
          if (router.currentRoute.value.query.role === 'candidat') {
                const response = await axios.post(`${config.public.backend}/api/v1/candidats/resetMail`, {
                mail: newMail.value,
                token: router.currentRoute.value.query.token
            });
            if(response.data.status === "error"){
                showError('Une erreur est survenue.')
            }
            else if (response.data.message === "Mail existant") {
                newMail.value = null
                showError("Un compte existant utilise déjà cette adresse mail.")
            }
            else if (response.data.status === "success") {
                newMail.value = null
                showNotif("Votre adresse e-mail a bien été modifié. Consulter le mail de verification.")
            }

        } else if(router.currentRoute.value.query.role === 'employeur') {
            const response = await axios.post(`${config.public.backend}/api/v1/employeurs/resetMail`, {
                mail: newMail.value,
                token: router.currentRoute.value.query.token
            });
            if(response.data.status === "error"){
                showError('Une erreur est survenue.')
            }
            else if (response.data.message === "Mail existant") {
                newMail.value = null
                showError("Un compte existant utilise déjà cette adresse mail.")
            }
            else if (response.data.status === "success") {
                newMail.value = null
                showNotif("Votre adresse e-mail a bien été modifié. Consulter le mail de verification.")
            }
        } else {
            router.push({path: `/`})
        }
        
      } catch (err) {
        console.log(err);
      } finally {
        showSpinner.value = false;
        toggleBodyOverflow(false);
      }
    }
  }
console.log(router.currentRoute.value.query.role, "hhhhhhhh")
</script>
  
  <style scoped>
  .reset-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f8f9fa;
  }
  
  .reset-password-form {
    width: 400px;
    background-color: #ffffff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #343a40;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    font-weight: bold;
    color: #343a40;
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ced4da;
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
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  button:active {
    background-color: #004080;
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

  </style>
  