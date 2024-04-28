<template>

<div class="page-content">
    <div v-if="employeursData" class="employer-profile">
          <h2 class="profile-heading">{{ `${employeursData.nom}` }}</h2>
          <img v-if="!employeursData.url_logo" class="logo" src="../../assets/images/briefcase1.png" alt="logo">
          <CldImage v-else width="none" height="900" alt="logo" class="testt" aspect-ratio="1 / 1" :src="employeursData.url_logo" />
          <div class="profile-info">
            <div class="row">
              <div class="col-sm-4">
                <strong class="title">Ville:</strong>
              </div>
              <div v-if="employeursData.ville" class="col-sm-8">
                <span>{{ `${employeursData.ville}` }}</span>
              </div>
              <div v-else class="col-sm-8">
                <span> Pas encore renseigné </span>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-4">
                <strong class="title">Secteur d'activité:</strong>
              </div>
              <div v-if="employeursData.secteur" class="col-sm-8">
                <span>{{ `${employeursData.secteur}` }}</span>
              </div>
              <div v-else class="col-sm-8">
                <span> Pas encore renseigné </span>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-4">
                <strong class="title">Description:</strong>
              </div>
              <div v-if="employeursData.description" class="col-sm-8">
                <p class="descript" v-dompurify-html="employeursData.description"></p>
              </div>
              <div v-else class="col-sm-8">
                <span> Pas encore renseigné </span>
              </div>
            </div>
          </div>
        </div>
</div>

</template>

<script setup>
import axios from 'axios';
const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const employeursData = ref(null);
const nom = ref(null);

const hydrateUser = async () => {
  if(route.params.nom) {
    nom.value = route.params.nom;
    // console.log(nom.value)
    try  {
            const response = await axios.get(`${config.public.backend}/api/v1/employeurs/profil/${route.params.nom}`);
            employeursData.value = response.data.data[0];
            console.log(response.data.data[0]);
            console.log(employeursData.value);
    } catch(err) {
        console.log(err)
    }
  }
  else {
    router.push({path: `/`})
  }
    
};

onBeforeMount(async()=>{
      await hydrateUser();
    })
</script>

<style scoped>
.page-content {
    display: flex;
    justify-content: center;
}

.logo {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-bottom: 8px;
}

.testt {
    max-width: 45px;
    max-height: 45px;
    border-radius: 50%;
}
  .employer-profile {
  border: 1px solid transparent;
  background: rgb(244, 244, 244);
  border-radius: 4px;
  padding: 15px;
  margin: 0 13px;
  margin-bottom: 20px;
  margin-top: 45px;
  width: 80%;
  height: auto;
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

.descript {
    text-justify: distribute-all-lines;
}

.title {
    color: rgb(253, 140, 65);
    text-decoration: underline;
    margin-bottom: 4px;
    line-height: 47px;

}
</style>