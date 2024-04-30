import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
// Add Firebase products that you want to use
import { getAuth, signOut, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'
import { getFirestore, collection, setDoc, getDoc, doc, where, query, getDocs, updateDoc} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js'
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyB5X9CIKSipL044zHJt4m-lWLNRb2zmrEo",
        authDomain: "carrito-36c5b.firebaseapp.com",
        projectId: "carrito-36c5b",
        storageBucket: "carrito-36c5b.appspot.com",
        messagingSenderId: "736589963023",
        appId: "1:736589963023:web:c8ec2ad3b85c72a77ba87a",
        measurementId: "G-VDX3EVQR7R"
    };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);XMLDocument
// Obtiene una referencia a tu base de datos Firebase
const firestore = getFirestore(app);
const auth = getAuth();
const db = getFirestore(app);

const expresiones = {
	usuario: /^[a-zA-Z0-9\_\-]{5,16}$/, // Letras, numeros, guion y guion_bajo
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	password: /^.{6,12}$/, // 4 a 12 digitos.
	correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	telefono: /^\d{10}$/, // 7 a 14 numeros.
    edad: /^(?:100|[1-9]?[0-9])$/
}
const inputNombre = document.getElementById("nombre");
const inputUsuario = document.getElementById("usuario");
const inputContrasena = document.getElementById("password");
const inputConfirmar = document.getElementById("password2");
const inputCorreo = document.getElementById("correo");
const inputTelefono = document.getElementById("telefono");
const inputEdad = document.getElementById("edad");
const enviar = document.getElementById("btnCambiar");
const usuariosCollection = collection(db, 'Usuarios');
let usuarios = [];
var pass = "";
var t = ""
var ed = "";
var name = "";
document.addEventListener("DOMContentLoaded",function(){
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            if(user.email !== "admin@admin.com")
            {
                window.location.replace("/Carrito/usuariov3.html");
            }
            else{
                await CargarUsuarios();
                AgregarEvento(usuarios);
            }
        } else {
            window.location.replace("/Carrito/loginv3.html");
        }
    });
});

async function CargarUsuarios(){
    try{
        const querySnapshot = await getDocs(usuariosCollection);
        querySnapshot.forEach((item) => {
            const usr = item.data();
            if(usr.Status){
                let producto ={
                    Usuario: usr.Usuario,
                    Nombre: usr.Nombre,
                    Correo: usr.Correo,
                    Edad: usr.Edad,
                    Telefono: usr.Telefono,
                    Contrasena: usr.Contrasena
                };
                usuarios.push(producto);
            }
        });
        LlenarTabla(usuarios);
    }
    catch(error){
        console.log(error);
    }
}

function LlenarTabla(arreglo){
    const cuerpoTabla = document.getElementById("cuerpotabla");
        arreglo.forEach(item =>{
            const fila = document.createElement("tr");

            const celdaUsuario = document.createElement("td");
            celdaUsuario.textContent = item.Usuario;
            fila.appendChild(celdaUsuario);

            // Crear celdas para cada dato y agregarlos a la fila
            const celdaNombre = document.createElement("td");
            celdaNombre.textContent = item.Nombre;
            fila.appendChild(celdaNombre);

            const cendaCorreo = document.createElement("td");
            cendaCorreo.textContent = item.Correo;
            fila.appendChild(cendaCorreo);

            const btn = document.createElement("button");
            btn.type = "button";
            btn.classList.add("btn");
            btn.textContent = "Editar";
            const celdaEditar = document.createElement("td");
            celdaEditar.appendChild(btn);
            fila.appendChild(celdaEditar);
            
            // Agregar la fila completa al cuerpo de la tabla
            cuerpoTabla.appendChild(fila);
        });
}

function AgregarEvento(arrelgo){
    const botonEditar = document.querySelectorAll(".btn");
    // Adjuntar un controlador de eventos a cada botón
    try {
        botonEditar.forEach(boton => {
            boton.addEventListener("click", function() {
                // Obtener la fila padre del botón presionado
                const fila = this.closest("tr");
                // Obtener los valores de las celdas de la fila
                inputNombre.value = arrelgo[fila.rowIndex -1].Nombre;
                inputUsuario.value = arrelgo[fila.rowIndex -1].Usuario;
                inputCorreo.value = arrelgo[fila.rowIndex -1].Correo;
                inputContrasena.value = arrelgo[fila.rowIndex -1].Contrasena;
                inputTelefono.value = arrelgo[fila.rowIndex -1].Telefono;
                inputEdad.value = arrelgo[fila.rowIndex -1].Edad;
                pass = arrelgo[fila.rowIndex -1].Contrasena;
                t = arrelgo[fila.rowIndex -1].Telefono;
                ed = arrelgo[fila.rowIndex -1].Edad;
                name = arrelgo[fila.rowIndex -1].Nombre;
            });
        });
    } catch (error) {
        console.log(error);
    }
}


enviar.addEventListener("click", async ()=>{
    let userID;
    try {
        const querySnapshot = await getDocs(collection(db, 'Usuarios'));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.Usuario === inputUsuario.value) {
                userID = doc.id; // Devuelve el ID del usuario encontrado
            }
        });
    } catch (error) {
        console.error('Error al obtener el ID del usuario:', error);
        return null;
    }
    if(inputContrasena.value !== pass){
        if(expresiones.password.test(inputContrasena.value)){
            if(inputContrasena.value === inputConfirmar.value){
                try{
                    const usuarioRef = doc(db, "Usuarios", userID);
                    // Set the "capital" field of the city 'DC'
                    await updateDoc(usuarioRef, {
                        Contrasena: inputContrasena.value
                    });
                    alert("Contraseña actualizada correctamente");
                }
                catch(error){
                    console.log(error);
                    alert("Error al actualizar la contraseña");
                }
            }
            else{
                alert("Las contraseñas no coinciden");
            }
        }
        else{
            alert("Contraseña no válida, la contraseña debe tener una longitud entre 6 y 12 caracteres");
        }
    }
    if(inputTelefono.value !== t){
        if(expresiones.telefono.test(inputTelefono.value)){
            try{
                const usuarioRef = doc(db, "Usuarios", userID);
                await updateDoc(usuarioRef, {
                    Telefono: inputTelefono.value
                });
                alert("Teléfono actualizado correctamente");
            }
            catch(error){
                console.log(error);
                alert("Error al actualizar la información");
            }
        }
        else{
            alert("Número de teléfono ingresado no válido.")
        }
    }
    if(inputEdad.value !== ed){
        if(expresiones.edad.test(inputEdad.value)){
            try{
                const usuarioRef = doc(db, "Usuarios", userID);
                // Set the "capital" field of the city 'DC'
                await updateDoc(usuarioRef, {
                    Edad: inputEdad.value
                });
                alert("Edad actualizada correctamente");
            }
            catch(error){
                console.log(error);
                alert("Error al actualizar la Edad");
            }
        }
        else{
            alert("Edad ingresada no válida");
        }
    }
    if(inputNombre.value !== name){
        if(expresiones.nombre.test(inputNombre.value)){
            try{
                const usuarioRef = doc(db, "Usuarios", userID);
                await updateDoc(usuarioRef, {
                    Nombre: inputNombre.value
                });
                alert("Nombre actualizado correctamente");
            }
            catch(error){
                console.log(error);
                alert("Error al actualizar en Nombre");
            }
        }
        else{
            alert("Nombre ingresado no válida");
        }
    }
});

