<template>
  
    <div class="ag-format-container">
        <div class="ag-courses_box" v-for="a in message" :key="a.id">
            <div class="ag-courses_item">
            <nuxt-link :to="'annonce/'+ a.id" class="ag-courses-item_link">
                <div class="ag-courses-item_bg">
                </div>

                <div class="ag-courses-item_title">
                  {{a.poste}} <br>
                <span class="ag-courses-item_date">{{ a.employeur_name }}</span>
                </div>
                
                <div class="ag-courses-item_date-box">
                Débute le :
                <span class="ag-courses-item_date">
                  {{ a.date_debut }}
                </span>
                </div>
              </nuxt-link>
            </div>    
        </div>
    </div>
  
</template>

<script setup>

const props = defineProps(['message'])
onBeforeMount(() => {
  formatAnnonceDates(props.message)
})


const formatterDateSQL = (dateSQL) => {
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

const formatAnnonceDates = (annoncesData) => {
    // Check if candidaturesData is an array
    if (Array.isArray(annoncesData)) {
        // Iterate over each candidature in the array
        for (const annonce of annoncesData) {
            // Check if the candidature has a date_candidature property
            if (annonce.date_debut) {
                // Format the date using formatterDateSQL
                annonce.date_debut = formatterDateSQL(annonce.date_debut);
            }
        }
    }
};
</script>



<style scoped>
.ag-format-container {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.ag-courses_box {
  /* display: -webkit-box;
  display: -ms-flexbox; */
  /* display: flex;
  align-items: flex-start; */
  /* flex-wrap: wrap; */
  width: 450px;
  padding: 50px 0;
}
.ag-courses_item {
  -ms-flex-preferred-size: calc(33.33333% - 30px);
  flex-basis: calc(33.33333% - 30px);

  margin: 0 15px 30px;

  overflow: hidden;

  border-radius: 28px;
}
.ag-courses-item_link {
  display: block;
  padding: 30px 20px;
  background-color: #696969;

  overflow: hidden;
  z-index: 0;
  position: relative;
}
.ag-courses-item_link:hover,
.ag-courses-item_link:hover .ag-courses-item_date {
  text-decoration: none;
  color: #FFF;
}
.ag-courses-item_link:hover .ag-courses-item_bg {
  -webkit-transform: scale(10);
  -ms-transform: scale(10);
  transform: scale(10);
}
.ag-courses-item_title {
  min-height: 87px;
  margin: 0 0 25px;

  overflow: hidden;

  font-weight: bold;
  font-size: 30px;
  color: #FFF;

  z-index: 2;
  position: relative;
}
.ag-courses-item_date-box {
  font-size: 18px;
  color: #FFF;

  z-index: 2;
  position: relative;
}
.ag-courses-item_date {
  font-weight: bold;
  color: #f9b234;

  -webkit-transition: color .5s ease;
  -o-transition: color .5s ease;
  transition: color .5s ease
}
.ag-courses-item_bg {
  height: 128px;
  width: 128px;
  background-color: #f9b234;

  z-index: 1;
  position: absolute;
  top: -75px;
  right: -75px;

  border-radius: 50%;

  -webkit-transition: all .5s ease;
  -o-transition: all .5s ease;
  transition: all .5s ease;
}
/* .ag-courses_item:nth-child(2n) .ag-courses-item_bg {
  background-color: #3ecd5e;
}
.ag-courses_item:nth-child(3n) .ag-courses-item_bg {
  background-color: #e44002;
}
.ag-courses_item:nth-child(4n) .ag-courses-item_bg {
  background-color: #952aff;
}
.ag-courses_item:nth-child(5n) .ag-courses-item_bg {
  background-color: #cd3e94;
} */
.ag-courses_item .ag-courses-item_bg {
  background-color: rgb(13 102 132);
}

.poste-color{
  color: #f9b234;
}

@media only screen and (max-width: 979px) {
  .ag-courses_item {
    -ms-flex-preferred-size: calc(50% - 30px);
    flex-basis: calc(50% - 30px);
  }
  .ag-courses-item_title {
    font-size: 24px;
  }
}

@media only screen and (max-width: 767px) {
  .ag-format-container {
    width: 96%;
  }

}
@media only screen and (max-width: 639px) {
.ag-courses_box {
  width: 750px;
}
  .ag-courses_item {
    -ms-flex-preferred-size: 100%;
    flex-basis: 100%;
  }
  .ag-courses-item_title {
    min-height: 72px;
    line-height: 1;

    font-size: 24px;
  }
  .ag-courses-item_link {
    padding: 22px 40px;
    z-index: 0;
  }
  .ag-courses-item_date-box {
    font-size: 16px;
  }
}
</style>