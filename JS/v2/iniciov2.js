// Importa el SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

window.onload = function(){
    // Llamar a la función para cargar los productos al cargar la página
    cargarProductos();
};

// Inicializa tu aplicación Firebase
const app = initializeApp(firebaseConfig);

// Referencia a la colección de productos en Firestore
const db = getFirestore(app);
const productosCollection = collection(db, 'Productos');

// Función para cargar los productos desde Firestore y mostrarlos en la página
async function cargarProductos() {
    try {
        const querySnapshot = await getDocs(productosCollection);
        querySnapshot.forEach((doc) => {
            const producto = doc.data();
            const productCard = `
            <div class="grupo" id="grupo__usuario">
                <div class="imagen" id="imagen">
                    <img src="${producto.Link}" alt="${producto.Nombre}" class="logo2" >
                </div>
                <p class="info_articulo">${producto.Nombre} </p>
                <p class="info_articulo">$${producto.Precio} <i class="link_carrito playeralsmnegra fa-solid fa-cart-shopping"></i></i> </p>
            </div>
            `;
            document.getElementById("contenedor").innerHTML += productCard;
        });
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}


