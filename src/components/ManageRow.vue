<template lang="pug">
  .flex.rounded.items-center.mt-1
    .w-64(:class='titleStyle')
      .w-100.text-gray-600.bg-gray-300.p-2.rounded-l(:class='titleFont') {{ title }}
    .flex.justify-around.p-2.flex-grow.text-gray-700.bg-gray-200.rounded-r
      slot
</template>
<script lang="ts">
  import Vue from 'vue';
  export default Vue.extend({
    name: 'z-manage-row',
    props: {
      title: String,
      level: {
        type: Number,
        default: 0,
      },
    },
    computed: {
      titleStyle(): Record<string, boolean> {
        return {
          'pl-0': this.level === 0,
          'pl-4': this.level === 1,
        };
      },
      titleFont(): Record<string, boolean> {
        return {
          'text-sm': this.level > 0,
          'bg-gray-400 text-gray-700': this.level === 0,
          'bg-gray-300': this.level === 1,
        };
      },
    },
  });
</script>