<template>
        <div class="user-profile">
            <!-- Horizontal Banner -->
            <div class="banner">
              <img src="../assets/images/background-original.jpg" alt="Banner Image" />
            </div>
            
            <!-- User Profile Picture -->
            <div class="profile-picture">
              <img src="../assets/images/background-pexels-mo-eid-11592804.jpg" alt="Profile Picture" />
            </div>
            
            <h1><span v-if="employeursData">{{ `${employeursData.nom}` }}</span> </h1>
        </div>
        <div class="dashboard">
            <div class="blockA"></div>
            <div class="blockB"></div>
        </div>
        
</template>
<script setup>
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ref } from 'vue';
import { vMaska } from 'maska';

const router = useRouter();
const authStore = useAuthStore();
const userId = authStore.getId;
const employeursData = ref(null);

console.log(userId)

if(!authStore.isLoggedIn){
        router.push({path: '/'})
} else {
    onBeforeMount(()=>{
        hydrateUser();
    })
}

  const hydrateUser = async () => {
    try  {
        const response = await axios.get(`http://localhost:3001/api/v1/employeurs/${userId}`);
        employeursData.value = response.data.data[0];
        console.log(response.data.data[0]);
        console.log(employeursData.value);
    } catch(err) {
        console.log(err)
    }
  }
</script>
<style scoped>
.user-profile {
    text-align: center;
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
    top: 12rem; /* Adjust this value as needed */
    left: 13%;
    transform: translateX(-50%);
    border-radius: 50%;
    border: 4px solid #fff; /* Add styles for the border */
    overflow: hidden;
    width: 150px; /* Adjust the size of the profile picture */
    height: 150px;
  }

  .blockA, .blockB {
    background-color: white;
    width: 30rem;
    height: 70%;
    margin: auto;
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
    background-color: #f0f0f0; /* Add background color or styling as needed */
    padding: 10px;
    border-radius: 8px;
    display: inline-block;
  }
  
  .user-info h2 {
    font-size: 24px;
    margin: 0;
  }

  @media screen and (max-width: 900px) {
    .profile-picture {
        position: absolute;
        top: 7rem; /* Adjust this value as needed */
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50%;
        border: 4px solid #fff; /* Add styles for the border */
        overflow: hidden;
        width: 150px; /* Adjust the size of the profile picture */
        height: 150px;
      }
  }
</style>