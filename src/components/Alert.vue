<script setup lang="ts">
defineProps<{
  message: string
  type: 'warning' | 'error' | 'success'
}>()
</script>

<template>
  <div class="alert" :class="[`alert--${type}`]">
    {{ message }}
  </div>
</template>

<style scoped>
.alert {
  display: inline-block;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.alert--success {
  background: #00CC8F;
}

.alert--warning {
  background: #EF9815;
}

.alert--error {
  background: #EF1563;
}
</style>
