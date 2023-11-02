<template>
  <!-- <video ref="videoRef" autoplay muted loop>
        <source src="./assets/images/testBack.mp4" type="video/mp4">
    </video> -->
  <div>
    <NavBar />
    <NuxtPage />
    <FooterDiv />
  </div>
</template>

<script setup>
//   import { ref, onMounted } from 'vue'

// const videoRef = ref(null);

// onMounted(() => {
// const video = videoRef.value;

// if (video) {
//   video.style.position = 'fixed';
//   video.style.zIndex = '-1';
//   video.style.objectFit = 'cover';
// }
// });
</script>

<style>
FooterDiv {
  position: absolute;
  bottom: 0;
}
/* video{
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;   
} */

</style>
