
<template>
    <div class="container">
        <SearchBar />
    </div>
    <JobCard :message="annonces" />
</template>

<script setup>
   const { data: responses } = await useFetch('https://13.39.156.186:3001/api/v1/annonces')
   const annonces = responses._rawValue.data
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>