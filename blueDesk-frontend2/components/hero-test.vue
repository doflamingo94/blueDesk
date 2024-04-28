<template>
  <div>
    <main class="main-container">
      <img src="~/assets/img/shape.png" alt="shape" class="shapeImg" />
      <section class="content-area">
        <div class="left">
          <div class="big-tile">
            <h1>Saisissez l'oportunité</h1>
            <h1>Travaillez aux comores</h1>
          </div>
          <p>
            Sur Kazi, nous mettons en relation les rechercheurs d'emploi comorien du monde entier avec de nombreux employeurs aux comores.
          </p>
          
          <!-- <div class="cta" @click="getStarted">Get started</div> -->
          <div class="containerxx">
            <SearchBar @clicked="handleSearch" />
          </div>
        </div>
        <div class="right">
          <img src="~/assets/img/person.png" alt="person img" class="personImg" />
        </div>
        
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const config = useRuntimeConfig();
const router = useRouter();
const jobs = ref([]);

const sidebarVisible = ref(false);

const showSidebar = () => {
  sidebarVisible.value = true;
};

const hideSidebar = () => {
  sidebarVisible.value = false;
};

const getStarted = () => {
  // Handle 'Get started' button click event
};

const handleSearch = (searchValue) => {
        if(searchValue.length > 0){
            const routePath = `/jobs/${searchValue}`;
            router.push(routePath);
        } else {
            const routePath = `/jobs/kazisearch`;
            router.push(routePath);
        }
   };
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap");

:root {
    --backgroundColor: #f1f8fc;
    --mainColor: #3cbff7;
    --btnColor: #66bbf4;
    --btnHoverColor: #5bacdf;
    --headTextColor: #0b0b0b;
    --textColor: #8e8e8e;
}

*,
*::before,
*::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: "Poppins", sans-serif;
}

.containerxx {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 130px;
    margin-left: 70px;
    z-index: 11;
    padding: .9rem 1.7rem;
}

.main-container {
    margin-top: 63px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    position: relative;
}

.shapeImg {
    display: none;
    width: 800px;
    position: absolute;
    bottom: -380px;
    left: -180px;
    opacity: 0.1;
}

header .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-block: 1.9rem;
    margin-inline: 3.5rem;
}


.logo {
    display: flex;
}

.logo img {
    width: 40px;
    margin-right: .5rem;
    cursor: pointer;

}

.logo h3 {
    font-size: 1.55rem;
    margin-top: .5rem;
    text-transform: 700;
}

.links .main-links {
    display: flex;
    list-style: none;
    align-items: center;
}

.main-links a {
    display: inline-block;
    text-decoration: none;
    color: var(--textColor);
    margin-left: 5.5rem;
    transition: .3s;
}

.main-links a:hover {
    color: var(--btnHoverColor);
    transform: scale(1.05);
}

.btn {
    display: inline-block;
    background-color: var(--btnColor);
    color: #f1f1f1 !important;
    padding: .9rem 1.7rem;
    border-radius: 18px;
    transition: .3s;
    cursor: pointer;
    margin-right: 4.5rem;
}

.btn:hover {
    background-color: var(--btnHoverColor);
    transform: scale(1) !important;
}


/* content Area */
.content-area {
    display: flex;
    margin-inline: 3.5rem;
    justify-content: space-between;
    align-items: center;
    margin-top: 49px;
}

.left {
    position: relative;
    bottom: 50px;
}

.left .big-tile {
    font-size: 2rem;
    line-height: 1.4;
    color: var(--headTextColor);
}

.left p {
    max-width: 600px;
    line-height: 2.1;
    margin-block: 2rem;
    color: var(--textColor);
    font-size: 1.1rem;
}

.cta {
    display: inline-block;
    background-color: var(--btnColor);
    color: #f1f1f1 !important;
    padding: .9rem 1.7rem;
    border-radius: 18px;
    transition: .3s;
    cursor: pointer;
}

.cta:hover {
    background-color: var(--btnHoverColor);
    transform: scale(1) !important;
}

.right {
    width: 48%;
    position: relative;
    right: 16px;
    z-index: 10;
}

.personImg {
    width: 131%;
    transform: translate(15%, 0);
}

.close {
    position:absolute;
    right: 26px;
    top: 35px;
    cursor: pointer;
    display: none;
}

.menu {
    position:absolute;
    right: 30px;
    top: 35px;
    cursor: pointer;
    transition: transform 0.3s ease;
    display: none;
}

.sidebar {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 999;
    height: 100vh;
    width: 250px;
    display: none;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1.5rem;
    padding-top: 0.8rem;
    backdrop-filter: blur(60px);
    box-shadow: rgba(0, 0, 0, 0.1);
    color: var(--textColor);
    list-style-type: none;
}

.sidebar li {
    margin-left: 2.85rem;
    margin-top: 1.99rem;
    transition: .3s;
}

.sidebar a {
    display: block;
    color: #16252e;
    text-decoration: none;
    color: var(--textColor);
    transition: .3s;
}

.sidebar a:hover {
    color: var(--btnHoverColor);
    transform: scale(1.05);
}

.sidebar .btn-1 {
    border-radius: 16px;
    padding: .8rem 1.55rem;
    background-color: var(--btnColor);
    color: var(--textColor);
    backdrop-filter: blur(10px);
    transition: .3s;
    box-shadow: rgba(0, 0, 0, 0.1);
}

.sidebar .btn-1:hover {
    background-color: var(--btnHoverColor);
    color: var(--headTextColor);
    transform: scale(1.05);
}


/* Adding media query */

@media screen and (max-width: 768px) {

    header .container {
        padding-block: 1.9rem;
        margin-inline: 1.5rem;
    }

    .containerxx {
        margin-left: 24px;
        z-index: 12;
        padding: .9rem 1.7rem;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 440px;
    }
    
    .links .main-links {
        display: none;
    }

    .logo {
        position: relative;
        right: 0;
    }
    
    .logo img {
        width: 36px;
    }
    
    .logo h3 {
        font-size: 1.2rem;
        margin-top: .5rem;
        text-transform: 400;
    }

    .content-area {
        padding-block: 1rem;
        margin-left: 0;
        display: flex;
        flex-direction: column;
    }

    .left {
        margin-top: 3rem;
        padding: 0 1.55rem;
    }

    .left .big-tile {
        font-size: 1.1rem;
    }

    .left p {
        font-size: 0.9rem;
        line-height: 2;
    }

    .menu {
        display: flex;
    }

    .close {
        display: block;
    }

    .right {
        width: 300px;
        right: 65px;
    }
}

@media screen and (max-width: 416px) {
  .containerxx {
    top: 504px;
  }
}

@media screen and (max-width: 377px) {
  .containerxx {
    top: 541px;
  }
}
</style>