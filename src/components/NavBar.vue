<template lang="pug">
nav.flex.justify-between.items-center.bg-primary-500(
  role='navigation',
  aria-label='main navigation'
)
  .text-lg.text-white.p-3.font-display Postgres
    strong HR
  .mr-3.flex.items-center
    .mr-2.flex
      select.input--full(
        @change='handleConnectionChange',
        v-model='selectedConnection',
        v-if='clientList.length > 0'
      )
        option(
          v-for='client, index of clientList',
          :key='index',
          :value='client[0]'
        ) {{ client[1] | clientName }}
      button.button__nav--icon.ml-1(
        v-tooltip='"Add new database"',
        @click='$emit("add-connection")'
      )
        fa-icon.mr-1(icon='plus')
      button.button__nav--icon.ml-1(
        v-tooltip='"Remove database"',
        @click='handleRemoveConnection'
      )
        fa-icon.mr-1(icon='trash')
    button.button__nav--icon(
      @click='$emit("show-query-log")',
      v-tooltip='"Show queries"'
    )
      fa-icon(icon='bolt')
    z-checkbox.ml-2(
      label='Ignore PG',
      :selected='ignorePg',
      @selected='toggleArray(ignorePg, $event)'
    )
</template>
<script lang="ts">
  import Vue from 'vue';
  import ZFieldset from '@/components/layout/Fieldset.vue';

  import ZCheckbox from '@/components/layout/Checkbox.vue';
  import { toggleArrayMixin } from '@/utils/toggleArray';
  import { Mutations } from '@/store/mutations';
  import { mapState, mapGetters } from 'vuex';
  import { Getters } from '@/store/getters';
  import { State } from '../store/state';
  import { Actions } from '../store/actions';

  export default Vue.extend({
    name: 'nav-bar',
    mixins: [toggleArrayMixin],
    data() {
      return {
        ignorePg: [] as string[],
        selectedConnection: '',
      };
    },
    filters: {
      clientName: (config: any) =>
        `${config.user}@${config.host}:${config.port || 5422}/${config.database}`,
    },
    mounted() {
      if (this.$store.state.config.ignorePg) {
        this.ignorePg = ['Ignore PG'];
      }
      if (this.$store.state.config.cache.currentConnection) {
        this.selectedConnection = this.$store.state.config.cache.currentConnection;
      }
    },
    computed: {
      ...mapState({
        currentConnection: (state: State) => state.config.cache.currentConnection,
      }),
      ...mapGetters([Getters.CONNECTION_LIST]),
    },
    watch: {
      ignorePg(val, oldVal) {
        const hasIgnore = val.length > 0;
        this.$store.commit(Mutations.SET_CONFIG_IGNORE, hasIgnore);
      },
    },
    methods: {
      handleConnectionChange() {
        this.$store.dispatch(Actions.SET_CONNECTION, {
          connectionId: this.selectedConnection,
        });
      },
      handleRemoveConnection() {
        this.$store.dispatch(Actions.REMOVE_CONNECTION);
      },
    },
    components: {
      ZCheckbox,
      ZFieldset,
    },
  });
</script>