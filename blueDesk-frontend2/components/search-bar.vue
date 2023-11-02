<template>
    <div class="box">
        <input type="text" placeholder="Comptable">
        <a href="/">Rechercher</a>
    </div>
</template>

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
    align-items: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0, 0.3);
    cursor: pointer;
}
.box:hover input{
    width: 150px;
}
.box input{
    width: 0;
    outline: none;
    border: none;
    font-weight: bolder;
    transition: 0.8s;
    background: transparent;
    font-size: 17px;
}
.box a {
    text-decoration: none;
    color: rgb(255, 255, 255);
    font-size: 17px;
    background-color: rgb(13 102 132);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 13px;
    border-radius: 35px;
}

@media only screen and (max-width: 979px) {
       .box input{
        width: 150px;
    }
}

</style>