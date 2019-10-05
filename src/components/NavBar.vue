<template lang="pug">
  nav.flex.justify-between.items-center.bg-primary-500(role='navigation' aria-label='main navigation')
    .text-lg.text-white.p-3.font-display Postgres
      strong HR
    div.mr-3
      i.fas.fa-sync.text-white
</template>
<script lang="ts">
  import Vue from 'vue';
  export default Vue.extend({
    name: 'nav-bar',
  });
</script>