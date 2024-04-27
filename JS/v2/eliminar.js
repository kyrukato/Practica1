import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
// Add Firebase products that you want to use
import { getAuth, signOut, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'
import { getFirestore, collection, setDoc, getDoc, doc, where, query, getDocs, updateDoc} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js'
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

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

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
// Obtiene una referencia a tu base de datos Firebase
const firestore = getFirestore(app);
const auth = getAuth();
const db = getFirestore(app);

const lista = document.getElementById("prod");
const name = document.getElementById("nombre");
const cant = document.getElementById("cantidad");
const descripcion = document.getElementById("Descripcion");
const precio = document.getElementById("precio");
const eliminar = document.getElementById("eliminar");

const productosCollection = collection(db, 'Productos');
document.addEventListener("DOMContentLoaded", async function(){
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            if(user.email === "admin@admin.com")
            {
                try {
                    let columna = 1;
                    const querySnapshot = await getDocs(productosCollection);
                    querySnapshot.forEach((doc) => {
                        const producto = doc.data();
                        if(producto.Status === "Activo"){
                            const productCard = `
                            <option value="${producto.Nombre}" id="${columna}" ></option>
                            `;
                            document.getElementById("lista").innerHTML += productCard;
                            columna++;
                        }
                    });
                } catch (error) {
                    console.error("Error al cargar los productos:", error);
                }
            }
            else{ 
                window.location.replace("/CorritoV2/iniciov2.html");
            }
        } else {
            window.location.replace("/CorritoV2/loginv2.html");
        }
    });
});

lista.addEventListener("change", async function(){
    var opc = this.value;
    const querySnapshot = await getDocs(productosCollection);
    querySnapshot.forEach((doc) => {
        const producto = doc.data();
        if(producto.Nombre === opc){
            name.value = producto.Nombre;
            cant.value = producto.Cantidad;
            descripcion.value = producto.Descripcion;
            precio.value = producto.Precio;
            eliminar.disabled = false;
        }
    });
});

eliminar.addEventListener("click", async () =>{
    if(confirm("Seguro que desea eliminar este producto?")){
        try{
            const q = query(collection(db, "Productos"), where("Nombre", '==', name.value));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                // Iterar sobre los documentos encontrados (normalmente solo debería haber uno)
                querySnapshot.forEach((d) => {
                    // Obtener el ID del documento
                    const docId = d.id;
                    // Actualizar el documento con el nuevo valor
                    try{
                        const productoRef = doc(db, "Productos", docId);
                        updateDoc(productoRef, {
                            Status: "Baja"
                        });
                        alert("Producto eliminado");
                    }
                    catch(error){
                        console.log(error);
                        alert("Error al actualizar la información");
                    }
                });
            } else {
                console.log('No se encontraron documentos que coincidan con la consulta.');
            }
        }
        catch(error){
            console.log(error);
            alert("Error al actualizar la información");
        }
    }
});