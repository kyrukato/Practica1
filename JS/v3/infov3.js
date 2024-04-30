import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
// Add Firebase products that you want to use
import { getAuth, signOut, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'
import { getFirestore, collection, setDoc, getDoc, doc, Timestamp, where, query, getDocs, addDoc} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js'
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
const app = initializeApp(firebaseConfig);XMLDocument
// Obtiene una referencia a tu base de datos Firebase
const firestore = getFirestore(app);
const auth = getAuth();
const db = getFirestore(app);
let mensaje = [];

document.addEventListener("DOMContentLoaded",function(){
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.replace("/Carrito/loginv3.html");
        } 
    });
});

const btnEnviar = document.getElementById("btnEnviar");
const comentario = document.getElementById("comentario");
btnEnviar.addEventListener("click", async () =>{
    try{
        const user = auth.currentUser;
        if(user){
            if (comentario.value.trim() === "") {
                alert("No se pueden enviar mensajes vacíos");
            } else {
                const correo = user.email;
                const querySnapshot = await query(collection(db, "Usuarios"), where("Correo", "==", user.email));
                const documento = await getDocs(querySnapshot);
                const fecha = new Date()
                const timestamp = Timestamp.fromDate(fecha);
                if(!documento.empty){
                    const resultado = documento.docs[0];
                    mensaje.push({
                        Status: false,
                        Usuario: resultado.data().Nombre,
                        Correo: correo,
                        Comentario: comentario.value,
                        Fecha: timestamp
                    });
                    const docRef = await addDoc(collection(db, 'Mensajes'), {
                        Comentarios: mensaje
                    });
                    mensaje = [];
                }
            }
            
        }
    }
    catch(error){
        console.log(error);
    }
});