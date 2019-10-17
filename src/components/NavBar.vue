<template lang="pug">
  nav.flex.justify-between.items-center.bg-primary-500(role='navigation' aria-label='main navigation')
    .text-lg.text-white.p-3.font-display Postgres
      strong HR
    div.mr-3.flex.items-center
      z-checkbox.mr-2(label='Ignore PG' :selected='ignorePg' @selected='toggleArray(ignorePg, $event)')
      .h-8.w-8.inline-block.rounded.px-2.py-1.cursor-pointer(class='hover:bg-primary-600' @click='$emit("show-query-log")')
        fa-icon.text-primary-100(icon='bars')
</template>
<script lang="ts">
  import Vue from 'vue';
  import ZCheckbox from './layout/Checkbox.vue';
  import { toggleArrayMixin } from './../utils/toggleArray';
  import { Mutations } from './../store/mutations';

  export default Vue.extend({
    name: 'nav-bar',
    mixins: [toggleArrayMixin],
    data() {
      return {
        ignorePg: [] as string[],
      };
    },
    mounted() {
      if (this.$store.state.config.ignorePg) {
        this.ignorePg = ['Ignore PG'];
      }
    },
    watch: {
      ignorePg(val, oldVal) {
        const hasIgnore = val.length > 0;
        this.$store.commit(Mutations.SET_CONFIG_IGNORE, hasIgnore);
      },
    },
    components: {
      ZCheckbox,
    },
  });
</script>