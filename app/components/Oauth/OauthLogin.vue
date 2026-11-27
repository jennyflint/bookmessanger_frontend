<template>
  <div
    class="auth-half w-full min-h-screen md:min-h-0 md:flex-1 md:h-full overflow-y-auto"
  >
    <div
      class="auth-content p-6 sm:p-10 flex items-center justify-center h-full min-h-screen"
    >
      <div
        class="comic-card max-w-md w-full space-y-8 p-8 sm:p-10 relative z-10 bg-comic-surface"
      >
        <div>
          <div class="flex justify-center mb-8">
            <div
              class="system-badge inline-flex items-center gap-2 px-4 py-2 text-[13px] uppercase tracking-[0.5px]"
            >
              <span class="text-lg leading-none">✨</span>
              {{ $t("auth.login.ai_transformation") }}
            </div>
          </div>

          <div class="flex items-center justify-center gap-4 mb-8">
            <div class="comic-icon comic-muted bg-[#ff6b6b] transform -rotate-3 text-white">
              <svg
                class="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            <div class="text-comic-ink animate-pulse">
              <svg
                class="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>

            <div class="comic-icon comic-muted bg-[#4ecdc4] transform rotate-3 text-white">
              <svg
                class="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
          </div>

          <h2
            class="mt-4 text-center text-3xl text-comic-ink"
            style="text-shadow: 1px 1px 0px rgb(78 205 196 / var(--comic-title-glow, 1))"
          >
            {{ $config.public.appName }}
          </h2>

          <div class="mt-4 text-center">
            <p class="text-[17px] text-comic-ink leading-snug">
              {{
                $t("auth.login.hero.title", { action: $t("auth.login.hero.live_chat") })
              }}
            </p>
            <p class="mt-3 text-[14px] text-comic-ink/70">
              {{ $t("auth.login.description") }}
            </p>
          </div>
        </div>

        <div class="mt-8">
          <button
            class="comic-btn w-full flex items-center justify-center px-4 py-3 bg-comic-surface text-comic-ink text-[17px] transition-all"
            @click="loginWith('google')"
          >
            <svg
              class="h-6 w-6 mr-3"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
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
            {{ $t("auth.login_with_google") }}
          </button>
        </div>

        <p class="mt-6 text-center text-[12px] text-comic-ink/80">
          {{ $t("footer.agree_terms") }}<br >
          <a
            href="#"
            class="text-[#ff6b6b] hover:underline decoration-2 underline-offset-2"
          >
            {{ $t("footer.terms_of_use") }}
          </a>
          {{ $t("footer.and") }}
          <a
            href="#"
            class="text-[#4ecdc4] hover:underline decoration-2 underline-offset-2"
          >
            {{ $t("footer.privacy_policy") }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { loginFromProvider } = useOauthService();

const loginWith = async (provider: string): Promise<void> => {
  await loginFromProvider(provider);
};
</script>

<style scoped>
.auth-half {
  font-family: var(--font-comic);
  font-weight: 800;
  background-color: rgb(var(--comic-bg));
  background-image: radial-gradient(var(--comic-dot) 3px, transparent 3px);
  background-size: 30px 30px;
  color: rgb(var(--comic-ink));
  -webkit-font-smoothing: antialiased;
}

.comic-card {
  border: 2px solid rgb(var(--comic-line));
  border-radius: 24px;
  box-shadow: 8px 8px 0px 0px rgb(var(--comic-shadow));
}

.system-badge {
  background: rgb(var(--comic-soft));
  border: 2px dashed rgb(78 205 196 / 0.6);
  border-radius: 16px;
  color: rgb(var(--comic-ink));
}

.comic-icon {
  padding: 14px;
  border-radius: 18px 18px 18px 4px;
  border: 2px solid rgb(var(--comic-line));
  box-shadow: 4px 4px 0px 0px rgb(var(--comic-shadow));
}

.comic-icon:last-child {
  border-radius: 18px 18px 4px 18px;
}

.comic-btn {
  border: 2px solid rgb(var(--comic-line));
  border-radius: 16px;
  box-shadow: 4px 4px 0px 0px rgb(var(--comic-shadow));
}

.comic-btn:hover {
  background-color: rgb(var(--comic-soft));
}

.comic-btn:active {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px 0px rgb(var(--comic-shadow));
}
</style>
