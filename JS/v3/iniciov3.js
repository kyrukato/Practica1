// Importa el SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'
import { getFirestore, collection, getDocs, setDoc, doc, getDoc} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
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
const buscar = document.getElementById("buscar");
const list = document.getElementById("prod");
const auth = getAuth(app);
let nombreProducto ="";
let listaProductos = [];
// Función para cargar los productos desde Firestore y mostrarlos en la página

window.onload = async function(){
    // Llamar a la función para cargar los productos al cargar la página
    
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            
            
            cargarProductos();
            const usr = auth.currentUser;
            const userID = usr.uid;
            const ref = doc(db, "Carro", userID);
            const snapshot = await getDoc(ref);
            if(snapshot.exists){
                listaProductos = snapshot.data().items || [];
            }
        } else {
            window.location.replace("/Carrito/loginv3.html");
        }
    });
};
async function cargarProductos() {
    try {
        const querySnapshot = await getDocs(productosCollection);
        let columna = 1;
        querySnapshot.forEach((doc) => {
            const producto = doc.data();
            if(producto.Status === "Activo"){
                const productCard = `
                <div class="grupo" id="grupo__producto" style="grid-column: ${columna};">
                    <div class="imagen" id="imagen">
                        <img src="${producto.Link}" alt="${producto.Nombre}" class="logo2">
                    </div>
                    <button type="button" class="btn btn_prod"  name="${producto.Nombre}">${producto.Nombre}</button>
                    <p class="info_articulo">$${producto.Precio} <i class="link_carrito link fa-solid fa-cart-shopping ${producto.Precio} ${producto.Link}" id="${producto.Nombre}" ></i> </p>
                    
                </div>
                `;
                document.getElementById("contenedor").innerHTML += productCard;
                const opc = `
                <option value="${producto.Nombre}" id="${producto.Link}" ></option>
                `;
                document.getElementById("lista").innerHTML += opc;
                columna++;
                if(columna>3){
                    columna = 1;
                }
                
                let btnprod = document.querySelectorAll(".btn")
                btnprod.forEach(btn => {
                    btn.addEventListener("click", (a) =>{
                        setCookie("p",a.target.name,10);
                        window.location.replace("/Carrito/productov3.html");
                    });
                });
                
                let carrito = document.querySelectorAll(".link_carrito");
                carrito.forEach(link => {
                    link.addEventListener("click", (e) =>{
                        AgregarProducto(e.target.id, e.target.classList[4], e.target.classList[5]);
                    });
                });
            }
        });
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}


list.addEventListener("change", async function() {
    var opc = this.value;
    try{
        const querySnapshot = await getDocs(productosCollection);
        querySnapshot.forEach((doc) => {
        const producto = doc.data();
        if(producto.Nombre === opc){
            setCookie("p",opc,10);
        }
    });
    }
    catch(error){
        console.log(error);
    }
});

list.addEventListener("keypress",function(keyEvent){
    if(keyEvent.key === 'Enter'){
        if(list.value){
            window.location.replace('/Carrito/productov3.html');
        }
    }
});

buscar.addEventListener("click", async () =>{
    window.location.replace("/Carrito/productov3.html");
});



export function AgregarProducto(nombre,precio,imagenprod){
    try{
        const user = auth.currentUser;
        if(user){
            const userID = user.uid;
            const ref = doc(db, "Carro", userID);
            const existe = listaProductos.findIndex(item => item.Nombre === nombre);
            console.log(existe);
            if(existe !== -1){
                listaProductos[existe].Cantidad += 1;
            }
            else{
                listaProductos.push({
                    Nombre: nombre,
                    Precio: precio,
                    Link: imagenprod,
                    Cantidad: 1
                });
            }
            setDoc(ref,{items: listaProductos});
            console.log(listaProductos);
        }
    }
    catch(error){
        console.log(error);
    }
}