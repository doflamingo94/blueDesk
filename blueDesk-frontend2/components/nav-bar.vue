<template>
    <nav>
      <div class="logo"><NuxtLink class="linkRoute" to="/">Blue <span class="blue">Desk</span></NuxtLink></div>
      <div :class="{ navlinks: true, 'navlinks--visible': showNavlinks }">
        <ul v-if="!authStore.isAuthenticated">
          <div @click="toggleNavlinks" class="test"><li><nuxt-link to="/">Jobs</nuxt-link></li></div>
          <div @click="toggleNavlinks" class="test"><li><nuxt-link to="/">A propos</nuxt-link></li></div>
          <div @click="toggleNavlinks" class="test" ><li><nuxt-link to="/login">Se connecter</nuxt-link></li></div>
        </ul>
        <ul v-else>
          <div @click="toggleNavlinks" class="test"><li><nuxt-link to="/">Jobs</nuxt-link></li></div>
          <div @click="toggleNavlinks" class="test"><li><nuxt-link to="/">A propos</nuxt-link></li></div>
          <div @click="toggleNavlinks" class="test"><li><nuxt-link :to="`/${authStore.getRole}`">Mon compte</nuxt-link></li></div>
          <div @click="disconnect" class="test" ><li><nuxt-link to="/login">Deconnexion</nuxt-link></li></div>
        </ul>
      </div>
      <span class="mask-demo" @click="toggleNavlinks"><button>X</button></span>
    </nav>
</template>

<style scoped>

  a{
    color: white !important;
  }

  a:hover{
    color: blue !important;
  }
    .blue{
    color: rgb(13 102 132);
    background-color: white;
    padding: 0px 9px; 
    border-radius: 8px;
  }
  .linkRoute {
    text-decoration: none;
    color: inherit;
  }
  nav{
    /* position: absolute; */
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
    align-items: center;
    /* backdrop-filter: blur(16px); */
    /* box-shadow: 0 25px 20px -20px #252525; */
    background-color: rgb(13 102 132);
    transition: 0.2s;
  }
  nav:hover{
    background-color: rgb(255, 255, 255);
  }
  nav:hover .mask-demo{
    color: rgb(13 102 132);
  }
  nav:hover ul{
    color: rgb(18, 18, 18);
  }
  nav:hover .mask-demo{
    color: black;
  }
  nav:hover .blue{
    background-color: rgba(255, 255, 255, 0);
    padding: 0; 
    border-radius: 0;
  }
  nav:hover .logo a{
    color: rgb(14, 14, 14) !important;
  }
  nav:hover ul .test a {
    color: black !important;
  }
  .test:hover li{
    font-size: larger;
    font-weight: bolder;
    color: rgb(13 102 132);
    background-color: white;
  }

  .test:hover li, a{
    color: rgb(13 102 132);
  }
  .test{
    margin: 0px 0px;
    padding: 0px;
  }
  .logo{
    font-size: 2em;
    font-weight: bold;
    color: rgb(255, 254, 254);
      transition: all 0.2s ease-in-out;
    cursor: pointer;
  }
  nav ul{
    list-style: none;
    display: flex;
    color: rgb(255, 255, 255);
  }
  nav ul li{
    margin: 0 25px;
    transition: 0.3s;
    cursor: pointer;
  }
  .mask-demo{
    display: none;
  }
  @media (max-width: 900px) {
    .logo{
        padding-left: 20px;
    }
    .mask-demo{
      display: block;
      cursor: pointer;
      z-index: 54;
      color: rgb(255, 255, 255);
    }
    nav:hover .mask-demo{
      /* padding: 0; */
      color : rgb(13 102 132);
    }
    .navlinks{
      position: fixed;
      z-index: 1;
      top: 0;
      left: 0;
      background-color: rgba(254, 254, 254, 0);
      backdrop-filter: blur(20px);
      width: 100%;
      height: 100vh;
      display: none;
      align-items: center;
      justify-content: center;
      transform: translateX(-100%);
      transition: transform 0.7s ease-in-out;
    }
    .navlinks--visible {
      transform: translateX(0);
      display: flex;
    }
    .navlinks ul{        
      display: flex;
      flex-direction: column;
    }
    .navlinks ul li{
      margin: 25px 0;
      padding: 3px;
      border-radius: 15px;
      font-size: 2.2em;
      background-color:rgb(13 102 132);
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      transition: 0.6s;
      cursor: pointer;
    }

    .test:hover li{
      margin: 25px 0;
      padding: 3px;
      border-radius: 15px;
      font-size: 2.2em;
      background-color:rgb(255, 255, 255);
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgb(13 102 132);
      transition: 0.6s;
      cursor: pointer;
    }

    .navlinks ul .test{
      margin: 3px 0;
      padding: 15px;
      transition: 0.5s;
    }
  }
  </style>
  
<script setup>
  import { useAuthStore } from '../store/auth'; 
  import { useRouter } from '#vue-router';  

  const authStore = useAuthStore();
  const router = useRouter();

  const disconnect = () => {
    authStore.$reset();
    if (window.innerWidth > 900){
      console.log('bonjjourrrrrr')
    }
    else if (window.innerWidth < 901) {
      showNavlinks.value = !showNavlinks.value;
    }
    router.push('/');
  }

  const showNavlinks = ref(false);

  const toggleNavlinks = () => {
    if (window.innerWidth > 900){
      console.log('bonjjourrrrrr')
    }
    else if (window.innerWidth < 901) {
      showNavlinks.value = !showNavlinks.value;
    }
  };
</script>
