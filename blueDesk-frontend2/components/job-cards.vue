<template>

    <div  class="jobs">
        <div v-for="a in message" :key="a.id" class="job">
            <img v-if="!a.logo" class="logo" src="../assets/images/briefcase1.png" alt="logo">
            <CldImage v-else width="none" height="900" alt="logo" class="testt" aspect-ratio="1 / 1" :src="a.logo" />
            
            <h3 class="job-title" name="poste">{{a.poste}}</h3>
            <div class="details" name="debut">
                Débute le :
                <span class="ag-courses-item_date">
                  {{ a.date_debut }}
                </span>
            </div>
            <nuxt-link :to="'/annonce/'+ a.id"><Button class="test-button">En savoir plus</Button></nuxt-link>
            <span class="open-positions" name="employeur">{{ a.employeur_name }}</span>
        </div>
    </div>

</template>

<script setup>

const props = defineProps(['message'])
onBeforeMount(() => {
  formatAnnonceDates(props.message)
})


const formatterDateSQL = (dateSQL) => {
    var dateObj = new Date(dateSQL);

    var jour = dateObj.getDate();
    var mois = dateObj.getMonth() + 1; 
    var annee = dateObj.getFullYear();

    jour = (jour < 10) ? '0' + jour : jour;
    mois = (mois < 10) ? '0' + mois : mois;

    var dateFormatee = jour + '/' + mois + '/' + annee;

    return dateFormatee;
}

const formatAnnonceDates = (annoncesData) => {
    if (Array.isArray(annoncesData)) {
        for (const annonce of annoncesData) {
            if (annonce.date_debut) {
                annonce.date_debut = formatterDateSQL(annonce.date_debut);
            }
        }
    }
};
</script>

<style scoped>
.logo {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-bottom: 8px;
}

.testt {
    max-width: 45px;
    max-height: 45px;
}

.job-title {
    margin: 0;
    padding: 10px 0;
    font-size: 20px;
}
.jobs {
    margin: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

.job {
    display: flex;
    flex-direction: column;
    background-color: rgb(255, 255, 255);
    box-shadow: 0 4px 24px -8px rgba(2, 48, 71, 0.2);
    padding: 24px;
    border-radius: 16px;
    transition: all 400ms ease;
    position: relative;
    margin: 20px;
}

.job:hover {
    transform: scale(1.03);
}

.open-positions {
    position: absolute;
    top: 40px;
    left: 77px;
    color: rgb(0, 0, 0);
}

.details {
    margin-top: 6px;
    font-size: 14px;
    line-height: 1.8;
    flex: 1;
}

.details-button {
    text-decoration: none;
    border: 1px solid #023047;
    color: black;
    padding: 8px 16px;
    border-radius: 8px;
}

.test-button {
width: auto;
display: flex;
justify-content: center;
margin-top: 8px;
border: none;
background-color: rgb(24, 135, 246);
}

.ag-courses-item_date {
  font-weight: bold;
  color: #349af9;

  -webkit-transition: color .5s ease;
  -o-transition: color .5s ease;
  transition: color .5s ease
}

@media (max-width: 940px) {
    .jobs {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 640px) {
    .jobs {
        grid-template-columns: 1fr;
    }
}
</style>