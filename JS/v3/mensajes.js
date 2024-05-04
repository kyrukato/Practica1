// Importa el SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'
import { getFirestore, collection, getDocs, updateDoc , setDoc, Timestamp, doc, getDoc} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { setCookie } from "../cookies.js";
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



// Inicializa tu aplicación Firebase
const app = initializeApp(firebaseConfig);

// Referencia a la colección de productos en Firestore
const db = getFirestore(app);
const mensajesCollection = collection(db, 'Mensajes');
const auth = getAuth(app);
let mensajesLeidos = [];
let mensajesNoLeidos = [];
const parametro = new URLSearchParams(window.location.search);
const dato = parametro.get('dato');
let IDmensaje;
const inputusuario = document.getElementById("usuario");
const inputmensaje = document.getElementById("comentario");
const inputrespuesta = document.getElementById("respuesta");
let mensajerespondido = [];
let correousuario = "";
window.onload = async function(){
    // Llamar a la función para cargar los productos al cargar la página    
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const usuario = auth.currentUser;
            if(usuario.email === "admin@admin.com"){
                CargarMensajes();
            }
            else{
                window.location.replace("/Carrito/usuariov3.html");
            }
        } else {
            window.location.replace("/Carrito/loginv3.html");
        }
    });
};

async function CargarMensajes(){
    try{
        const querySnapshot = await getDocs(mensajesCollection);
        let cont = 0;
        querySnapshot.forEach((item) => {
            const m = item.data();
            m.Comentarios.forEach((mensaje) =>{
                if(dato === 'true'){
                    if(mensaje.Status === true){
                        mensajesLeidos.push({
                            Usuario: mensaje.Usuario,
                            Mensaje: mensaje.Comentario,
                            Correo: mensaje.Correo,
                            Fecha: mensaje.Fecha
                        });
                    }
                }
                else{
                    if(!mensaje.Status){
                        mensajesNoLeidos.push({
                            Usuario: mensaje.Usuario,
                            Mensaje: mensaje.Comentario,
                            Correo: mensaje.Correo,
                            Fecha: mensaje.Fecha,
                            ID: item.id
                        });
                    }
                }
            });
        });
    }
    catch(error){
        console.log(error);
    } 
    if(dato === 'true'){
        LlenarTabla(mensajesLeidos);
        AgregarEvento(mensajesLeidos);
    }
    else{
        LlenarTabla(mensajesNoLeidos)
        AgregarEvento(mensajesNoLeidos);
    }
}

function LlenarTabla(arrelgoMensajes){
    if(arrelgoMensajes.length === 0){
        if(dato === 'true'){
            alert("No hay mensajes leídos");
        }
        else{
            alert("No hay mensajes por leer");
        }
    }
    else{
        const cuerpoTabla = document.getElementById("cuerpotabla");
        arrelgoMensajes.forEach(item =>{
            const fila = document.createElement("tr");

            // Crear celdas para cada dato y agregarlos a la fila
            const celdaNombre = document.createElement("td");
            celdaNombre.textContent = item.Usuario;
            fila.appendChild(celdaNombre);

            const celdaEdad = document.createElement("td");
            celdaEdad.textContent = item.Correo;
            fila.appendChild(celdaEdad);

            const celdaFecha = document.createElement("td");
            let fechaLegible = "";
            if (item.Fecha instanceof Timestamp) {
                let fecha = item.Fecha.toDate(); // Convertir Timestamp a Date
                fechaLegible = fecha.toLocaleDateString(); // Formatear la fecha como una cadena legible
            } else {
                fechaLegible = "Fecha no disponible"; // Manejar caso en que la fecha no sea un Timestamp
            }
            celdaFecha.textContent = fechaLegible; // Mostrar la fecha formateada en la celda
            fila.appendChild(celdaFecha);

            const celdaVer = document.createElement("button");
            celdaVer.textContent = "Leer";
            celdaVer.classList.add("btnLeer");
            celdaVer.type="button";
            fila.appendChild(celdaVer);
            // Agregar la fila completa al cuerpo de la tabla
            cuerpoTabla.appendChild(fila);
        });
    }
}

async function AgregarEvento(arrelgoMensajes){
    const botonesLeer = document.querySelectorAll(".btnLeer");
    // Adjuntar un controlador de eventos a cada botón
    botonesLeer.forEach(boton => {
        boton.addEventListener("click", function() {
            // Obtener la fila padre del botón presionado
            const fila = this.closest("tr");
            // Obtener los valores de las celdas de la fila
            inputusuario.value = fila.cells[0].textContent;
            inputmensaje.value = arrelgoMensajes[fila.rowIndex -1].Mensaje;
            IDmensaje = arrelgoMensajes[fila.rowIndex -1].ID
            correousuario = arrelgoMensajes[fila.rowIndex -1].Correo
            mensajerespondido.push({
                Comentario: arrelgoMensajes[fila.rowIndex -1].Mensaje,
                Correo: arrelgoMensajes[fila.rowIndex -1].Correo,
                Status: true,
                Usuario: arrelgoMensajes[fila.rowIndex -1].Usuario,
                Fecha: arrelgoMensajes[fila.rowIndex -1].Fecha
            });
            console.log("Correo:",correousuario);
        });
    });
}

const btn = document.getElementById('button');

document.getElementById('form').addEventListener('submit', async function(event) {
    event.preventDefault();  
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("se intenta enviar");
    enviarCorreo(inputusuario.value,correousuario,inputrespuesta.value);
    await new Promise(resolve => setTimeout(resolve, 500));
    mensajeleido();
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
});

function enviarCorreo(nombre, correo, message) {
    const serviceID = "default_service";
    const templateID = 'template_m26pynt';
    emailjs.send(serviceID, templateID, {
        usuario: nombre,
        correo: correo,
        mensaje: message,
    }).then(() => {
        alert("¡Correo enviado correctamente!");
    }, (err) => {
        console.log(JSON.stringify(err));
        alert("Error al enviar el correo");
        }
    );
}

async function mensajeleido(){
    try{
        const mensajesRef = doc(db, "Mensajes", IDmensaje);
        await updateDoc(mensajesRef, {
            Comentarios: mensajerespondido
        });
    }
    catch(error){
        console.log(error);
    }
}