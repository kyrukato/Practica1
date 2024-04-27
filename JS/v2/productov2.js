import { getCookie, setCookie } from "../cookies.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'
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
const buscar = document.getElementById("buscar");
const list = document.getElementById("prod");
const auth = getAuth(app);
let listaProductos = [];
window.onload = async function(){
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const usr = auth.currentUser;
            const userID = usr.uid;
            const ref = doc(db, "Carro", userID);
            const snapshot = await getDoc(ref);
            if(snapshot.exists){
                listaProductos = snapshot.data().items || [];
            }
            console.log(listaProductos);
            MostrarProducto();
        } else {
            window.location.replace("/CorritoV2/loginv2.html");
        }
    });
    
        
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
            window.location.replace("/CorritoV2/producto.html");
        }
    }
});

buscar.addEventListener("click", async () =>{
    window.location.replace("/CorritoV2/producto.html");
});

async function MostrarProducto(){
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
                <p class="info_articulo">$${producto.Precio} <i class="link_carrito playeralsmnegra fa-solid fa-cart-shopping ${producto.Precio} ${producto.Link}" id="${producto.Nombre}"></i> </p>
            </div>
            `;
            
            document.getElementById("contenedor").innerHTML += productCard;
            let carrito = document.querySelectorAll(".link_carrito");
            carrito.forEach(link => {
                link.addEventListener("click", (e) =>{
                    AgregarProducto(e.target.id, e.target.classList[4], e.target.classList[5]);
                });
            });
            }
            const opc = `
                <option value="${producto.Nombre}" id="${producto.Link}" ></option>
                `;
            document.getElementById("lista").innerHTML += opc;
        });
}

function AgregarProducto(nombre,precio,imagenprod){
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