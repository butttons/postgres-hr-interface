<template lang="pug">
  .p-2.bg-white.m-3.rounded-lg
    .text-gray-800.font-display.mb-1 {{ title}}
    .font-body
      slot
</template>
<script lang="ts">
  import Vue from 'vue';
  export default Vue.extend({
    name: 'z-card',
    props: {
      title: String,
    },
  });
</script>