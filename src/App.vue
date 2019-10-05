<template lang="pug">
  #app.bg-primary-100.pb-2.font-body
    nav-bar
    main
      z-card(title='Select Schemas')
        z-checkbox.mr-1.mb-1(v-for='label, index in init.schemas' :key='index' :label='label' :selected='selectedSchemas' @selected='toggleArray(selectedSchemas, $event)')
      z-card(title='Select Roles')
        z-checkbox.mr-1.mb-1(v-for='label, index in init.roles' :key='index' :label='label' :selected='selectedRoles' @selected='toggleArray(selectedRoles, $event)')
      z-card(title='Manage')
        z-checkbox.mr-2(v-for='item, index in config.manage' :key='index' :label='item.label' :selected='config.selected' @selected='toggleArray(config.selected, $event)')
        .mt-2
          .w-full
            z-manage-row(title='Role/Table Name')
              div(v-for='role, index in selectedRoles' :key='index') {{ role }}
          z-manage-row(v-for='entity, index in entities' :key='index' :title='entity.label' :level='entity.level') 
            z-entity-grant(v-for='grants, gIndex in entity.grants' :key='gIndex' :type='entity.type' :grants='grants')

</template>
<script lang="ts">
  import Vue from 'vue';
  import NavBar from './components/NavBar.vue';
  import ZCheckbox from './components/layout/Checkbox.vue';
  import ZCard from './components/Card.vue';
  import ZEntityGrant from './components/EntityGrant.vue';
  import ZManageRow from './components/ManageRow.vue';
  import { mapState, mapGetters } from 'vuex';
  import { toggleArrayMixin } from './utils/toggleArray';
  import { InformationSchema } from '../../server/src/utils/@types-information';
  import { State } from './store/state';
  import { Actions } from './store/actions';
  import { Getters } from './store/getters';
  import { Mutations } from './store/mutations';

  export default Vue.extend({
    name: 'app',
    mixins: [toggleArrayMixin],
    mounted() {
      this.$store.dispatch('init', {
        schemas: ['ecom_public'],
        grantees: ['ecom_admin'],
      });
    },
    data() {
      return {
        selectedRoles: [],
        selectedSchemas: [],
        config: {
          selected: [],
          manage: [
            {
              label: 'Tables',
              value: InformationSchema.TableNames.RoleGrants.TABLE,
            },
            {
              label: 'Columns',
              value: InformationSchema.TableNames.RoleGrants.COLUMN,
            },
            {
              label: 'Objects',
              value: InformationSchema.TableNames.RoleGrants.OBJECT,
            },
            {
              label: 'Routines',
              value: InformationSchema.TableNames.RoleGrants.ROUTINE,
            },
          ],
        },
      };
    },
    watch: {
      selectedSchemas(val, oldVal) {
        if (val.length) {
          this.$store.commit(Mutations.SELECT_SCHEMAS, val);
          this.$store.dispatch(Actions.GET_INFO, { schemas: val });
        }
      },
      selectedRoles(val, oldVal) {
        if (val.length) {
          this.$store.commit(Mutations.SELECT_ROLES, val);
          this.$store.dispatch(Actions.GET_GRANTS, { grantees: val });
        }
      },
    },
    computed: {
      ...mapState(['init']),
      ...mapGetters([Getters.ENTITIES]),
    },
    components: {
      NavBar,
      ZCheckbox,
      ZCard,
      ZEntityGrant,
      ZManageRow,
    },
  });
</script>