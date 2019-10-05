<template lang="pug">
  .checkbox.items-center.p-2.inline-flex.rounded.pointer.select-none(:class='wrapColors' @click='$emit("selected", label)')
    i.mr-2(:class='iconFont')
    .text-sm {{ label }}
</template>
<script lang="ts">
  import Vue from 'vue';
  export default Vue.extend({
    name: 'z-checkbox',
    props: {
      label: String as () => string,
      selected: Array as () => string[],
    },
    computed: {
      isSelected(): boolean {
        return this.selected.includes(this.label);
      },
      wrapColors(): Record<string, boolean> {
        return {
          'bg-gray-300 text-gray-700': !this.isSelected,
          'bg-green-300 text-green-700': this.isSelected,
        };
      },
      iconFont(): Record<string, boolean> {
        return {
          'fas fa-check-circle': this.isSelected,
          'far fa-circle': !this.isSelected,
        };
      },
    },
  });
</script>
<style scoped>
  .checkbox {
    transition: background-color 0.15s ease-in;
  }
</style>