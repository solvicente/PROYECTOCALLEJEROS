from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.utils import secure_filename
import os
import time

app = Flask(__name__)
CORS(app)

class Galeria:
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )
        self.cursor = self.conn.cursor(dictionary=True)

        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err

        self.cursor.execute('''CREATE TABLE IF NOT EXISTS callejeros (
                             codigo INT,
                             nombre VARCHAR(50) NOT NULL,
                             edad INT NOT NULL,
                             sexo VARCHAR(10) NOT NULL,
                             tamanio VARCHAR(10) NOT NULL,
                             imagen_url VARCHAR(255))''')
        self.conn.commit()

    def listar_callejeros(self):
        self.cursor.execute("SELECT * FROM callejeros")
        callejeros = self.cursor.fetchall()
        return callejeros

    def consultar_callejero(self, codigo):
        # Consultamos un callejero a partir de su código
        self.cursor.execute(f"SELECT * FROM callejeros WHERE codigo = {codigo}")
        return self.cursor.fetchone()

    def mostrar_callejero(self, codigo):
        # Mostramos los datos de un callejero a partir de su código
        callejero = self.consultar_callejero(codigo)
        if callejero:
            print("-" * 40)
            print(f"Código.....: {callejero['codigo']}")
            print(f"Nombre.....: {callejero['nombre']}")
            print(f"Edad.......: {callejero['edad']}")
            print(f"Sexo.......: {callejero['sexo']}")
            print(f"Tamaño.....: {callejero['tamanio']}")
            print(f"Imagen.....: {callejero['imagen_url']}")
            print("-" * 40)
        else:
            print("El callejero no fue encontrado.")

    def agregar_callejero(self, codigo, nombre, edad, sexo, tamanio, imagen):
        self.cursor.execute(f"SELECT * FROM callejeros WHERE codigo = {codigo}")
        callejero_existe = self.cursor.fetchone()
        if callejero_existe:
            return False
        sql = "INSERT INTO callejeros (codigo, nombre, edad, sexo, tamanio, imagen_url) VALUES (%s, %s, %s, %s, %s, %s)"
        valores = (codigo, nombre, edad, sexo, tamanio, imagen)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return True
    
    def eliminar_callejero(self, codigo):
        # Eliminamos un callejero de la tabla a partir de su código
        self.cursor.execute(f"DELETE FROM callejeros WHERE codigo = {codigo}")
        self.conn.commit()
        return self.cursor.rowcount > 0

    def modificar_callejero(self, codigo, nuevo_nombre, nueva_edad, nuevo_sexo, nuevo_tamanio, nueva_imagen):
        sql = "UPDATE callejeros SET nombre = %s, edad = %s, sexo = %s, tamanio = %s, imagen_url = %s WHERE codigo = %s"
        valores = (nuevo_nombre, nueva_edad, nuevo_sexo, nuevo_tamanio, nueva_imagen, codigo)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0


# Crear una instancia de la clase Galeria
galeria = Galeria(host='Eliana2601.mysql.pythonanywhere-services.com', user='Eliana2601', password='Maraila140412', database='Eliana2601$miapp')

ruta_destino = '/home/Eliana2601/mysite/static/img'

@app.route("/callejeros", methods=["GET"])
def listar_callejeros():
    callejeros = galeria.listar_callejeros()
    return jsonify(callejeros)

@app.route("/callejeros/<int:codigo>", methods=["GET"])
def mostrar_callejero(codigo):
    callejero = galeria.consultar_callejero(codigo)
    if callejero:
        return jsonify(callejero)
    else:
        return "El callejero no fue encontrado", 404

@app.route("/callejeros", methods=["POST"])
def agregar_callejero():
    try:
        codigo = int(request.form['codigo'])
        nombre = request.form['nombre']
        edad = int(request.form['edad'])
        sexo = request.form['sexo']
        tamanio = request.form['tamanio']
        imagen = request.files['imagen']

        nombre_imagen = secure_filename(imagen.filename)
        nombre_base, extension = os.path.splitext(nombre_imagen)
        nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}"
        imagen.save(os.path.join(ruta_destino, nombre_imagen))

        if galeria.agregar_callejero(codigo, nombre, edad, sexo, tamanio, nombre_imagen):
            return jsonify({"mensaje": "El callejero fue agregado exitosamente"}), 201
        else:
            return jsonify({"mensaje": "El callejero ya existe"}), 400
    except Exception as e:
        print(f"Error al agregar callejero: {e}")
        return jsonify({"mensaje": "Error al agregar el callejero"}), 500
    

@app.route("/callejeros/<int:codigo>", methods=["DELETE"])
def eliminar_callejero(codigo):
    # Primero, obtener la información del callejero para encontrar la imagen
    callejero = galeria.consultar_callejero(codigo)
    if callejero:
        # Eliminar la imagen asociada si existe
        ruta_imagen = os.path.join(ruta_destino, callejero['imagen_url'])
        if os.path.exists(ruta_imagen):
            os.remove(ruta_imagen)
        # Luego, eliminar el callejero de la galeria
        if galeria.eliminar_callejero(codigo):
            return jsonify({"mensaje": "El callejero fue eliminado exitosamente"}), 200
        else:
            return jsonify({"mensaje": "Error al eliminar el callejero"}), 500
    else:
        return jsonify({"mensaje": "El callejero no fue encontrado"}), 404
    
@app.route("/callejeros/<int:codigo>", methods=["PUT"])
def modificar_callejero(codigo):
    # Recojo los datos del formulario
    nuevo_nombre = request.form.get("nombre")
    nueva_edad = request.form.get("edad")
    nuevo_sexo = request.form.get("sexo")
    nuevo_tamanio = request.form.get("tamanio")

    # Procesamiento de la imagen
    imagen = request.files['imagen']
    nombre_imagen = secure_filename(imagen.filename)
    nombre_base, extension = os.path.splitext(nombre_imagen)
    nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}"
    imagen.save(os.path.join(ruta_destino, nombre_imagen))
    
    # Actualización del callejero
    if galeria.modificar_callejero(codigo, nuevo_nombre, nueva_edad, nuevo_sexo, nuevo_tamanio, nombre_imagen):
        return jsonify({"mensaje": "El callejero fue modificado exitosamente"}), 200
    else:
        return jsonify({"mensaje": "El callejero no fue encontrado"}), 404

if __name__ == "__main__":
    app.run(debug=True)
