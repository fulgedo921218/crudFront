<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="inputName">Nombre</label>
        <input type="text" class="form-control" id="inputName" v-model="formData.name" required>
      </div>
      <div class="form-group">
        <label for="inputDescription">Descripción</label>
        <textarea class="form-control" id="inputDescription" v-model="formData.description"></textarea>
      </div>
      <button type="submit" class="btn btn-primary">{{ editMode ? 'Actualizar' : 'Guardar' }}</button>
      <button type="button" class="btn btn-secondary ml-2" @click="cancel">Cancelar</button>
    </form>
  </div>
</template>

<script>
export default {
  props: ['editMode', 'formData'],
  methods: {
    handleSubmit() {
      this.$emit('submit', this.formData);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
}
</script>
