<template>
  <div
    class="main-container flex flex-col md:flex-row-reverse w-full min-h-screen md:h-screen md:overflow-hidden m-0 p-0 bg-login"
  >
    <OauthLogin />

    <LandingAnimatedChat />
  </div>
</template>

<script lang="ts" setup>

</script>

<style>
.bg-login {
  background-color: #ffe680;
  
  background-image: 
    radial-gradient(circle at 50% 50%, transparent 30%, rgba(200, 140, 0, 0.25) 100%),
    radial-gradient(rgba(255, 255, 255, 0.7) 3px, transparent 3px);
  
  background-size: 100% 100%, 30px 30px;

  background-position: center center, 0 0;
  
  color: #4b2c20;
  -webkit-font-smoothing: antialiased;
  animation: moveDots 40s linear infinite;
}

@keyframes moveDots {
  0% {
    background-position: center center, 0 0;
  }
  100% {
    background-position: center center, 300px 300px;
  }
}
</style>