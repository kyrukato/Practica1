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
const app = initializeApp(firebaseConfig);XMLDocument
// Obtiene una referencia a tu base de datos Firebase
const firestore = getFirestore(app);
const auth = getAuth();
const db = getFirestore(app);

const expresiones = {
	usuario: /^[a-zA-Z0-9\_\-]{5,16}$/, // Letras, numeros, guion y guion_bajo
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	password: /^.{6,12}$/, // 4 a 12 digitos.
	correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	telefono: /^\d{10}$/, // 7 a 14 numeros.
    edad: /^(?:100|[1-9]?[0-9])$/
}
const Nombre = document.getElementById("nombre");
const usuario = document.getElementById("usuario");
const Contrasena = document.getElementById("password");
const confirmar = document.getElementById("password2");
const correo = document.getElementById("correo");
const Telefono = document.getElementById("telefono");
const Edad = document.getElementById("edad");
const cerrar = document.getElementById("btnCerrar");
const enviar = document.getElementById("btnCambiar");
var pass = "";
var t = ""
var ed = "";
var name = "";
document.addEventListener("DOMContentLoaded",function(){
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            if(user.email === "admin@admin.com")
            {
                window.location.replace("/Carrito/adminv3.html");
            }
            else{
                correo.value = user.email;
                const querySnapshot = await getDocs(collection(db, "Usuarios"), where("Correo", "==", user.email));
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                    const usr = doc.data();
                    if(user.email === usr.Correo){
                        Nombre.value = usr.Nombre;
                        usuario.value = usr.Usuario;
                        Telefono.value = usr.Telefono;
                        Edad.value = usr.Edad;
                        Contrasena.value = usr.Contrasena;
                        pass = usr.Contrasena;
                        t = usr.Telefono;
                        ed = usr.Edad;
                        name = usr.Nombre;
                    }
                    });
                } 
            }
        } else {
            window.location.replace("/Carrito/loginv3.html");
        }
    });
});

cerrar.addEventListener("click", () =>{
    signOut(auth)
        .then(() => {
            // Cierre de sesión exitoso
            console.log("Sesión cerrada exitosamente.");
            window.location.replace("/Carrito/loginv3.html");
        })
        .catch((error) => {
            // Error al cerrar la sesión
            console.error("Error al cerrar la sesión:", error);
        });
});


enviar.addEventListener("click", async ()=>{
    const user = auth.currentUser;
    const userID = user.uid;
    if(Contrasena.value !== pass){
        if(expresiones.password.test(Contrasena.value)){
            if(Contrasena.value === confirmar.value){
                try{
                    const usuarioRef = doc(db, "Usuarios", userID);
                    // Set the "capital" field of the city 'DC'
                    await updateDoc(usuarioRef, {
                        Contrasena: Contrasena.value
                    });
                    alert("Contraseña actualizada correctamente");
                }
                catch(error){
                    console.log(error);
                    alert("Error al actualizar la contraseña");
                }
            }
            else{
                alert("Las contraseñas no coinciden");
            }
        }
        else{
            alert("Contraseña no válida, la contraseña debe tener una longitud entre 6 y 12 caracteres");
        }
    }
    if(Telefono.value !== t){
        if(expresiones.telefono.test(Telefono.value)){
            try{
                const usuarioRef = doc(db, "Usuarios", userID);
                await updateDoc(usuarioRef, {
                    Telefono: Telefono.value
                });
                alert("Teléfono actualizado correctamente");
            }
            catch(error){
                console.log(error);
                alert("Error al actualizar la información");
            }
        }
        else{
            alert("Número de teléfono ingresado no válido.")
        }
    }
    if(Edad.value !== ed){
        if(expresiones.edad.test(Edad.value)){
            try{
                const usuarioRef = doc(db, "Usuarios", userID);
                // Set the "capital" field of the city 'DC'
                await updateDoc(usuarioRef, {
                    Edad: Edad.value
                });
                alert("Edad actualizada correctamente");
            }
            catch(error){
                console.log(error);
                alert("Error al actualizar la Edad");
            }
        }
        else{
            alert("Edad ingresada no válida");
        }
    }
    if(Nombre.value !== name){
        if(expresiones.nombre.test(Nombre.value)){
            try{
                const usuarioRef = doc(db, "Usuarios", userID);
                await updateDoc(usuarioRef, {
                    Nombre: Nombre.value
                });
                alert("Nombre actualizado correctamente");
            }
            catch(error){
                console.log(error);
                alert("Error al actualizar en Nombre");
            }
        }
        else{
            alert("Nombre ingresado no válida");
        }
    }
});

