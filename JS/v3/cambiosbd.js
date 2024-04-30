import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
// Add Firebase products that you want to use
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'
import { getFirestore, collection, setDoc, getDoc, addDoc, where, query, getDocs} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js'
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";

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
const analytics = getAnalytics(app);
// Obtiene una referencia a tu base de datos Firebase
const db = getFirestore(app);
const auth = getAuth(app);
export async function AgregarProducto(cantidad, descripcion, link, nombre, precio, status){
    try{
        const docRef = await addDoc(collection(db, 'Productos'), {
            Cantidad: cantidad,
            Descripcion: descripcion,
            Link: link,
            Nombre: nombre,
            Precio: precio,
            Status: status,
            Ventas: 0
        });
        alert("Producto registrado exitosamente");
        location.reload();
    }
    catch(error){
        console.log(error);
        alert("Error al registrar el producto");
    }
}