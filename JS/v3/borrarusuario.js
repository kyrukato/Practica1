// Importa el SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'
import { getFirestore, collection, getDocs, query, where, updateDoc, setDoc, Timestamp, doc, getDoc} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
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
const usuariosCollection = collection(db, 'Usuarios');
const auth = getAuth(app);
let usuarios = [];
window.onload = async function(){
    // Llamar a la función para cargar los productos al cargar la página    
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const usuario = auth.currentUser;
            if(usuario.email === "admin@admin.com"){
                CargarUsuarios();
            }
            else{
                window.location.replace("/Carrito/usuariov3.html");
            }
        } else {
            window.location.replace("/Carrito/loginv3.html");
        }
    });
    // Obtener el contexto del lienzo
    

};

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
                };
                usuarios.push(producto);
            }
        });
        LlenarTabla(usuarios);
        AgregarEvento();
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

            const celdaEdad = document.createElement("td");
            celdaEdad.textContent = item.Edad;
            fila.appendChild(celdaEdad);

            const btnBorrar = document.createElement("button")
            btnBorrar.type = "button";
            btnBorrar.textContent = "ELIMINAR";
            btnBorrar.classList.add("btn");
            const celdaBorrar = document.createElement("td");
            celdaBorrar.appendChild(btnBorrar);
            fila.appendChild(celdaBorrar);
            
            // Agregar la fila completa al cuerpo de la tabla
            cuerpoTabla.appendChild(fila);
        });
}

function AgregarEvento(){
    const botones = document.querySelectorAll(".btn");
    // Adjuntar un controlador de eventos a cada botón
    botones.forEach(boton => {
        boton.addEventListener("click", async function() {
            // Obtener la fila padre del botón presionado
            const fila = this.closest("tr");
            let user = fila.cells[0].textContent;
            if(confirm("¿Seguro que quiere eliminar a este usuario?")){
                const q = query(collection(db, "Usuarios"), where("Usuario", '==', user));
                const querySnapshot = await getDocs(q);
                if(!querySnapshot.empty){
                    querySnapshot.forEach((d) => {
                        // Obtener el ID del documento
                        const docId = d.id;
                        // Actualizar el documento con el nuevo valor
                        try{
                            const productoRef = doc(db, "Usuarios", docId);
                            updateDoc(productoRef, {
                                Status: false
                            });
                        }
                        catch(error){
                            console.log(error);
                            alert("Error al actualizar la información");
                        }
                    });
                }
            }
        });
    });
}
