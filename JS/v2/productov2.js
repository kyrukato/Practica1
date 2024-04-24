import { getCookie, setCookie } from "../cookies.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, setDoc, getDoc, doc, where, query, getDocs} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js'
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
window.onload = async function(){
    var p = getCookie("p");
    const querySnapshot = await getDocs(productosCollection);
        querySnapshot.forEach((doc) => {
            const producto = doc.data();
            if(producto.Nombre === p){
                const productCard = `
            <div class="grupo" id="grupo__producto" style="grid-column: 2;">
                <div class="imagen" id="imagen">
                    <img src="${producto.Link}" alt="${producto.Nombre}" class="logo2 prod" >
                </div>
                <p class="info_articulo">${producto.Nombre}</p>
                <p class="info_articulo">Descripción: <br>${producto.Descripcion}<p>
                <p class="info_articulo">$${producto.Precio} <i class="link_carrito playeralsmnegra fa-solid fa-cart-shopping"></i></i> </p>
            </div>
            `;
            document.getElementById("contenedor").innerHTML += productCard;
            }
        });
}