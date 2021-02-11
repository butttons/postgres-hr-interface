<template lang="pug">
.bg-white.m-3.rounded-lg.pb-2
  .font-display.flex.items-center.justify-between.p-2
    div(:class='titleClass', @click='showBody') {{ title }}
    div
      fa-icon.text-gray-400.cursor-pointer(
        :icon='fontName',
        class='hover:text-gray-600',
        @click='handleCollapse',
        v-if='hasCollapse'
      )
      fa-icon.text-gray-400.cursor-pointer(
        icon='times-circle',
        class='hover:text-gray-600',
        @click='$emit("close-card")',
        v-if='hasClose'
      )
  .font-body(v-if='!isCollapsed')
    slot
    slot(name='action')
</template>
<script lang="ts">
  import Vue from 'vue';
  export default Vue.extend({
    name: 'z-card',
    props: {
      title: String,
      collapsed: {
        type: Boolean,
        default: false,
      },
      hasCollapse: {
        type: Boolean,
        default: true,
      },
      hasClose: {
        type: Boolean,
        default: false,
      },
    },
    mounted() {
      this.isCollapsed = this.collapsed;
    },
    data() {
      return {
        isCollapsed: false,
      };
    },
    computed: {
      fontName(): string {
        return !this.isCollapsed ? 'minus-circle' : 'plus-circle';
      },
      titleClass(): Record<string, boolean> {
        return {
          'text-gray-800': !this.isCollapsed,
          'text-gray-600 cursor-pointer': this.isCollapsed,
        };
      },
    },
    methods: {
      handleCollapse() {
        this.isCollapsed = !this.isCollapsed;
      },
      showBody() {
        if (this.isCollapsed) {
          this.handleCollapse();
        }
      },
    },
  });
</script>