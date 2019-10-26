<template lang="pug">
  #app.bg-primary-100.pb-2.font-body
    nav-bar(@show-query-log='app.showQueryLog = true' @add-connection='app.showAddConnection = true')
    main
      transition(enter-active-class='animated slideInRight fast' leave-active-class='animated slideOutRight faster')
        .query-log.h-screen.bg-primary-700.fixed.top-0.right-0(v-if='app.showQueryLog' class='w-1/2')
          .flex.justify-between.items-center.text-white
            .text-lg.cursor-pointer.p-2(@click='app.showQueryLog = false')
              fa-icon.mr-1(icon='caret-right')
              | Query Log
            fa-icon.mr-2(icon='sync')
          .p-2.h-full
            pre.bg-white.rounded.p-1.h-full
              .text-xs
                span.text-red-500 Notice: 
                span Works
      z-card.mx-auto(v-if='app.showAddConnection' @close-card='app.showAddConnection = false' :has-collapse='false' has-close class='w-1/2' title='Add new connection')
        z-form-connection
          
      //z-card(title='Add entity')
        form.px-2
          .flex.justify-between
            z-fieldset.mr-2(class='w-1/2' label='Name')
              input.input--basic(type='text')
            z-fieldset(class='w-1/2' label='Type')
              select.input--basic
                option ROLE
          .action__bar.mt-2.border-t
            .py-2
              button.button--basic Add
            
      z-card(title='Select Roles')
        .p-2
          z-checkbox.mr-1.mb-1(v-for='label, index in roleList' :key='index' :label='label' :selected='selectedRoles' @selected='toggleArray(selectedRoles, $event)')
      z-card(title='Select Schemas')
        .p-2
          z-checkbox.mr-1.mb-1(v-for='label, index in schemaList' :key='index' :label='label' :selected='selectedSchemas' @selected='toggleArray(selectedSchemas, $event)')
      z-card(ref='manageCard' title='Manage')
        .px-2
          z-checkbox.mr-2(v-for='item, index in config.manage' :key='index' :label='item.label' :selected='selectedEntities' @selected='toggleArray(selectedEntities, $event)')
          .mt-2(v-if='hasSelected')
            div(:class='headerClass')
              z-manage-row(title='Roles' :is-sticky='app.showStickyHeader' type='header')
                div(v-for='role, index in selectedRoles' :key='index') {{ role }}
            z-manage-row(v-for='entity, index in filteredEntities' :key='index' :title='entity.label' :level='entity.level' :type='entity.type' :meta='entity.meta') 
              z-entity-grant(v-for='grants, roleName in entity.grants' :key='roleName' :type='entity.type' :grants='grants' :entity='entity' :role='roleName')
</template>
<script lang="ts">
  import Vue from 'vue';
  import NavBar from '@/components/NavBar.vue';
  import ZCheckbox from '@/components/layout/Checkbox.vue';
  import ZCard from '@/components/Card.vue';
  import ZEntityGrant from '@/components/EntityGrant.vue';
  import ZManageRow from '@/components/ManageRow.vue';
  import ZFieldset from '@/components/layout/Fieldset.vue';
  import ZFormConnection from '@/components/FormConnection.vue';

  import { mapState, mapGetters, Dictionary } from 'vuex';
  import { toggleArrayMixin } from '@/utils/toggleArray';
  import { InformationSchema } from '@/utils/@types-information';
  import { State, Computed } from '@/store/state';
  import { Actions } from '@/store/actions';
  import { Getters } from '@/store/getters';
  import { Mutations } from '@/store/mutations';
  import { EntityTypes } from '@/store/getters';

  interface ComputedGetters {
    entityTree(): any;
    schemaList(): any;
    roleList(): any;
  }

  export default Vue.extend({
    name: 'app',
    mixins: [toggleArrayMixin],
    mounted() {
      this.$store.dispatch('init');
      this.selectedRoles = this.selected.roles;
      this.selectedSchemas = this.selected.schemas;
      const THRESHOLD = 375;
      window.addEventListener(
        'scroll',
        (ev) => {
          if (window.scrollY > 337) {
            this.app.showStickyHeader = true;
          } else {
            this.app.showStickyHeader = false;
          }
        },
        { passive: true },
      );
    },
    data() {
      return {
        selectedRoles: [] as string[],
        selectedSchemas: [] as string[],
        selectedEntities: [
          'Tables',
          'Columns',
          'Objects',
          'Routines',
          'Triggers',
        ],
        app: {
          showStickyHeader: false,
          showQueryLog: false,
          showAddConnection: false,
        },
        config: {
          manage: [
            {
              label: 'Tables',
              value: EntityTypes.TABLE,
            },
            {
              label: 'Columns',
              value: EntityTypes.COLUMN,
            },
            {
              label: 'Objects',
              value: EntityTypes.OBJECT,
            },
            {
              label: 'Routines',
              value: EntityTypes.ROUTINE,
            },
            {
              label: 'Triggers',
              value: EntityTypes.TRIGGER,
            },
          ],
        },
      };
    },
    watch: {
      selectedSchemas(val, oldVal) {
        if (val.length) {
          this.$store.dispatch(Actions.GET_INFO, { schemas: val });
        }
      },
      selectedRoles(val, oldVal) {
        if (val.length) {
          this.$store.dispatch(Actions.GET_GRANTS, { grantees: val });
        }
      },
    },
    computed: {
      ...((mapState(['init', 'selected']) as unknown) as Computed<State>),
      ...((mapGetters([
        Getters.ENTITY_TREE,
        Getters.SCHEMA_LIST,
        Getters.ROLE_LIST,
      ]) as unknown) as ComputedGetters),
      hasSelected(): boolean {
        return this.selectedSchemas.length > 0 && this.selectedRoles.length > 0;
      },
      headerClass(): Record<string, boolean> {
        return {
          'fixed w-header top-0 mt-1': this.app.showStickyHeader,
          'w-full': !this.app.showStickyHeader,
        };
      },
      filteredEntities(): any[] {
        const entityTypes = this.config.manage
          .filter((m) => this.selectedEntities.includes(m.label))
          .map((m) => m.value);
        return this.entityTree.filter((e: any) => entityTypes.includes(e.type));
      },
    },
    methods: {
      allowGrant(ent: any): void {
        console.log('ent:', ent);
      },
      revokeGrant(ent: any): void {
        console.log('ent:', ent);
      },
    },
    components: {
      NavBar,
      ZCheckbox,
      ZCard,
      ZEntityGrant,
      ZManageRow,
      ZFieldset,
      ZFormConnection,
    },
  });
</script>
<style>
  .w-header {
    width: calc(100% - 2.5rem);
  }
</style>