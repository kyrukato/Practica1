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
const productosCollection = collection(db, 'Productos');
const auth = getAuth(app);
let productos = [];
let Nombres = [];
let Cantidades = [];
let cantidadTabla = 4;
let cantidadGrafica = 4;
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
            window.location.replace("/CorritoV2/loginv2.html");
        }
    });
    // Obtener el contexto del lienzo
    

};

async function CargarProductos(){
    try{
        const querySnapshot = await getDocs(productosCollection);
        querySnapshot.forEach((item) => {
            console.log(item);
            const prod = item.data();
            let producto ={
                Imagen: prod.Link,
                Nombre: prod.Nombre,
                Descripcion: prod.Descripcion,
                Precio: prod.Precio,
                Unidades: prod.Ventas
            };
            productos.push(producto);
        });
        productos.sort((a,b) => b.Unidades - a.Unidades);
        const top10 = productos.slice(0,cantidadTabla);
        const top5 = productos.slice(0,cantidadGrafica);
        top5.forEach((elemnto) =>{
            Nombres.push(elemnto.Nombre);
            Cantidades.push(elemnto.Unidades);
        });
        LlenarTabla(top10);
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
}

function LlenarTabla(arreglo){
    const cuerpoTabla = document.getElementById("cuerpotabla");
        arreglo.forEach(item =>{
            const fila = document.createElement("tr");
            
            const Imagen = document.createElement("img");
            Imagen.src = item.Imagen;
            Imagen.classList.add("imagenprod");
            const celdaImagen = document.createElement("td");
            celdaImagen.appendChild(Imagen);
            fila.appendChild(celdaImagen);

            // Crear celdas para cada dato y agregarlos a la fila
            const celdaNombre = document.createElement("td");
            celdaNombre.textContent = item.Nombre;
            fila.appendChild(celdaNombre);

            const cendaDescripcion = document.createElement("td");
            cendaDescripcion.textContent = item.Descripcion;
            fila.appendChild(cendaDescripcion);

            const celdaPrecio = document.createElement("td");
            celdaPrecio.textContent = "$"+item.Precio;
            fila.appendChild(celdaPrecio);

            const celdaEdad = document.createElement("td");
            celdaEdad.textContent = item.Unidades;
            fila.appendChild(celdaEdad);

            
            // Agregar la fila completa al cuerpo de la tabla
            cuerpoTabla.appendChild(fila);
        });
}
