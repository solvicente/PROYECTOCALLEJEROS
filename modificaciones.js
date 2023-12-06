//const URL = "http://127.0.0.1:5000/"
const URL = "https://Eliana2601.pythonanywhere.com/"

const app = Vue.createApp({
    data() {
        return {
            codigo: '',
            nombre: '',
            edad: '',
            sexo: '',
            tamanio: '',
            imagen_url: '',
            imagenUrlTemp: null,
            mostrarDatosCallejero: false,
        };
    },
    methods: {
        obtenerCallejero() {
            fetch(URL + 'callejeros/' + this.codigo)
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                    //Si la respuesta es un error, lanzamos una excepción para ser "catcheada" más adelante en el catch.
                        throw new Error('Error al obtener los datos del Callejero.')
                    }
                })
                .then(data => {
                    this.nombre = data.nombre;
                    this.edad = data.edad;
                    this.sexo = data.sexo;
                    this.tamanio = data.tamanio;
                    this.imagen_url = data.imagen_url;
                    this.mostrarDatosCallejero = true;
                })
                .catch(error => {
                    console.log(error);
                    alert('Código no encontrado.');
                })
        },
        seleccionarImagen(event) {
            const file = event.target.files[0];
            this.imagenSeleccionada = file;
            this.imagenUrlTemp = URL.createObjectURL(file); // Crea una URL temporal para la vista previa
        },
        guardarCambios() {
            const formData = new FormData();
            formData.append('codigo', this.codigo);
            formData.append('nombre', this.nombre);
            formData.append('edad', this.edad);
            formData.append('sexo', this.sexo);
            formData.append('tamanio', this.tamanio);

            if (this.imagenSeleccionada) {
                formData.append('imagen', this.imagenSeleccionada, this.imagenSeleccionada.name);
            }
            //Utilizamos fetch para realizar una solicitud PUT a la API y guardar los cambios.
            fetch(URL + 'callejeros/' + this.codigo, {
                method: 'PUT',
                body: formData,
            })
            .then(response => {
            //Si la respuesta es exitosa, utilizamos response.json() para parsear la respuesta en formato JSON.
                if(response.ok) {
                        return response.json()
                } else {
                //Si la respuesta es un error, lanzamos una excepción.
                    throw new Error('Error al guardar los cambios del Callejero.')
                }
            })
            .then(data => {
                alert('Callejero actualizado correctamente.');
                this.limpiarFormulario();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al actualizar el Callejero.');
            });
        },
        limpiarFormulario() {
            this.codigo = '';
            this.nombre = '';
            this.edad = '';
            this.sexo = '';
            this.tamanio = '';
            this.imagen_url = '';
            this.imagenSeleccionada = null;
            this.imagenUrlTemp = null;
            this.mostrarDatosCallejero = false;
        }
    }
});
app.mount('#app');