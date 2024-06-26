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
const usuariosCollection = collection(db, 'Usuarios');
const auth = getAuth(app);
let usuarios = [];
let Nombres = [];
let Cantidades = [];
let Nombres2 = [];
let Cantidades2 = [];
let cantidadTabla = 10;
let cantidadGrafica = 5;
window.onload = async function(){
    // Llamar a la función para cargar los productos al cargar la página    
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const usuario = auth.currentUser;
            if(usuario.email === "admin@admin.com"){
                CargarProductos();
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

async function CargarProductos(){
    try{
        const querySnapshot = await getDocs(usuariosCollection);
        querySnapshot.forEach((item) => {
            const prod = item.data();
            if(prod.Usuario !== "admin"){
                let producto ={
                    Nombre: prod.Nombre,
                    Usuario: prod.Usuario,
                    Productos: prod.Ventas,
                    Ingresos: prod.Ingresos
                };
                usuarios.push(producto);
            }
        });
        usuarios.sort((a,b) => b.Ingresos - a.Ingresos);
        const top10 = usuarios.slice(0,cantidadTabla);
        const top5 = usuarios.slice(0,cantidadGrafica);
        top5.forEach((elemnto) =>{
            Nombres.push(elemnto.Usuario);
            Cantidades.push(elemnto.Ingresos);
        });
        LlenarTabla(top10,1); 
        usuarios.sort((a,b) => a.Ingresos - b.Ingresos);
        const menores10 = usuarios.slice(0,cantidadTabla);
        const menores5 = usuarios.slice(0,cantidadGrafica);
        menores5.forEach((elemnto) =>{
            Nombres2.push(elemnto.Usuario);
            Cantidades2.push(elemnto.Ingresos);
        });
        LlenarTabla(menores10,2);
    }
    catch(error){
        console.log(error);
    }
    try{
        const ctx = document.getElementById('myChart').getContext('2d');
        const data = {
            labels: Nombres,
            datasets: [{
                label: 'Ventas',
                data: Cantidades,
                backgroundColor: '#A58F3E',
                borderColor: '#A58F3E',
                borderWidth: 1
            }]
        };

        // Crear la instancia del gráfico
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    catch(error){
        console.log(error);
    }
    try{
        const ctx = document.getElementById('myChart2').getContext('2d');
        const data = {
            labels: Nombres2,
            datasets: [{
                label: 'Ventas',
                data: Cantidades2,
                backgroundColor: '#A58F3E',
                borderColor: '#A58F3E',
                borderWidth: 1
            }]
        };

        // Crear la instancia del gráfico
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    catch(error){
        console.log(error);
    }
}

function LlenarTabla(arreglo,tabla){
    const cuerpoTabla = document.getElementById("cuerpotabla"+tabla);
        arreglo.forEach(item =>{
            const fila = document.createElement("tr");

            // Crear celdas para cada dato y agregarlos a la fila
            const celdaNombre = document.createElement("td");
            celdaNombre.textContent = item.Nombre;
            fila.appendChild(celdaNombre);

            const celdaUsuario = document.createElement("td");
            celdaUsuario.textContent = item.Usuario;
            fila.appendChild(celdaUsuario);

            const celdaProductos = document.createElement("td");
            celdaProductos.textContent = item.Productos;
            fila.appendChild(celdaProductos);

            const celdaIngresos = document.createElement("td");
            celdaIngresos.textContent = item.Ingresos;
            fila.appendChild(celdaIngresos);
            
            // Agregar la fila completa al cuerpo de la tabla
            cuerpoTabla.appendChild(fila);
        });
}