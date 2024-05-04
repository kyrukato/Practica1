import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'
import { getFirestore, collection, setDoc, getDoc, doc, Timestamp, where, query,addDoc, getDocs, updateDoc} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js'

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
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const productosCollection = collection(db, 'Productos');
const buscar = document.getElementById("buscar");
const list = document.getElementById("prod");
const auth = getAuth(app);
let historial = [];
const fecha = new Date()
const timestamp = Timestamp.fromDate(fecha);
window.onload = function() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const usr = auth.currentUser;
            let userID = usr.uid;
            const refhistorial = doc(db, "Historial", userID);
            const snap = await getDoc(refhistorial);
            if(snap.exists){
                historial = snap.data().items || [];
            }
            LlenarTabla(historial);
        } else {
            window.location.replace("/Carrito/loginv3.html");
        }
    });
}

async function LlenarTabla(arreglo){
    let fecha;
    const cuerpoTabla = document.getElementById("cuerpotabla");
        arreglo.forEach(item =>{
            const fila = document.createElement("tr");
            if (item.Fecha) {
                fecha = item.Fecha.toDate();
                // Resto del código aquí
            }
            const imgaen = document.createElement("img");
            imgaen.src = item.Link;
            imgaen.classList.add("imagen");
            const celdaImagen = document.createElement("td");
            celdaImagen.appendChild(imgaen);
            fila.appendChild(celdaImagen);

            // Crear celdas para cada dato y agregarlos a la fila
            const celdaNombre = document.createElement("td");
            celdaNombre.textContent = item.Nombre;
            fila.appendChild(celdaNombre);

            const celdaCantidad = document.createElement("td");
            celdaCantidad.textContent = item.Cantidad;
            fila.appendChild(celdaCantidad);

            const celdaPrecio = document.createElement("td");
            celdaPrecio.textContent = item.Precio;
            fila.appendChild(celdaPrecio);

            const celdaFecha = document.createElement("td");
            celdaFecha.textContent = fecha;
            fila.appendChild(celdaFecha);
            
            // Agregar la fila completa al cuerpo de la tabla
            cuerpoTabla.appendChild(fila);
    });
}

