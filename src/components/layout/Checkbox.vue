<template lang="pug">
  .checkbox.items-center.p-2.inline-flex.rounded.pointer.select-none.cursor-pointer(:class='wrapColors' @click='$emit("selected", label)')
    fa-icon.mr-1(:icon='iconFont')
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
          'bg-gray-300 text-gray-700 hover:bg-gray-400': !this.isSelected,
          'bg-green-300 text-green-700 hover:bg-green-400': this.isSelected,
        };
      },
      iconFont(): string[] {
        return this.isSelected ? ['fas', 'check-circle'] : ['far', 'circle'];
      },
    },
  });
</script>
<style scoped>
  .checkbox {
    transition: background-color 0.15s ease-in;
  }
</style>