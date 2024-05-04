import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
// Add Firebase products that you want to use
import { getAuth, signOut, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'
import { getFirestore, collection, setDoc, getDoc, doc, where, query, getDocs, updateDoc} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js'; // Agregar getDownloadURL
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

const storage = getStorage(app)
const lista = document.getElementById("prod");
const name = document.getElementById("nombre");
const cant = document.getElementById("cantidad");
const descripcion = document.getElementById("Descripcion");
const precio = document.getElementById("precio");
const cambiar = document.getElementById("cambiar");

let nom ="";
let cantidad = "";
let desc = "";
let prec = "";
let imagen = false;
var img = document.getElementById('fileInput');
img.addEventListener("change", function(event) {
    // Verificar si se seleccionó un archivo
    if (event.target.files.length > 0) {
        // Se seleccionó un archivo, en este caso una imagen
        imagen = true;
    } else {
      // No se seleccionó ningún archivo
        imagen = false;
    }
});

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
                window.location.replace("/Carrito/usuariov3.html");
            }
        } else {
            window.location.replace("/Carrito/loginv3.html");
        }
    })
});

lista.addEventListener("change", async function(){
    var opc = this.value;
    const querySnapshot = await getDocs(productosCollection);
    querySnapshot.forEach((doc) => {
        const producto = doc.data();
        if(producto.Nombre === opc){
            name.value = producto.Nombre;
            nom = name.value;
            cant.value = producto.Cantidad;
            cantidad = cant.value;
            descripcion.value = producto.Descripcion;
            desc = descripcion.value;
            precio.value = producto.Precio;
            prec = precio.value;
            cambiar.disabled = false;
        }
    });
});

async function SubirImagen(productoRef){
    var file = img.files[0];
    const referencia = ref(storage,"/Productos/"+file.name)
    const task = uploadBytes(referencia, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
    });
    getDownloadURL(ref(storage, "/Productos/"+file.name))
    .then((url) => {
    const imagenurl = url;
    updateDoc(productoRef, {
    Link: imagenurl
    });
    })
    .catch((error) => {
    // Handle any errors
    console.log(error);
    });
}

cambiar.addEventListener("click", async () =>{
    if(confirm("Seguro que desea modificar este producto?")){
        try{
            const q = query(collection(db, "Productos"), where("Nombre", '==', nom));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                // Iterar sobre los documentos encontrados (normalmente solo debería haber uno)
                querySnapshot.forEach((d) => {
                    // Obtener el ID del documento
                    const docId = d.id;
                    // Actualizar el documento con el nuevo valor
                    try{
                        const productoRef = doc(db, "Productos", docId);
                        if(nom !== nombre.value){
                            updateDoc(productoRef, {
                                Nombre: nombre.value
                            });
                        }
                        if(cantidad !== cant.value){
                            updateDoc(productoRef, {
                                Cantidad: cant.value
                            });
                        }
                        if(prec !== precio.value){
                            updateDoc(productoRef, {
                                Precio: precio.value
                            });
                        }
                        if(desc !== descripcion.value){
                            updateDoc(productoRef, {
                                Descripcion: descripcion.value
                            });
                        }
                        if(imagen){
                            for (let i = 0; i < 4; i++) {
                                SubirImagen(productoRef);
                            }
                            cambiar.disabled = true;
                        }
                    }
                    catch(error){
                        console.log(error);
                        alert("Error al actualizar la información");
                    }
                });
            } else {
                console.log('No se encontraron documentos que coincidan con la consulta.');
            }
            alert("Producto actualizado correctamente");
        }
        catch(error){
            console.log(error);
            alert("Error al actualizar la información");
        }
    }
});