<template>
  <div class="wrapper">
      <div id="error-message" class="error-message"></div>
      <div id="notif-message" class="notif-message"></div>
      <div class="title-text">
        <div class="title login" :style="{marginLeft: loginMargin}">Se connecter</div>
        <div class="title signup" :style="{marginLeft: signupMargin}">S'inscrire</div>
      </div>
      <div class="form-container">
        <div class="slide-controls">
          <input type="radio" name="slide" id="login" checked @click="showLoginForm">
          <input type="radio" name="slide" id="signup" @click="showSignupForm">
          <label for="login" class="slide login">Connexion</label>
          <label for="signup" class="slide signup">Inscription</label>
          <div class="slider-tab"></div>
        </div>
        <div class="form-inner">

          <form @submit.prevent="loggin" class="login" :style="{marginLeft: loginFormMargin}">
            <div class="field">
                <select name="typeUser" v-model="userLog.typeUser" class="format-input">
                    <option value="" disabled selected>Tu es ?</option>
                    <option value="Employeur">Employeur</option>
                    <option value="Candidat">Candidat</option>
                  </select>
            </div>
            <div v-if="userLog.typeUser === 'Candidat'"  class="field">
              <input type="text" v-model="userLog.mail" placeholder="Email Address" required>
            </div>
            <div v-if="userLog.typeUser === 'Employeur'"  class="field">
              <input type="text" v-model="userLog.identifiant" placeholder="identifiant" required>
            </div>
            <div class="field">
              <input type="password" v-model="userLog.pass" placeholder="Password" required>
            </div>
            <!-- <div class="pass-link">
              <a href="#">Mot de passe oublié ?</a>
            </div> -->
            <div class="field btn">
              <div class="btn-layer"></div>
              <input type="submit" value="Se connecter">
            </div>
            <div class="signup-link">
              Pas encore inscrit ? <a href="" @click.prevent="showSignupForm">Inscris toi</a>
            </div>
          </form>

          <form action="#" class="signup" :style="{marginLeft: signupFormMargin}">
            <div class="field">
                <select name="typeUser" v-model="newUser.typeUser" class="format-input">
                    <option value="" disabled selected>Tu es ?</option>
                    <option value="Employeur">Employeur</option>
                    <option value="Candidat">Candidat</option>
                  </select>
            </div>
            <div v-if="newUser.typeUser === 'Candidat'" class="field">
                <input v-maska:[options] data-maska="A A" v-model="newUser.prenom" type="text"
                       placeholder="prénom">
            </div>
            <div class="field">
              <input v-maska:[options] data-maska="A A" v-model="newUser.nom" type="text"
              placeholder="nom">
            </div>
            <div v-if="newUser.typeUser === 'Candidat'" class="field">
                <input v-maska:[options] data-maska="A A" v-model="newUser.pays" type="text"
                       placeholder="Pays">
            </div>
            <div v-if="newUser.typeUser === 'Employeur'" class="field">
                <input  v-model="newUser.ville" type="text"
                       placeholder="Ville">
            </div>
            <div v-if="newUser.typeUser === 'Employeur'" class="field">
                <input  v-model="newUser.identifiant" type="text"
                       placeholder="Identifiant">
            </div>
            <div v-if="newUser.typeUser === 'Employeur'" class="field">
                <input v-model="newUser.numero_siret" type="text"
                       placeholder="SIRET">
            </div>
            <div v-if="newUser.typeUser === 'Candidat'" class="field">
                <select v-model="newUser.sexe" class="format-input">
                        <option value="" disabled selected>sexe</option>
                        <option value="m">Homme</option>
                        <option value="f">Femme</option>
                </select>
            </div>
            <div v-if="newUser.typeUser === 'Candidat'" class="field">
                <input v-maska data-maska="##/##/####"  v-model="newUser.date_naissance" type="text"
                       placeholder="date de naissance">
            </div>
            <div class="field">
                <input v-model="newUser.mail" type="email"
                       placeholder="email@email.com">
            </div>
            <div class="field">
                <input v-maska data-maska="#################" v-model="newUser.phone" type="text"
                       placeholder="portable">
            </div>
            <div class="field">
              <input v-model="newUser.pass" type="password" placeholder="Password" required>
            </div>
            <div class="field">
              <input v-model="newUser.pass2" type="password" placeholder="Confirm password" required>
            </div>
            <div class="field btn">
              <div class="btn-layer"></div>
              <button ref="signingUp" type="submit">S'inscrire</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import axios from 'axios';
import { ref } from 'vue';
import { vMaska } from 'maska';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const signIn = ref(null);
const signUp = ref(null);
const containerzz = ref(null);
const sliderz = ref(null);
const formSection = ref(null);
const signingUp = ref(null);
const authStore = useAuthStore();
const router = useRouter();
const config = useRuntimeConfig();


// Define the mask options to allow letters, numbers, and spaces
const options = {
  tokens: {
    A: {
      pattern: /[A-Z]/,
      multiple: true,
      transform: chr => chr.toUpperCase()
    }
  }
}

const newUser = ref({
  prenom: '',
  nom: '',
  numero_siret: '',
  date_naissance: '',
  mail: '',
  pass: '',
  pass2: '',
  phone: '',
  sexe: '',
  identifiant: '',
  typeUser: '',
  pays: '',
  ville: ''
});

const userLog = ref({
  mail: '',
  identifiant: '',
  pass: '',
  typeUser: '',
});


  const loginMargin = ref("0%");
  const signupMargin = ref("-100%");
  const loginFormMargin = ref("0%");
  const signupFormMargin = ref("-100%");
  
  const showLoginForm = () => {
    loginMargin.value = "0%";
    signupMargin.value = "-100%";
    loginFormMargin.value = "0%";
    signupFormMargin.value = "-100%";
  };
  
  const showSignupForm = () => {
    loginMargin.value = "-50%";
    signupMargin.value = "0%";
    loginFormMargin.value = "-50%";
    signupFormMargin.value = "0%";
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

function passwordRules(chaine) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(chaine);
}

  async function loggin() {
  console.log(userLog.value);
  if (
    !userLog.value.typeUser
  ) {
    showError("Veuillez selectionner votre role.");
  }
  if(userLog.value.typeUser === 'Candidat' && !userLog.value.mail || !userLog.value.pass){
    showError("Veuiller remplir tous les champs.")
  }
  if(userLog.value.typeUser === 'Employeur' && !userLog.value.identifiant || !userLog.value.pass){
    showError("Veuiller remplir tous les champs.")
  }
  else{
        try {
        if (userLog.value.typeUser === 'Candidat') {
            const response = await axios.post(`${config.public.backend}/api/v1/candidats/login`, {
            mail: userLog.value.mail,
            pass: userLog.value.pass,
          });
          if(response.data.status === "error"){
            showError("Informations incorrectes !")
          }
          else if(response.data.status === "success") {
            console.log('Status Code:', response.status);
            console.log('Response Data:', response.data);
            const role = response.data.role;
            const userId = response.data.userId;

            authStore.login(userId, role);
            router.push({path: '/candidat'});
          }
          

        } else {
          const response = await axios.post(`${config.public.backend}/api/v1/employeurs/login`, {
            identifiant: userLog.value.identifiant,
            pass: userLog.value.pass,
          });
          if(response.data.status === "error"){
            showError("Informations incorrectes !")
          }
          else if(response.data.status === "success") {
            console.log('Status Code:', response.status);
            console.log('Response Data:', response.data);
            const role = response.data.role;
            const userId = response.data.userId;

            authStore.login(userId, role);
            router.push({path: '/employeur'});
          }
          
        }
        
      } catch (err) {
        console.log(err);
      }
    }
  }

  function isValidEmail(email) {
    // Expression régulière pour vérifier la syntaxe de l'adresse email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Teste si l'email correspond à l'expression régulière
    return emailRegex.test(email);
}

  onMounted(() => {
    const createUserAction = signingUp.value;

   createUserAction.addEventListener('click', async ()=>{
    console.log(newUser.value);
  if (newUser.value.typeUser === 'Candidat') {
    if (
      !newUser.value.prenom ||
      !newUser.value.nom ||
      !newUser.value.mail ||
      !newUser.value.phone ||
      !newUser.value.pass ||
      !newUser.value.date_naissance ||
      !newUser.value.sexe ||
      !newUser.value.pass2 ||
      !newUser.value.pays
    ) {
      showError("Veuillez remplir 'tous' les champs.");
    } else if (newUser.value.pass != newUser.value.pass2) {
      showError("Vos mots de passe ne sont pas identiques");
    }  else if (!passwordRules(newUser.value.pass)) {
      showError("Votre mot de passe doit contenir au minimum 8 caractères, minuscule, majuscule et un chiffre")
    } else if (!isValidEmail(newUser.value.mail)) {
      showError("Veuiller rédiger une adresse mail correcte.")
    } else {
      try {
        const date_naissance = convertDateFormat(newUser.value.date_naissance);
        const response = await axios.post(`${config.public.backend}/api/v1/candidats`, {
          prenom: newUser.value.prenom,
          nom: newUser.value.nom,
          date_naissance: date_naissance,
          mail: newUser.value.mail,
          phone: newUser.value.phone,
          pass: newUser.value.pass,
          sexe: newUser.value.sexe,
          pays: newUser.value.pays
        });
        if(response.data.data === 'mail existant'){
          showError("Un compte a déjà été créé avec cette adresse mail.");
        } else if(response.data.data === 'téléphone existant'){
          showError("Un compte a déjà été créé avec ce numéro.");
        } else {
          showNotif("Votre inscription a bien été prise en compte. Connectez vous!")
          newUser.value = {};
        }
      } catch (err) {
        console.log(err);
      }
    }
  } else if (newUser.value.typeUser === '') {
    showError("Choisissez votre rôle.");
  } else {
    if (
      !newUser.value.identifiant ||
      !newUser.value.nom ||
      !newUser.value.mail ||
      !newUser.value.phone ||
      !newUser.value.pass ||
      !newUser.value.pass2 ||
      !newUser.value.numero_siret ||
      !newUser.value.ville
    ) {
      showError("Veuillez remplir 'tous' les champs.");
    } else if (newUser.value.pass != newUser.value.pass2) {
      showError("Vos mots de passe ne sont pas identiques");
    } else if (!passwordRules(newUser.value.pass)) {
      showError("Votre mot de passe doit contenir au minimum 8 caractères, minuscule, majuscule et un chiffre")
    } else if (!isValidEmail(newUser.value.mail)) {
      showError("Veuiller rédiger une adresse mail correcte.")
    } else {
      try {
        const response = await axios.post(`${config.public.backend}/api/v1/employeurs`, {
          nom: newUser.value.nom,
          mail: newUser.value.mail,
          phone: newUser.value.phone,
          pass: newUser.value.pass,
          identifiant: newUser.value.identifiant,
          numero_siret: newUser.value.numero_siret,
          ville: newUser.value.ville
        });
        if(response.data.data === 'mail existant'){
          showError("Un compte a déjà été créé avec cette adresse mail.");
        } else if(response.data.data === 'identifiant existant'){
          showError("Un compte a déjà été créé avec cet identifiant.");
        } else if(response.data.data === 'numero_siret existant'){
          showError("Ce SIRET appartient à une autre entreprise");
        } else if(response.data.data === 'nom existant'){
          showError("Ce nom appartient à une autre entreprise");
        } else {
          showNotif("Votre inscription a bien été prise en compte. Connectez vous!")
          newUser.value = {};
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
   });
})

  </script>
<style scoped>
::selection{
  background: #34a7d3;
  color: #fff;
}
.wrapper{
  overflow: hidden;
  max-width: 390px;
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
</style>