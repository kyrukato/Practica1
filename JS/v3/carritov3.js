import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'
import { getFirestore, collection, setDoc, getDoc, doc, where, query, getDocs, updateDoc} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js'
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
let total = 0.0;
window.onload = function() {
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

async function MostrarProducto(){
    listaProductos.forEach((item) => {
        let sub = parseFloat(item.Cantidad) * parseFloat(item.Precio);
        total += sub;
        const productCard = `
        <div class="grupo_producto" id="grupo_producto">
            <img src="${item.Link}" alt="${item.Nombre}" class="imagen_producto" >
        <div class="texto">
            <p class="compra">${item.Nombre}</p>
            <P class="total" id="total">COSTO: $${item.Precio}</P>
            
        </div>
        <div class="cantidad">
            <label for="cant" class="encabezado">CANTIDAD</label>
            <input type="number" class="c" id="pzp1" name="${item.Nombre}" min="0" value="${item.Cantidad}">
            <label for="as" class="encabezado">SUBTOTAL</label>
            <input type="text" readonly="yes" class="subt" id="${item.Nombre}" value="${sub}">
        </div>
        </div>
            `;
        document.getElementById("contenedor").innerHTML += productCard;
        let modificar = document.querySelectorAll(".c");
        modificar.forEach(d =>{
            d.addEventListener("change", (e) =>{
                ActualizarCantidad(e.target.name,e.target.value);
            });
        });
    });
    const productCard = `
    <div class="grupo" id="grupo__usuario">
    <p class="compra">TOTAL DE LA COMPRA</p>
    <P class="total" id="totalc">$0.00</P> 
    <div class="boton">
        <button type="button" class="btn_aceptar" id="btn_comprar">COMPRAR TODO</button><br>
        <button type="button" class="btn_cancelar" id="btn_cancelar">BORRAR TODO</button>
    </div>
</div>
            `;
        document.getElementById("contenedor").innerHTML += productCard;
        const comprar = document.getElementById("btn_comprar");
        comprar.addEventListener("click", () => {
            ComprarCarrito();
        });
        const cancelar = document.getElementById("btn_cancelar");
        cancelar.addEventListener("click", async () =>{
            CancelarCompra();
        });
    const inputTotal = document.getElementById("totalc");
    inputTotal.innerText = "$"+total;
}

function ActualizarCantidad(pnom,pcant){
    try{
        const user = auth.currentUser;
        if(user){
            const userID = user.uid;
            const ref = doc(db, "Carro", userID);
            const existe = listaProductos.findIndex(item => item.Nombre === pnom);
            console.log(existe);
            if(existe !== -1){
                listaProductos[existe].Cantidad = pcant;
                let subtotal = document.getElementById(pnom);
                subtotal.value = parseFloat(listaProductos[existe].Cantidad) * parseFloat(listaProductos[existe].Precio);
            }
            total = 0;
            listaProductos.forEach((items) =>{
                total += parseFloat(items.Cantidad) * parseFloat(items.Precio);
            });
            const inputTotal = document.getElementById("totalc");
            inputTotal.innerText = "$"+total;
            setDoc(ref,{items: listaProductos});
        }
    }
    catch(error){
        console.log(error);
    }
}


function ComprobarStok(){
    let disponible = true;
        listaProductos.forEach(async (item) =>{
            // Disminuir el stock del producto en la base de datos
            const productQuery = query(collection(db, 'Productos'), where('Nombre', '==', item.Nombre));
            const productQuerySnapshot = await getDocs(productQuery);
            if (!productQuerySnapshot.empty) {
                const productDoc = productQuerySnapshot.docs[0];
                const productData = productDoc.data();

                const newStock = productData.Cantidad - item.Cantidad;
                try{
                    if (newStock < 0) {
                        console.log('No hay suficiente stock disponible del producto ');
                        alert("No hay suficiente stock Disponible del producto " + item.Nombre);
                        disponible = false;
                        } 
                }
                catch(error){
                    console.log(error);
                }
            } else {
                console.log('No se encontró el producto en la base de datos');
                disponible = false;
                return disponible;
            }
        });
        return disponible;
}


function ComprarCarrito() {
    try {
        if(listaProductos.length === 0){
            alert("Su carrito está vacío");
        }
        else{
            if(ComprobarStok()){
                listaProductos.forEach(async (item) =>{
                    // Disminuir el stock del producto en la base de datos
                    const productQuery = query(collection(db, 'Productos'), where('Nombre', '==', item.Nombre));
                    const productQuerySnapshot = await getDocs(productQuery);
                    if (!productQuerySnapshot.empty) {
                        const productDoc = productQuerySnapshot.docs[0];
                        const productId = productDoc.id;
                        const productData = productDoc.data();
        
                        const newStock = productData.Cantidad - item.Cantidad;
                        const ventas = productData.Ventas + item.Cantidad;
                        try{
                            if (newStock >= 0) {
                                // Actualizar el stock solo si hay suficiente cantidad disponible
                                await updateDoc(doc(db, 'Productos', productId), { Cantidad: newStock, Ventas: ventas });
                                }
                        }
                        catch(error){
                            console.log(error);
                        }
                    } else {
                        console.log('No se encontró el producto en la base de datos');
                    }
                });
                LimpiarCarrito();
                }
        }
    } catch (error) {
        console.log(error);
        alert("Error al hacer la compra");
    }
}

async function CancelarCompra(){
    if(listaProductos.length === 0){
        alert("Su carrito esta vacío");
    }
    else{
        listaProductos = [];
        const user = auth.currentUser;
        const userID = user.uid;
        const ref = doc(db, "Carro", userID);
        setDoc(ref,{items: listaProductos});
        alert("Su compra se ha cancelado con éxito");
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.location.reload();
    }
}

async function LimpiarCarrito(){
    listaProductos = [];
    const user = auth.currentUser;
    const userID = user.uid;
    const ref = doc(db, "Carro", userID);
    setDoc(ref,{items: listaProductos});
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert("Su compra se ha realizado con éxito");
    window.location.reload();
}