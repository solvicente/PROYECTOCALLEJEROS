const URL = "https://Eliana2601.pythonanywhere.com/"


// Realizamos la solicitud GET al servidor para obtener todos los callejeros
fetch(URL + 'callejeros')
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            // Si hubo un error, lanzar explícitamente una excepción
            // para ser "catcheada" más adelante
            throw new Error('Error al obtener los callejeros.');
        }
    })
    .then(function (data) {
        let tablaCallejeros = document.getElementById('tablaCallejeros');
        // Iteramos sobre los callejeros y agregamos filas a la tabla
        for (let callejero of data) {
            let fila = document.createElement('tr');
            fila.innerHTML = '<td>' + callejero.codigo + '</td>' +
                '<td>' + callejero.nombre + '</td>' +
                '<td>' + callejero.edad + '</td>' +
                '<td>' + callejero.sexo + '</td>' +
                '<td>' + callejero.tamanio + '</td>' +
                //'<td><img src=static/img/' + producto.imagen_url + ' alt = "Imagen del producto" style = "width: 100px;" ></td > ' + '<td align="right">' + producto.proveedor + '</td>';
                '<td><img src=https://www.pythonanywhere.com/user/Eliana2601/files/home/Eliana2601/mysite/static/img/' + callejero.imagen_url+' alt="Imagen del callejero" style = "width: 100px;"></td> ';
            //Una vez que se crea la fila con el contenido del callejero, se agrega a la tabla utilizando el método appendChild del elemento tablaCallejeros.
            tablaCallejeros.appendChild(fila);
        }
    })
    .catch(function (error) {
        // En caso de error
        alert('Error al obtener los callejeros.');
        console.error('Error:', error);
    })