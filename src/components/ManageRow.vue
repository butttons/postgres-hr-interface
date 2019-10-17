<template lang="pug">
  .flex.rounded.items-center.mt-1(:class='wrapClass')
    .w-header__title(:class='titleStyle')
      .row__head.w-100.text-gray-600.bg-gray-300.select-none(:class='titleFont') 
        fa-icon.mr-2(:icon='iconFont' v-tooltip='type')
        | {{ title }}
        span.text-xs.ml-2.bg-gray-500.text-gray-800.p-1.rounded(v-if='hasMeta')
          | {{ meta.join(' ') }}
    .row__data.flex.justify-around.p-2.flex-grow.text-gray-700.bg-gray-200.rounded-r(:class='slotClass')
      slot
</template>
<script lang="ts">
  import Vue from 'vue';
  import { EntityTypes } from './../store/getters';

  export default Vue.extend({
    name: 'z-manage-row',
    props: {
      title: String,
      type: String as () => EntityTypes | 'header',
      meta: {
        type: Array as () => string[],
        default: undefined,
      },
      level: {
        type: Number,
        default: 0,
      },
      isSticky: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      hasMeta(): boolean {
        return this.meta !== undefined;
      },
      iconFont(): string {
        const fontMap = new Map([
          [EntityTypes.TABLE, 'table'],
          [EntityTypes.COLUMN, 'columns'],
          [EntityTypes.ROUTINE, 'code'],
          [EntityTypes.TRIGGER, 'bolt'],
          [EntityTypes.OBJECT, 'box'],
          ['header', 'users'],
        ]);
        return fontMap.get(this.type)!;
      },
      titleStyle(): Record<string, boolean> {
        return {
          'pl-0': this.level === 0,
          'pl-4': this.level === 1,
          'pl-8': this.level === 2,
        };
      },
      titleFont(): Record<string, boolean> {
        return {
          'text-sm': this.level > 0,
          'bg-gray-400 text-gray-700': this.level === 0,
          'bg-gray-300': this.level === 1,
          'rounded-l': !this.isSticky,
          'rounded-tl': this.isSticky,
          'h-10 p-2': this.level === 0,
          'h-8 p-1 pl-2': this.level > 0,
        };
      },
      slotClass(): Record<string, boolean> {
        return {
          'rounded-r': !this.isSticky,
          'rounded-tr': this.isSticky,
          'h-10': this.level === 0,
          'h-8': this.level > 0,
        };
      },
      wrapClass(): Record<string, boolean> {
        return {
          'border-b-4 border-gray-500': this.isSticky,
          row__hover: this.type !== 'header',
        };
      },
    },
  });
</script>
<style>
  .w-header__title {
    width: 32rem;
  }
  .row__hover:hover .row__head {
    @apply bg-gray-500 text-gray-700;
  }
  .row__hover:hover .row__data {
    @apply bg-gray-300;
  }
</style>