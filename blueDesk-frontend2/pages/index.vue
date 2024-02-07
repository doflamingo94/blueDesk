<template>
    <div class="basic-container">
       <div class="titles">
            <h1>Rechercher un emploi aux Comores</h1>
       </div> 
    </div>
    <CldUploadWidget
      v-slot="{ open }"
      uploadPreset="candidat-pp"
      :options="{ publicId: 'test/yopr0yooj9p1xrcxceln' }"
      @upload="handleSuccess"
    >
        <button type="button" @click="open">Upload an Image</button>
    </CldUploadWidget>
    <div class="container">
        <SearchBar @clicked="handleSearch" />
    </div>
    <JobCard :message="annonces" />
</template>

<script setup>
import axios from 'axios';
   const config = useRuntimeConfig();
   const router = useRouter();
   const response = await axios.get(`${config.public.backend}/api/v1/annonces`);
   console.log('Khaled', config.public.backend)
   const annonces = response.data.data;

   const handleSuccess = (test, tt) => {
    console.log(test._rawValue.info.public_id, tt)
   }

   const handleSearch = (searchValue) => {
  // Use the search value and navigate to another route
        if(searchValue.length > 0){
            const routePath = `/jobs/${searchValue}`;
            router.push(routePath);
        } else {
            const routePath = `/jobs/jobs`;
            router.push(routePath);
        }
   };

</script>

<style scoped>
.titles{
    background-color: white;
    width: auto;
    border-radius: 80px;
    padding: 0px 15px 15px 15px;
    margin-top: 22px;
    color: rgb(13 102 132);
}
h1, h2{
    text-align: center;
}
h1 {
    padding-top: 19px;
}
h2{
    padding-top: 30px;
}
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
.basic-container{
    display: flex;
    justify-content: center;
}
</style>