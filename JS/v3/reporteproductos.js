// Importa el SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'
import { getFirestore, collection, getDocs, setDoc, Timestamp, doc, getDoc} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
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
const usuariosCollection = collection(db, 'Productos');
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
            console.log(item);
            const usr = item.data();
            let estatus = "";
            if(usr.Status){
                estatus = "Activo"
            }
            else{
                estatus = "Baja";
            }
            let producto ={
                Producto: usr.Link,
                Nombre: usr.Nombre,
                Descripcion: usr.Descripcion,
                Cantidad: usr.Cantidad,
                Precio: usr.Precio,
                Status: estatus
            };
            usuarios.push(producto);
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

            const Imagen = document.createElement("img")
            Imagen.src = item.Producto;
            Imagen.classList.add("imagenprod");
            const celdaProducto = document.createElement("td");
            celdaProducto.appendChild(Imagen);
            fila.appendChild(celdaProducto);

            // Crear celdas para cada dato y agregarlos a la fila
            const celdaNombre = document.createElement("td");
            celdaNombre.textContent = item.Nombre;
            fila.appendChild(celdaNombre);

            const cendaDescripcion = document.createElement("td");
            cendaDescripcion.textContent = item.Descripcion;
            fila.appendChild(cendaDescripcion);

            const celdaCantidad = document.createElement("td");
            celdaCantidad.textContent = item.Cantidad;
            fila.appendChild(celdaCantidad);

            const celdaPrecio = document.createElement("td");
            celdaPrecio.textContent = item.Precio;
            fila.appendChild(celdaPrecio);

            const celdaStatus = document.createElement("td");
            celdaStatus.textContent = item.Status;
            fila.appendChild(celdaStatus);
            
            // Agregar la fila completa al cuerpo de la tabla
            cuerpoTabla.appendChild(fila);
        });
}
