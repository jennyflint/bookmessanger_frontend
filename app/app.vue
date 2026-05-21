<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

const { connect } = useNotificationSocket()

onMounted(() => {
  connect(() => {
   
  })
})
</script>
