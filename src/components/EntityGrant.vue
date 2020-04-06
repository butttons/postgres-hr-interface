<template lang="pug">
  div.flex.items-center
    template(v-if='hasGrants')
      .text-xs.h-5.w-4.text-white.mr-1.rounded-sm.text-center.select-none(v-for='grant, index in entityGrants' :key='index' :class='grantClass(grant)' v-tooltip="grant" @click='handleGrantClick(grant)') {{ grant.slice(0, 1) }}
    template(v-else)
      .w-10.h-1.bg-gray-400.rounded
</template>
<script lang="ts">
  import Vue from 'vue';
  import { EntityTypes, EntityMeta } from '@/store/getters';
  export default Vue.extend({
    name: 'z-entity-grant',
    props: {
      type: String as () => EntityTypes,
      grants: Array as () => string[],
      entity: Object as () => any,
      role: String,
      meta: Object as () => EntityMeta,
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
          [EntityTypes.OBJECT]: ['USAGE'],
          [EntityTypes.ROUTINE]: ['EXECUTE'],
          [EntityTypes.TRIGGER]: [],
        },
      };
    },
    computed: {
      entityGrants(): string[] {
        return this.allGrants[this.type];
      },
      hasGrants(): boolean {
        return this.entityGrants.length > 0;
      },
    },
    methods: {
      hasGrant(grant: string): boolean {
        return this.grants.includes(grant);
      },
      grantClass(grant: string) {
        return {
          'bg-green-400 hover:bg-green-500': this.hasGrant(grant),
          'bg-gray-400 hover:bg-gray-500': !this.hasGrant(grant),
        };
      },
      handleGrantClick(grant: string) {
        const eventName = this.hasGrant(grant) ? 'revoke-grant' : 'allow-grant';

        const grantAction = this.hasGrant(grant) ? 'REVOKE' : 'GRANT';

        const sqlQuery = this.meta.sql
          .replace('{:action}', grantAction)
          .replace('{:grant}', grant)
          .concat(` TO ${this.role}`);

        this.$emit('run-query', sqlQuery);
      },
    },
  });
</script>