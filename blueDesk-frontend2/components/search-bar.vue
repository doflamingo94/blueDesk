<template>
    <div class="box">
        <input v-model="searchValue" type="text" placeholder="Comptable">
        <button @click="handleSearch">Rechercher</button>
    </div>
</template>

<script setup>
const emit = defineEmits(["clicked"])
const searchValue = ref('');

const handleSearch = () => {
  // Emit the search value to the parent
  emit('clicked', searchValue.value);
};
</script>

<style scoped>
.mask-demo{
    color: black;
}
.box{
    margin-top: 50px;
    height: 80px;
    display: flex;
    cursor: pointer;
    padding: 10px 20px;
    background: white;
    border-radius: 50px;
    border: 1px solid rgb(241, 241, 241);
    align-items: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0, 0.3);
    cursor: pointer;
    transition: 0.5s ease-in-out;
}
.box:hover {
    box-shadow:  10px 25px rgb(102, 206, 255);
}
.box:hover input{
    width: 150px;
}
.box input::placeholder{
    color: rgb(202, 202, 202);
}
.box input{
    width: 0;
    outline: none;
    border: none;
    transition: 0.8s;
    background: transparent;
    font-size: 17px;
}
.box button {
    text-decoration: none;
    color: rgb(255, 255, 255);
    font-size: 17px;
    background-color: rgb(102, 206, 255);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 13px;
    border-radius: 35px;
    border: none;
    cursor: pointer;
}

@media only screen and (max-width: 979px) {
       .box input{
        width: 150px;
    }
}

</style>