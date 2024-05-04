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
const auth = getAuth(app);

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

function endOfDay(date) {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    const e = new Date(end.getTime() + 24 * 60 * 60 * 1000);
    return e;
}

function startOfDay(date){
    const end = new Date(date);
    end.setHours(0, 0, 0, 0);
    const e = new Date(end.getTime() + 24 * 60 * 60 * 1000);
    return e;
}
let ventas = [];

const btn = document.getElementById("mostrar");
btn.addEventListener('click', async () => {
    const fechaInput = document.getElementById('fecha').value;
    LimpiarTabla();
    // Convertir la fecha a un objeto de fecha de JavaScript
    const fecha = new Date(fechaInput);
    const start = startOfDay(fecha);
    const end = endOfDay(fecha);
    // Realizar la consulta en Firestore utilizando el rango de fechas
    const q = query(collection(db, 'Ventas'));
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
        const q = doc.data();
        console.log(q.Fecha.toDate());
        if((q.Fecha.toDate() >= start) && (q.Fecha.toDate() <= end)){
            ventas.push({
                Fecha: q.Fecha.toDate(),
                Usuario: q.Usuario,
                Producto: q.Producto,
                Cantidad: q.Cantidad
            });
        }
    });
    if(ventas.length !== 0){
        LlenarTabla(ventas);
    }
    else{
        alert("No se registraron ventas en la fecha seleccionada");
    }
});

export function LlenarTabla(arreglo){
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

export function LimpiarTabla() {
    const cuerpoTabla = document.getElementById("cuerpotabla");
    // Eliminar todas las filas de la tabla
    while (cuerpoTabla.firstChild) {
        cuerpoTabla.removeChild(cuerpoTabla.firstChild);
    }
}