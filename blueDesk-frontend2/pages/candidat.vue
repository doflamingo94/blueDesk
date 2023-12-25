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
        <div v-if="candidaturesData" class="box">
            <h2>Mes candidatures</h2>
            <ul v-for="candidature in candidaturesData" :key="candidature.date_candidature">
              <li><nuxt-link :to="'annonce/'+ candidature.id_annonce">{{ `${candidature.poste}` }} chez {{ `${candidature.employeur_nom}` }}</nuxt-link> le {{ `${candidature.date_candidature}` }}  STATUT : {{ `${candidature.statut}` }}  <button @click="deleteCandidature(candidature.id_annonce)" >Annuler</button></li>
            </ul>
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
const candidaturesData = ref(null)

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
        const response = await axios.get(`http://13.39.156.186:3001/api/v1/candidats/${userId}`);
        candidatData.value = response.data.data[0];
        console.log(response.data.data[0]);
        console.log(candidatData.value);
    } catch (err) {
        console.log(err)
    }
}

const candidatures = async () => {
    try {
        const response = await axios.post('http://13.39.156.186:3001/api/v1/candidats/candidatures', {
            id_candidat: userId
        });

        candidaturesData.value = response.data.data;

        // Format dates in the candidaturesData array
        formatCandidatureDates(candidaturesData.value);

        console.log('Formatted Data:', candidaturesData.value);
    } catch (err) {
        console.log(err);
    }
};

const deleteCandidature = async (annonceId) => {
    try {
                const response = await axios.post('http://13.39.156.186:3001/api/v1/candidats/deleteCandidature', {
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
    // Convertir la chaîne de date SQL en objet Date
    var dateObj = new Date(dateSQL);

    // Extraire le jour, le mois et l'année
    var jour = dateObj.getDate();
    var mois = dateObj.getMonth() + 1; // Les mois commencent à partir de zéro
    var annee = dateObj.getFullYear();

    // Ajouter un zéro au jour et au mois si nécessaire
    jour = (jour < 10) ? '0' + jour : jour;
    mois = (mois < 10) ? '0' + mois : mois;

    // Formater la date en jj/mm/aaaa
    var dateFormatee = jour + '/' + mois + '/' + annee;

    return dateFormatee;
}

const formatCandidatureDates = (candidaturesData) => {
    // Check if candidaturesData is an array
    if (Array.isArray(candidaturesData)) {
        // Iterate over each candidature in the array
        for (const candidature of candidaturesData) {
            // Check if the candidature has a date_candidature property
            if (candidature.date_candidature) {
                // Format the date using formatterDateSQL
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

.blockA {
    background-color: white;
    width: auto;
    height: auto;
    margin: auto;
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

    .login {
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

    .login-box {
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

    .login {
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

    .login-box {
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