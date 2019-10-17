<template lang="pug">
  fieldset.border.rounded.border-gray-300.bg-gray-200(class='focus-within:bg-white focus-within:border-primary-400')
    legend.text-sm.text-gray-700 {{ label }} 
    slot
</template>
<script lang="ts">
  import Vue from 'vue';
  export default Vue.extend({
    name: 'v-fieldset',
    props: {
      label: String,
    },
  });
</script>