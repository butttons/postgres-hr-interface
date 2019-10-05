<template lang="pug">
  .text-sm.bg-gray-400.text-white.p-1.rounded-sm SELECT
</template>
<script lang="ts">
  import Vue from 'vue';
  export default Vue.extend({
    name: 'z-chip',
    props: {
      label: String,
      value: String,
    },
  });
</script>