<template>
    <div class="page-content">
        <!-- <FormLogin /> -->
        <LoginForm />
    </div>
</template>
<script>
import FormLogin from '../components/form-login.vue';

export default {
    components: { FormLogin }
}
</script>
<style scoped>
.page-content {
    min-height: 0;
    margin-top: 70px;
}
</style>