<template>
    <div id="error-message" class="error-message"></div>
    <div id="notif-message" class="notif-message"></div>
    <header>
        <h1 class="heading">Identifiez vous</h1>
    </header>
 
    <div ref="containerzz" class="container">
 
        <div ref="sliderz" class="slider"></div>
        <div class="btn">
            <button ref="signIn" class="login" id="login">Connexion</button>
            <button ref="signUp" class="signup" id="signup">S'inscrire</button>
        </div>
 
        <div ref="formSection" class="form-section">
 
            <form @submit.prevent="loggin" class="login-box">
                <select name="typeUser" v-model="userLog.typeUser" class="name ele">
                    <option value="" disabled selected>Tu es ?</option>
                    <option value="Employeur">Employeur</option>
                    <option value="Candidat">Candidat</option>
                  </select>
                <input v-if="userLog.typeUser === 'Candidat'" v-model="userLog.mail" type="email"
                       class="email ele"
                       placeholder="email@email.com">
                <input v-if="userLog.typeUser === 'Employeur'" v-model="userLog.identifiant" type="text"
                       class="name ele"
                       placeholder="Identifiant">
                <input v-model="userLog.pass" type="password"
                       class="password ele"
                       placeholder="mot de passe">
                <button type="submit" class="clkbtn">S'identifier</button>
            </form>
 
            <form @submit.prevent class="signup-box">
                <select name="typeUser" v-model="newUser.typeUser" class="name ele">
                    <option value="" disabled selected>Tu es ?</option>
                    <option value="Employeur">Employeur</option>
                    <option value="Candidat">Candidat</option>
                  </select>
                <input v-maska data-maska="@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" data-maska-tokens="Z:[A-Z]|z:[a-z]:multiple" v-if="newUser.typeUser === 'Candidat'" v-model="newUser.prenom" type="text"
                       class="name ele"
                       placeholder="prénom">
                <input v-maska data-maska="@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" data-maska-tokens="Z:[A-Z]|z:[a-z]:multiple" v-model="newUser.nom" type="text"
                       class="name ele"
                       placeholder="nom">
                <input v-if="newUser.typeUser === 'Employeur'" v-model="newUser.identifiant" type="text"
                       class="name ele"
                       placeholder="Identifiant">
                <input v-if="newUser.typeUser === 'Employeur'" v-model="newUser.numero_siret" type="text"
                       class="name ele"
                       placeholder="SIRET">
                <select v-if="newUser.typeUser === 'Candidat'" v-model="newUser.sexe" class="name ele">
                        <option value="" disabled selected>sexe</option>
                        <option value="m">Homme</option>
                        <option value="f">Femme</option>
                </select>
                <input v-maska data-maska="##/##/####" v-if="newUser.typeUser === 'Candidat'" v-model="newUser.date_naissance" type="text"
                       class="name ele"
                       placeholder="date de naissance">
                <input v-model="newUser.mail" type="email"
                       class="email ele"
                       placeholder="email@email.com">
                <input v-maska data-maska="#################" v-model="newUser.phone" type="text"
                       class="email ele"
                       placeholder="portable">
                <input v-model="newUser.pass" type="password"
                       class="password ele"
                       placeholder="mot de passe">
                <input v-model="newUser.pass2" type="password"
                       class="password ele"
                       placeholder="confirmer">
                <button ref="signingUp" type="submit" class="clkbtn">S'inscrire</button>
            </form>
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

console.log(authStore.isLoggedIn) 

if(authStore.isLoggedIn){
        router.push({path: `/${authStore.getRole}`})
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
});

const userLog = ref({
  mail: '',
  identifiant: '',
  pass: '',
  typeUser: '',
});

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

onMounted(() => {
    const signInButton = signIn.value;
    const signUpButton = signUp.value;
    const form = formSection.value;
    const slider = sliderz.value;
    const createUserAction = signingUp.value;

   signInButton.addEventListener('click', ()=>{
    slider.classList.remove("moveslider");
    form.classList.remove("form-section-move");
    console.log('boooooom')
   });

   signUpButton.addEventListener('click', ()=>{
    slider.classList.add("moveslider");
    form.classList.add("form-section-move");
    console.log('checkkkkkk')
   });

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
      !newUser.value.pass2
    ) {
      showError("Veuillez remplir 'tous' les champs.");
    } else if (newUser.value.pass != newUser.value.pass2) {
      showError("Vos mots de passe ne sont pas identiques");
    } else {
      try {
        const date_naissance = convertDateFormat(newUser.value.date_naissance);
        const response = await axios.post('https://ae28qeazag.execute-api.eu-west-3.amazonaws.com/api/v1/candidats', {
          prenom: newUser.value.prenom,
          nom: newUser.value.nom,
          date_naissance: date_naissance,
          mail: newUser.value.mail,
          phone: newUser.value.phone,
          pass: newUser.value.pass,
          sexe: newUser.value.sexe,
        });

        console.log('Status Code:', response.status);
        console.log('Response Data:', response.data);

        newUser.value = {};
        showNotif("Votre inscription a bien été prise en compte. Connectez vous!")
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
      !newUser.value.numero_siret
    ) {
      showError("Veuillez remplir 'tous' les champs.");
    } else if (newUser.value.pass != newUser.value.pass2) {
      showError("Vos mots de passe ne sont pas identiques");
    } else {
      try {
        const response = await axios.post('https://ae28qeazag.execute-api.eu-west-3.amazonaws.com/api/v1/employeurs', {
          nom: newUser.value.nom,
          mail: newUser.value.mail,
          phone: newUser.value.phone,
          pass: newUser.value.pass,
          identifiant: newUser.value.identifiant,
          numero_siret: newUser.value.numero_siret,
        });
        console.log('Status Code:', response.status);
        console.log('Response Data:', response.data);

        newUser.value = {};
        showNotif("Votre inscription a bien été prise en compte. Connectez vous!")
      } catch (err) {
        console.log(err);
      }
    }
  }
   });
})

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
            const response = await axios.post('https://ae28qeazag.execute-api.eu-west-3.amazonaws.com/api/v1/candidats/login', {
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
          const response = await axios.post('https://ae28qeazag.execute-api.eu-west-3.amazonaws.com/api/v1/employeurs/login', {
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

  
</script>
<style lang="css" scoped>
 * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Poppins", sans-serif;
}
 
body {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 30px;
    background-color: rgb(231, 231, 231);
}
 
header {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
}
 
.heading {
    color: rgb(13 102 132);
}
 
.title {
    font-weight: 400;
    letter-spacing: 1.5px;
}
 
.container {
    left: 50%;
    height: 700px;
    width: 500px;
    background-color: rgb(56, 177, 233);
    box-shadow: 8px 8px 20px rgb(128, 128, 128);
    position: relative;
    overflow: hidden;
    transform: translateX(-50%);
    margin-top: 20px;
    border-radius: 10px;
}
 
.btn {
    height: 60px;
    width: 300px;
    margin: 20px auto;
    /* box-shadow: 10px 10px 30px rgb(177, 233, 252); */
    border-radius: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: white;
}
 
.login,
.signup {
    font-size: 22px;
    border: none;
    outline: none;
    background-color: transparent;
    position: relative;
    cursor: pointer;
}
 
.slider {
    height: 60px;
    width: 150px;
    border-radius: 50px;
    background-image: linear-gradient(to right,
            rgb(110, 202, 255),
            rgb(13 102 132));
    position: absolute;
    top: 20px;
    left: 100px;
    transition: all 0.5s ease-in-out;
}
 
.moveslider {
    left: 250px;
}
 
.form-section {
    height: 500px;
    width: 1000px;
    padding: 20px 0;
    display: flex;
    position: relative;
    transition: all 0.5s ease-in-out;
    left: 0px;
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
 
.form-section-move {
    left: -500px;
}
 
.login-box,
.signup-box {
    height: 100%;
    width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0px 40px;
    padding-top: 50px;
}
 
.login-box {
    gap: 50px;
}
 
.signup-box {
    gap: 30px;
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
 
/* For Responsiveness of the page */
 
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
 
    .login,
    .signup {
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
    }
 
    .form-section-move {
        left: -300px;
    }
 
    .login-box,
    .signup-box {
        height: 100%;
        width: 300px;
        padding-top: 0;
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
 
    .login,
    .signup {
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
    }
 
    .login-box,
    .signup-box {
        height: 100%;
        width: 250px;
    }
 
    .ele {
        height: 50px;
        width: 220px;
        font-size: 15px;
    }
 
    .clkbtn {
        height: 50px;
        width: 130px;
        font-size: 19px;
    }
}   
</style>