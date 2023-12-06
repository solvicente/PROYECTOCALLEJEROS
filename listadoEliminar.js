const URL = "https://Eliana2601.pythonanywhere.com/"

const app = Vue.createApp({
    data() {
        return {
            callejeros: []
        }
    },
    methods: {
        obtenerCallejeros() {
            // Obtenemos el contenido del inventario
            fetch(URL + 'callejeros')
                .then(response => {
                    // Parseamos la respuesta JSON
                    if (response.ok) { return response.json(); }
                })
                .then(data => {
                    // El código Vue itera este elemento para generar la tabla
                    this.callejeros = data;
                })
                .catch(error => {
                    console.log('Error:', error);
                    alert('Error al obtener los callejeros.');
                });
        },
        eliminarCallejero(codigo) {
            if (confirm('¿Estás seguro de que quieres eliminar este callejero?')) {
                fetch(URL + `callejeros/${codigo}`, { method: 'DELETE' })
                    .then(response => {
                        if (response.ok) {
                            this.callejeros = this.callejeros.filter(callejero => callejero.codigo !== codigo);
                            alert('El callejero fue eliminado correctamente.');
                        }
                    })
                    .catch(error => {
                        alert(error.message);
                    });
            }
        }
    },
    mounted() {
        //Al cargar la página, obtenemos la lista de callejeros
        this.obtenerCallejeros();
    }
});
app.mount('body');
