<script setup lang="ts">
import { onMounted } from 'vue'

const { connect } = useNotificationSocket()

onMounted(() => {
  connect(() => {
   
  })
})
</script>