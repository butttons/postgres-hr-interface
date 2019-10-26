<template lang="pug">
  form.px-2(@submit.prevent='addNewConnection')
    .flex.justify-between
      z-fieldset.mr-2(class='w-1/2' label='User')
        input.input--basic(v-model='connection.user' type='text' required)
      z-fieldset(class='w-1/2' label='Password')
        input.input--basic(v-model='connection.password' type='password' required)
    .flex.justify-between
      z-fieldset.mr-2(class='w-1/2' label='Host')
        input.input--basic(v-model='connection.host' type='text' placeholder='127.0.0.1' required)
      z-fieldset(class='w-1/2' label='Port')
        input.input--basic(v-model.number='connection.port' type='number' placeholder='5432' required)
    .w-full
      z-fieldset(label='Database')
        input.input--basic(v-model='connection.database' type='text' required)
    .action__bar.mt-2.border-t
      .py-2
        button.button--basic(type='submit') Add
</template>
<script lang="ts">
  import Vue from 'vue';

  import ZFieldset from '@/components/layout/Fieldset.vue';
  import { Actions } from '../store/actions';
  export default Vue.extend({
    name: 'z-form-connection',
    data() {
      return {
        connection: {
          user: '',
          password: '',
          host: '',
          port: '',
          database: '',
        },
      };
    },
    methods: {
      addNewConnection() {
        this.$store.dispatch(Actions.NEW_CONNECTION, {
          connection: this.connection,
        });
        this.connection = {
          user: '',
          password: '',
          host: '',
          port: '',
          database: '',
        };
      },
    },
    components: {
      ZFieldset,
    },
  });
</script>