const URL = "https://Eliana2601.pythonanywhere.com/"

// Capturamos el evento de envío del formulario
document.getElementById('formulario').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitamos que se envie el form

    var formData = new FormData();
    formData.append('codigo', document.getElementById('codigo').value);
    formData.append('nombre', document.getElementById('nombre').value);
    formData.append('edad', document.getElementById('edad').value);
    formData.append('sexo', document.getElementById('sexo').value);
    formData.append('tamanio', document.getElementById('tamanio').value);
    formData.append('imagen', document.getElementById('imagenCallejero').files[0]);

    // Realizamos la solicitud POST al servidor
    fetch(URL + 'callejeros', {
        method: 'POST',
        body: formData // Aquí enviamos formData en lugar de JSON
    })

    //Después de realizar la solicitud POST, se utiliza el método then() para manejar la respuesta del servidor.
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            // Si hubo un error, lanzar explícitamente una excepción
            // para ser "catcheada" más adelante
            throw new Error('Error al agregar al callejero.');
        }
    })

    // Respuesta OK
    .then(function () {
        // En caso de éxito
        alert('El callejero fue agregado correctamente.');
    })

    .catch(function (error) {
        // En caso de error
        alert('Error al agregar al callejero.');
        console.error('Error:', error);
    })
    .finally(function () {
        // Limpiar el formulario en ambos casos (éxito o error)
        document.getElementById('codigo').value = "";
        document.getElementById('nombre').value = "";
        document.getElementById('edad').value = "";
        document.getElementById('sexo').value = "";
        document.getElementById('tamanio').value = "";
        document.getElementById('imagenCallejero').value = "";
    });
})