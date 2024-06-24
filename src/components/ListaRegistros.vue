<template>
  <div>
    <h2>Listado de Libros</h2>
    
    <button @click="mostrarFormularioAgregar" class="btn btn-success">Agregar Libro</button>
    <div class="row">
      <div class="col-md-8">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Fecha de Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="libro in libros.data" :key="libro.id">
              <td>{{ libro.id }}</td>
              <td>{{ libro.titulo }}</td>
              <td>{{ libro.descripcion }}</td>
              <td>{{ formatoFecha(libro.created_at) }}</td>
              <td>
                <button @click="editarLibro(libro)" class="btn btn-primary btn-sm">Editar</button>
                <button @click="confirmarEliminar(libro.id)" class="btn btn-danger btn-sm">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-md-4">
        <div class="formulario-container" v-if="formularioVisible">
          <h3>{{ formulario.id ? 'Editar Libro' : 'Agregar Libro' }}</h3>
          <form @submit.prevent="guardarCambios">
            <div class="form-group">
              <label for="titulo">Título:</label>
              <input type="text" class="form-control" id="titulo" v-model="formulario.titulo" required>
            </div>
            <div class="form-group">
              <label for="descripcion">Descripción:</label>
              <textarea class="form-control" id="descripcion" v-model="formulario.descripcion" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">{{ formulario.id ? 'Actualizar' : 'Guardar' }}</button>
            <button type="button" class="btn btn-secondary" @click="cancelarEdicion">Cancelar</button>
          </form>
        </div>
      </div>
      <div class="col-md-6">        
        <nav v-if="libros.last_page > 1" aria-label="Page navigation">
          <ul class="pagination">
            <li class="page-item" :class="{ 'disabled': libros.current_page === 1 }">
              <a class="page-link" href="#" aria-label="Previous" @click.prevent="cargarPagina(libros.current_page - 1)">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li class="page-item" v-for="page in libros.last_page" :key="page" :class="{ 'active': page === libros.current_page }">
              <a class="page-link" href="#" @click.prevent="cargarPagina(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ 'disabled': libros.current_page === libros.last_page }">
              <a class="page-link" href="#" aria-label="Next" @click.prevent="cargarPagina(libros.current_page + 1)">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Importación de Axios para hacer peticiones HTTP
import Swal from 'sweetalert2'; // Importación de SweetAlert2 para mensajes modales

export default {
  data() {
    return {
      libros: {
        data: [], // Arreglo donde se almacenarán los libros de la página actual
        current_page: 1, // Página actual de la lista de libros
        last_page: 1 // Última página disponible
      },
      formulario: {
        id: null, // ID del libro en edición (null para nuevo libro)
        titulo: '', // Título del libro en el formulario
        descripcion: '' // Descripción del libro en el formulario
      },
      formularioVisible: false, // Estado de visibilidad del formulario de agregar/editar
      accessToken: '', // Token de acceso JWT
    };
  },
  mounted() {
    this.obtenerToken(); // Método para obtener el token de acceso al cargar el componente
    this.fetchLibros(); // Método ejecutado al montar el componente para cargar los libros
  },
  methods: {
    // Método para obtener el token de acceso
    obtenerToken() {
      axios.post('http://localhost:8000/api/login', {
        email: 'emg@gmail.com',
        password: '123456'
      })
      .then(response => {
        this.accessToken = response.data.access_token; // Asignar el token de acceso obtenido
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`; // Establecer el token como Bearer en Axios por defecto
        // Cargar libros después de obtener el token
        this.fetchLibros();
      })
      .catch(error => {
        console.error('Error al obtener el token:', error); // Manejo de errores en la consola
      });
    },
    // Método para cargar los libros desde la API, con paginación opcional
    fetchLibros(page = 1) {
      axios.get(`http://localhost:8000/api/libros?page=${page}`)
        .then(response => {
          this.libros = response.data; // Asignación de los libros obtenidos a la variable libros
        })
        .catch(error => {
          console.error('Error fetching libros:', error); // Manejo de errores en la consola
        });
    },
    // Método para formatear la fecha en formato legible
    formatoFecha(fecha) {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    // Método para preparar el formulario con los datos del libro a editar
    editarLibro(libro) {
      this.formulario.id = libro.id; // Asignación del ID del libro seleccionado
      this.formulario.titulo = libro.titulo; // Asignación del título del libro seleccionado
      this.formulario.descripcion = libro.descripcion; // Asignación de la descripción del libro seleccionado
      this.formularioVisible = true; // Mostrar el formulario de edición/agregación
    },
    // Método para guardar los cambios al editar/agregar un libro
    guardarCambios() {
      if (this.formulario.id) {
        // Editar libro existente
        axios.put(`http://localhost:8000/api/libros/${this.formulario.id}`, this.formulario)
          .then(response => {
            Swal.fire('¡Actualizado!', 'El libro ha sido actualizado correctamente.', 'success'); // Mensaje de éxito con SweetAlert2
            this.limpiarFormulario(); // Limpiar el formulario después de editar
            this.fetchLibros(this.libros.current_page); // Actualizar lista después de editar
          })
          .catch(error => {
            console.error('Error editando libro:', error); // Manejo de errores en la consola
            Swal.fire('¡Error!', 'Hubo un problema al intentar actualizar el libro.', 'error'); // Mensaje de error con SweetAlert2
          });
      } else {
        // Agregar nuevo libro
        axios.post('http://localhost:8000/api/libros', this.formulario)
          .then(response => {
            Swal.fire('¡Guardado!', 'El libro ha sido guardado correctamente.', 'success'); // Mensaje de éxito con SweetAlert2
            this.limpiarFormulario(); // Limpiar el formulario después de agregar
            this.fetchLibros(this.libros.current_page); // Actualizar lista después de agregar
          })
          .catch(error => {
            console.error('Error agregando libro:', error); // Manejo de errores en la consola
            Swal.fire('¡Error!', 'Hubo un problema al intentar agregar el libro.', 'error'); // Mensaje de error con SweetAlert2
          });
      }
    },
    // Método para confirmar la eliminación de un libro
    confirmarEliminar(libroId) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.eliminarLibro(libroId); // Llamar al método para eliminar el libro si se confirma
        }
      });
    },
    // Método para eliminar un libro
    eliminarLibro(libroId) {
      axios.delete(`http://localhost:8000/api/libros/${libroId}`)
        .then(response => {
          Swal.fire('¡Eliminado!', 'El libro ha sido eliminado correctamente.', 'success'); // Mensaje de éxito con SweetAlert2
          this.fetchLibros(this.libros.current_page); // Actualizar lista después de eliminar
        })
        .catch(error => {
          console.error('Error eliminando libro:', error); // Manejo de errores en la consola
          Swal.fire('¡Error!', 'Hubo un problema al intentar eliminar el libro.', 'error'); // Mensaje de error con SweetAlert2
        });
    },
    // Método para limpiar el formulario después de editar/agregar un libro
    limpiarFormulario() {
      this.formulario.id = null;
      this.formulario.titulo = '';
      this.formulario.descripcion = '';
      this.formularioVisible = false;
    },
    // Método para cancelar la edición/agregación de un libro
    cancelarEdicion() {
      this.limpiarFormulario();
    },
    // Método para cargar una página específica de libros
    cargarPagina(page) {
      this.fetchLibros(page);
    },
    // Método para mostrar el formulario de agregar un libro
    mostrarFormularioAgregar() {
      this.formularioVisible = true;
    }
  }
};
</script>
