<template>
    <div v-if="!candidaturesData || candidaturesData.length === 0" class="page-content">
        <div class="header">
            <h1>Pas encore de candidature</h1>
        </div>
    </div>
    <div v-else class="page-content">
        <div v-if="candidaturesData[0].poste" class="header">
            <h1>Candidatures pour le poste de {{ `${candidaturesData[0].poste}` }} </h1>
        </div>
        <table v-if="candidaturesData">
            <caption>Candidats</caption>
            <thead>
                <tr>
                <th scope="col" v-for="header in headers" :key="header">{{ header }}</th>
                </tr>
            </thead>
            <tbody v-if="candidats.length > 0" v-for="candidature in paginatedCandidatures" :key="candidature.id">
                <tr @click="checkProfile(candidature.id, annonceId, candidature.statut)" v-if="candidature.statut === 'retenue'" class="retenue">
                    <td><div v-if="candidature.url_pp" class="profil-picture"><CldImage  :src="candidature.url_pp"/></div> <div class="profil-picture" v-else><img src="../../assets/images/briefcase2.png" alt=""></div></td>
                    <!-- <td><span class="only-small-mobile">Photo</span> <div class="profil-picture"><CldImage v-if="candidature.url_pp" :src="candidature.url_pp"/> <img v-else src="../../assets/images/briefcase2.png" alt=""></div></td> -->
                    <td><span class="only-small-mobile">Prénom</span> {{ `${candidature.prenom}` }}</td>
                    <td><span class="only-small-mobile">Nom</span> {{ `${candidature.nom}` }}</td>
                    <td><span class="only-small-mobile">Age</span> {{ `${ calculateAge(candidature.date_naissance) }` }} ans</td>
                    <td v-if="candidature.profession"><span class="only-small-mobile">{{ `${candidature.profession}` }}</span></td>
                    <td v-else><span class="only-small-mobile">Profession</span> -- </td>
                    <td><span class="only-small-mobile">Status</span> {{ `${candidature.statut}` }}</td>
                </tr>
                <tr @click="checkProfile(candidature.id, annonceId, candidature.statut)" v-else-if="candidature.statut === 'refusé'" class="refuse">
                    <td><div v-if="candidature.url_pp" class="profil-picture"><CldImage  :src="candidature.url_pp"/></div> <div class="profil-picture" v-else><img src="../../assets/images/briefcase2.png" alt=""></div></td>
                    <!-- <td><span class="only-small-mobile">Photo</span> <div class="profil-picture"><CldImage v-if="candidature.url_pp" :src="candidature.url_pp"/> <img v-else src="../../assets/images/briefcase2.png" alt=""></div></td> -->
                    <td><span class="only-small-mobile">Prénom</span> {{ `${candidature.prenom}` }}</td>
                    <td><span class="only-small-mobile">Nom</span> {{ `${candidature.nom}` }}</td>
                    <td><span class="only-small-mobile">Age</span> {{ `${ calculateAge(candidature.date_naissance) }` }} ans</td>
                    <td v-if="candidature.profession"><span class="only-small-mobile">{{ `${candidature.profession}` }}</span></td>
                    <td v-else><span class="only-small-mobile">Profession</span> -- </td>
                    <td><span class="only-small-mobile">Status</span> {{ `${candidature.statut}` }}</td>
                </tr>
                <tr @click="checkProfile(candidature.id, annonceId, candidature.statut)" v-else>
                    <td><div v-if="candidature.url_pp" class="profil-picture"><CldImage  :src="candidature.url_pp"/></div> <div class="profil-picture" v-else><img src="../../assets/images/briefcase2.png" alt=""></div></td>
                    <!-- <td><span class="only-small-mobile">Photo</span> <div class="profil-picture"><CldImage v-if="candidature.url_pp" :src="candidature.url_pp"/> <img v-else src="../../assets/images/briefcase2.png" alt=""></div></td> -->
                    <td><span class="only-small-mobile">Prénom</span> {{ `${candidature.prenom}` }}</td>
                    <td><span class="only-small-mobile">Nom</span> {{ `${candidature.nom}` }}</td>
                    <td><span class="only-small-mobile">Age</span> {{ `${ calculateAge(candidature.date_naissance) }` }} ans</td>
                    <td v-if="candidature.profession"><span class="only-small-mobile">{{ `${candidature.profession}` }}</span></td>
                    <td v-else><span class="only-small-mobile">Profession</span> -- </td>
                    <td><span class="only-small-mobile">Status</span> {{ `${candidature.statut}` }}</td>
                </tr>
            </tbody>
        </table>
        <Paginator
          v-if="candidaturesPage.length > 15"
          v-model:first="first"
          :rows="10"
          :totalRecords="candidaturesPage.length"
        />
        <!-- <div v-if="candidaturesData" class="candidatures-block">
            <ul v-for="candidature in paginatedCandidatures" :key="candidature.id">
                <li @click="checkProfile(candidature.id, annonceId, candidature.statut)"> {{ `${candidature.prenom}` }}  {{ `${candidature.nom}` }} {{ `${ calculateAge(candidature.date_naissance) }` }} ans</li>
            </ul>
            <Paginator
            v-if="candidaturesPage.length > 15"
            v-model:first="first"
            :rows="10"
            :totalRecords="candidaturesPage.length"
            />
        </div> -->
        <!-- <div class="profil-picture"><CldImage v-if="candidature.url_pp" :src="candidature.url_pp"/> <img v-else src="../../assets/images/briefcase2.png" alt=""></div> -->
    </div>
</template>
    
<script setup>
import { useAuthStore } from '~/store/auth';
import { useProfile } from '~/store/profile';
import axios from 'axios';
const route = useRoute();
const router = useRouter();
let annonceId = route.params.id; 
const candidaturesData = ref(null);
const profileStore = useProfile();
const authStore = useAuthStore();
const userId = authStore.getId;
console.log(userId);
const config = useRuntimeConfig();
const candidaturesPage = ref([]);
const first = ref(0);
const candidats = ref([]);

const candidatures = async () => {
    try {
            const response = await axios.post(`${config.public.backend}/api/v1/annonces/candidatures`, {
                id_annonce: annonceId,
                id_employeur: userId
            });
            if(response.data.data){
               candidaturesData.value = response.data.data;
               candidats.value = candidaturesData.value;
               candidaturesPage.value = candidaturesData.value;
            }
            else {
                console.log('Aucune candidature');
            }
            
        } catch (err) {
            console.log(err);
        }
}

const paginatedCandidatures = computed(() => {
        const startIndex = first.value;
        const endIndex = startIndex + 15; // Change 15 to the number of jobs per page
        return candidaturesPage.value.slice(startIndex, endIndex);
    });

onBeforeMount(async ()=>{
    await candidatures();
    })

function calculateAge(birthdate) {
    var birthDate = new Date(birthdate);

    var currentDate = new Date();

    var age = currentDate.getFullYear() - birthDate.getFullYear();

    if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
            currentDate.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}

const checkProfile = (profileId, annonceId, statut) => {
    profileStore.setProfile(profileId);
    profileStore.setAnnonce(annonceId);
    profileStore.setStatus(statut);
    router.push('/profile-candidat');
}

const headers = ['Photo', 'Prénom', 'Nom', 'Age', 'Profession', 'Status'];
    
</script>
    
<style scoped>

.header, .candidatures-block{
    padding-top: 30px;
    display: flex;
    justify-content: center;
}

.candidatures-block{
    flex-direction: column;
    align-items: center;
}

ul{
    list-style: none;
}
.profil-picture {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    border: 4px solid #fff;
    overflow: hidden;
    width: 70px;
    height: 70px;
    cursor: pointer;
}

.profil-picture img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
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
    background-color: white;
    border: 1px solid #ddd;
    padding: .35em;
    animation: 0.5s ease-in-out;
  }
  
  table th,
  table td {
    padding: .625em;
    text-align: center;
  }

  table td {
  vertical-align: middle;
  animation: 0.6s;
  cursor: pointer;
}

table tbody tr:hover {
  transform: scale(1.05); /* Adjust the scale factor as needed */
  transition: transform 0.5s ease-in-out; /* Adjust the transition duration and timing function as needed */
}
table th {
    font-size: .85em;
    letter-spacing: .1em;
    text-transform: uppercase;
}

  .only-small-mobile {
  display: none;
}

.retenue {
    background-color: rgb(127, 232, 127);
    color: white;
}

.refuse {
    background-color: rgb(255, 138, 138);
    color: white;
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


</style>