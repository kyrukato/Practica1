import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'
import { getFirestore, collection, setDoc, getDoc, doc, where, Timestamp, query, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js'

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
const auth = getAuth(app)
let ventas = [];

window.onload = function() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            if(user.email !== "admin@admin.com")
            {
                window.location.replace("/Carrito/inicio.html");
            }
        } else {
            window.location.replace("/Carrito/loginv3.html");
        }
    });
}

const btn = document.getElementById("mostrar");
btn.addEventListener('click', async () => {
    const fechaInput = document.getElementById('fecha').value;
    LimpiarTabla();
    try {
        const year = fechaInput.split('-')[0];
        const month = fechaInput.split('-')[1];
        const primerDia = new Date(year, month - 1, 1);
        const ultimoDia = new Date(year, month, 0);
        // Realizar la consulta en Firestore utilizando el rango de fechas
        const q = query(collection(db, 'Ventas'));
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
            const q = doc.data();
            if((q.Fecha.toDate() >= primerDia) && (q.Fecha.toDate() <= ultimoDia)){
                ventas.push({
                    Fecha: q.Fecha.toDate(),
                    Usuario: q.Usuario,
                    Producto: q.Producto,
                    Cantidad: q.Cantidad
                });
            }
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        if(ventas.length !== 0){
            LlenarTabla(ventas);
        }
        else{
            alert("No se registraron ventas en la fecha seleccionada");
        }
    } catch (error) {
        console.log(error);
    }
});

function LlenarTabla(arreglo){
    const cuerpoTabla = document.getElementById("cuerpotabla");
        arreglo.forEach(item =>{
            const fila = document.createElement("tr");

            // Crear celdas para cada dato y agregarlos a la fila
            const celdaNombre = document.createElement("td");
            celdaNombre.textContent = item.Producto;
            fila.appendChild(celdaNombre);

            const celdaCantidad = document.createElement("td");
            celdaCantidad.textContent = item.Cantidad;
            fila.appendChild(celdaCantidad);

            const celdaFecha = document.createElement("td");
            celdaFecha.textContent = item.Fecha;
            fila.appendChild(celdaFecha);

            const celdaUsuario = document.createElement("td");
            celdaUsuario.textContent = item.Usuario;
            fila.appendChild(celdaUsuario);
            
            // Agregar la fila completa al cuerpo de la tabla
            cuerpoTabla.appendChild(fila);
    });
    ventas = [];
}

function LimpiarTabla() {
    const cuerpoTabla = document.getElementById("cuerpotabla");
    // Eliminar todas las filas de la tabla
    while (cuerpoTabla.firstChild) {
        cuerpoTabla.removeChild(cuerpoTabla.firstChild);
    }
}
