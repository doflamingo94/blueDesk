<template>
    <div id="error-message" class="error-message"></div>
    <div id="notif-message" class="notif-message"></div>
    <div class="user-profile">
        <div class="banner">
            <img src="../assets/images/background-original.jpg" alt="Banner Image" />
        </div>

        <div class="profile-picture">
            <img src="../assets/images/background-pexels-mo-eid-11592804.jpg" alt="Profile Picture" />
        </div>

        <h1><span v-if="candidatData">{{ `${candidatData.prenom}` }} {{ `${candidatData.nom}` }}</span> </h1>
        <div class="box-container">
            <div v-if="candidaturesData" class="box">
                <h2>Mes candidatures</h2>
                <ul v-for="candidature in candidaturesData" :key="candidature.date_candidature">
                  <li><nuxt-link :to="'annonce/'+ candidature.id_annonce">{{ `${candidature.poste}` }} chez {{ `${candidature.employeur_nom}` }}</nuxt-link> le {{ `${candidature.date_candidature}` }}  STATUT : {{ `${candidature.statut}` }}  <button v-if="candidature.statut != 'refusé' && candidature.statut != 'retenue'" @click="deleteCandidature(candidature.id_annonce)" >Annuler</button></li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ref } from 'vue';

const router = useRouter();
const authStore = useAuthStore();
const userId = authStore.getId;
const candidatData = ref(null);
const candidaturesData = ref(null);
const config = useRuntimeConfig();

console.log(userId)

if (!authStore.isLoggedIn) {
    router.push({ path: '/' })
} else {
    onBeforeMount(async () => {
        await Promise.all([hydrateUser(), candidatures()]);
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

const candidatures = async () => {
    try {
        const response = await axios.post(`${config.public.backend}/api/v1/candidats/candidatures`, {
            id_candidat: userId
        });

        candidaturesData.value = response.data.data;

        formatCandidatureDates(candidaturesData.value);

        console.log('Formatted Data:', candidaturesData.value);
    } catch (err) {
        console.log(err);
    }
};

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



</script>
<style scoped>
.box-container {
    width: 100%;
    display: flex;
    justify-content: center;
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
        top: 7rem;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50%;
        border: 4px solid #fff;
        overflow: hidden;
        width: 150px;
        height: 150px;
    }
}
</style>