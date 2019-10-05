<template lang="pug">
  div.flex
    .text-xs.text-white.px-1.mr-1.rounded-sm.text-center(v-for='grant, index in entityGrants' :key='index' :class='grantClass(grant)') {{ grant.slice(0, 1) }}
</template>
<script lang="ts">
  import Vue from 'vue';
  import { EntityTypes } from './../store/getters';
  export default Vue.extend({
    name: 'z-entity-grant',
    props: {
      type: String as () => EntityTypes,
      grants: Array as () => string[],
    },
    data() {
      return {
        allGrants: {
          [EntityTypes.TABLE]: [
            'SELECT',
            'INSERT',
            'UPDATE',
            'DELETE',
            'TRUNCATE',
            'REFERENCES',
            'TRIGGER',
          ],
          [EntityTypes.COLUMN]: ['SELECT', 'INSERT', 'UPDATE', 'REFERENCES'],
        },
      };
    },
    computed: {
      entityGrants() {
        return this.allGrants[this.type];
      },
    },
    methods: {
      hasGrant(grant: string): boolean {
        return this.grants.includes(grant);
      },
      grantClass(grant) {
        return {
          'bg-green-400': this.hasGrant(grant),
          'bg-gray-400': !this.hasGrant(grant),
        };
      },
    },
  });
</script>