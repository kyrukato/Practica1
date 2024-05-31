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

const btnSeleccionar = document.getElementById("seleccionar");
const btnBuscar = document.getElementById("mostrar");
let reporte = null;
let texto = document.getElementById("label");
let texto2 = document.getElementById("label2");

btnSeleccionar.addEventListener('click', () =>{
    ReporteSeleccionado();
});

function ReporteSeleccionado() {
    const radios = document.getElementsByName('opc');
    for (const radio of radios) {
        if (radio.checked) {
            reporte = radio.value;
            break;
        }
    }
    switch(reporte){
        case "dia":
            document.getElementById("label").classList.add("visible");
            document.getElementById("dia").classList.add("visible");
            document.getElementById("mostrar").classList.add("visible");
            document.getElementById("semana").classList.remove("visible");
            document.getElementById("mes").classList.remove("visible");
            document.getElementById("dia2").classList.remove("visible");
            document.getElementById("label2").classList.remove("visible");
            texto.textContent = "SELECCIONE LA FECHA A BUSCAR";
            break;
        case "semana":
            document.getElementById("label").classList.add("visible");
            document.getElementById("dia").classList.remove("visible");
            document.getElementById("mostrar").classList.add("visible");
            document.getElementById("semana").classList.add("visible");
            document.getElementById("mes").classList.remove("visible");
            document.getElementById("dia2").classList.remove("visible");
            document.getElementById("label2").classList.remove("visible");
            texto.textContent = "SELECCIONE LA SEMANA A BUSCAR";
            break;
        case "mes":
            document.getElementById("label").classList.add("visible");
            document.getElementById("dia").classList.remove("visible");
            document.getElementById("mostrar").classList.add("visible");
            document.getElementById("semana").classList.remove("visible");
            document.getElementById("mes").classList.add("visible");
            document.getElementById("dia2").classList.remove("visible");
            document.getElementById("label2").classList.remove("visible");
            texto.textContent = "SELECCIONE EL MES A BUSCAR";
            break;
        case "periodo":
            document.getElementById("label").classList.add("visible");
            document.getElementById("dia").classList.add("visible");
            document.getElementById("mostrar").classList.add("visible");
            document.getElementById("semana").classList.remove("visible");
            document.getElementById("mes").classList.remove("visible");
            document.getElementById("dia2").classList.add("visible");
            document.getElementById("label2").classList.add("visible");
            texto.textContent = "SELECCIONE LA FECHA DE INICIO";
            texto2.textContent = "SELECCIONE LA FECHA DE FIN";
            break;
        default:
            alert("FAVOR DE SELECCIONAR UN VALOR DE BÚSQUEDA PARA EL REPORTE");
            break;
    }
}

btnBuscar.addEventListener('click', () => {
    switch(reporte){
        case "dia":
            VentasPorDia();
            break;
        case "semana":
            VentasPorSemana();
            break;
        case "mes":
            VentasPorMes();
            break;
        case "periodo":
            VentasPorPeriodo();
            break;
        default:
            alert("FAVOR DE SELECCIONAR UNA OPCIÓN");
            break;
    }
});

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

async function VentasPorDia() {
    const fechaInput = document.getElementById('mes').value;
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
}

async function VentasPorSemana() {
    const fechaInput = document.getElementById('semana').value;
    LimpiarTabla();
    try {
        const [year, week] = fechaInput.split('-W');
        const primerDia = new Date(year, 0, 1 + (week -1 ) * 7);
        const ultimoDia = new Date(primerDia);
        ultimoDia.setDate(ultimoDia.getDate() + 6);
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
}

async function VentasPorMes() {
    const fechaInput = document.getElementById('mes').value;
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
}

async function VentasPorPeriodo() {
    const fechaInput = document.getElementById('dia').value;
    const fechaInput2 = document.getElementById("dia2").value;
    LimpiarTabla();
    // Convertir la fecha a un objeto de fecha de JavaScript
    const fecha = new Date(fechaInput);
    const fecha2 = new Date(fechaInput2);
    const start = startOfDay(fecha);
    const end = endOfDay(fecha2);
    // Realizar la consulta en Firestore utilizando el rango de fechas
    const q = query(collection(db, 'Ventas'));
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
        const q = doc.data();
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
}

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