<template>
  <div
    class="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center bg-no-repeat"
    style="background-image: url('/images/bg/login-bg.jpg')"
  >
    <div class="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />
    <div
      class="max-w-md w-full space-y-8 p-10 rounded-3xl shadow-2xl bg-white/85 backdrop-blur-xl border border-white relative z-10"
    >
      <div>
        <div class="flex justify-center">
          <div class="bg-indigo-100 p-3 rounded-full text-indigo-600">
            <svg
              class="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>
        <h2 class="mt-4 text-center text-3xl font-extrabold text-gray-900">
          {{ $config.public.appName }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 font-medium">
          {{ $t('auth.login.description') }}
        </p>
      </div>
      <div class="mt-8 space-y-4">
        <button
          class="w-full flex items-center justify-center px-4 py-3 border border-gray-200 shadow-sm text-sm font-semibold rounded-xl text-gray-700 bg-white/90 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          @click="loginWith('google')"
        >
          <svg 
            class="h-5 w-5 mr-3"
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {{ $t('auth.login_with_google') }}
        </button>
      </div>

      <p class="mt-6 text-center text-xs text-gray-500">
        {{ $t('footer.agree_terms') }}
        <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">
          {{ $t('footer.terms_of_use') }}
        </a>
        {{ $t('footer.and') }}
        <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">
          {{ $t('footer.privacy_policy') }}
        </a>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>

const { loginFromProvider } = useOauthService();

const loginWith = async (provider: string): Promise<void> => {
  await loginFromProvider(provider);
}
</script>