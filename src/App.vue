<template>
  <div>
      <lista-registros
      :registros="registros"
    />
  </div>
</template>

<script>
import ListaRegistros from './components/ListaRegistros.vue';

export default {
  name: 'App',
  components: {
    ListaRegistros
  },
  data() {
    return {
      showForm: false,
      editMode: false,
      formData: {
        id: null,
        name: '',
        description: ''
      }
    };
  },
  methods: {
  }
};
</script>
