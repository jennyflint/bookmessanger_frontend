<template>
  <div
    class="main-container relative flex flex-col md:flex-row-reverse w-full min-h-screen md:h-screen md:overflow-hidden m-0 p-0 bg-login"
  >
    <div class="absolute top-4 right-4 z-50 flex items-center gap-2">
      <ThemeSwitcher />
      <LanguageSwitcher />
    </div>

    <OauthLogin />

    <LandingAnimatedChat />
  </div>
</template>

<script lang="ts" setup>

</script>

<style>
.bg-login {
  background-color: rgb(var(--comic-bg));
  
  background-image: 
    radial-gradient(circle at 50% 50%, transparent 30%, var(--comic-vignette) 100%),
    radial-gradient(var(--comic-dot) 3px, transparent 3px);
  
  background-size: 100% 100%, 30px 30px;

  background-position: center center, 0 0;
  
  color: rgb(var(--comic-ink));
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