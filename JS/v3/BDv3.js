  // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
  // Add Firebase products that you want to use
import { getAuth, sendEmailVerification , createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'
import { getFirestore, collection, setDoc, updateDoc, getDoc, doc, where, query, getDocs} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js'
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
const auth = getAuth(app);
  // Establece un observador para el estado de la autenticación
onAuthStateChanged(auth, async (user) => {
    if (user) {
          // Si hay un usuario autenticado, carga su carrito
        await cargarCarritoUsuario(user.uid);
    } else {
        console.log('No hay usuario autenticado');
    }
});

  // Función para crear un usuario y su carrito en Firestore
export async function createUser(nom,usr,pass,ed,email,tel) {
    try {
          // Crea el usuario en Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;
        console.log(user);
          // Guarda la información del usuario en Firestore
        await setDoc(doc(firestore, 'Usuarios', user.uid), {
            Nombre: nom,
            Usuario: usr,
            Contrasena: pass,
            Edad: ed,
            Correo: email,
            Telefono: tel,
            Ventas: 0,
            Status: false,
            Ingresos: 0,
            Verificado: false
        });
          // Crea una colección de carrito para el usuario con el mismo ID
        await setDoc(doc(firestore, 'Carro', user.uid), {
                products: [] // Inicialmente el carrito estará vacío, pero puedes almacenar productos aquí
        });
          //Crea una colección del historial de compras del usuario
        await setDoc(doc(firestore, 'Historial', user.uid), {
            products: [] 
        });
        CorreoVerificacion(user);
        console.log('Usuario registrado exitosamente:', user);
        await new Promise(resolve => setTimeout(resolve, 2000));
        window.location.reload(true);
    } catch (error) {
        console.error('Error al registrar el usuario:', error.message);
        alert('Error al registrar el usuario: Correo electrónico en uso');
    }
}

async function CorreoVerificacion(user) {
  await new Promise(resolve => setTimeout(resolve, 1000));
        sendEmailVerification(user)
          .then(() => {
            // Email de verificación enviado correctamente
            console.log('Email de verificación enviado correctamente');
          })
          .catch((error) => {
            // Error al enviar el email de verificación
            console.error('Error al enviar el email de verificación:', error);
          });
          await new Promise(resolve => setTimeout(resolve, 1000));
}

  //Función para iniciar sesión con autenticación de Firestore
export const loginUser = async (email, password, verificacion,status) => {
    try {
      await setPersistence(auth, browserLocalPersistence);

          // Intenta iniciar sesión con el correo y la contraseña proporcionados
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const usr = auth.currentUser;
        const usuarioRef = doc(db, "Usuarios", usr.uid);
        if((verificacion && status) || usr.emailVerified){
          await updateDoc(usuarioRef, {
            Verificado: true
          });
            
          // El usuario ha iniciado sesión correctamente
        console.log("Inicio de sesión:", userCredential.user.email);
        alert("Inicio de sesión correcto");
          // Redirige al usuario a la página de productos
        window.location.replace("/Carrito/inicio.html");
          // Llama a la función para cargar el carrito del usuario
        }
        else{
          alert("El usuario se cuentra inhabilitado para poder acceder");
        }
        
    } catch (error) {
          // Hubo un error al iniciar sesión
        console.error("Error al iniciar sesión:", error.message);
        alert("Error al iniciar sesión. Por favor, intenta nuevamente.");
    }
}  
  // Función para cargar el carrito del usuario al iniciar sesión
export const cargarCarritoUsuario = async () => {
    try {
          // Obtiene la instancia de autenticación
        const auth = getAuth();

          // Verifica si hay un usuario autenticado
        const user = auth.currentUser;
        if (user && user.uid) { // Verifica que user no sea undefined y que uid esté definido
            const userId = user.uid;
  
              // Obtén una referencia a Firestore
            const firestore = getFirestore();
  
              // Consulta la información del carrito del usuario en Firestore
            const docRef = doc(firestore, 'Carro', userId);
            const docSnap = await getDoc(docRef);
  
            if (docSnap.exists()) {
                const cartData = docSnap.data();
                console.log('Carrito del usuario:', cartData);
                // Aquí puedes cargar la información del carrito en la página o realizar otras acciones necesarias
                console.log(userId)
            } else {
                console.log('No se encontró el carrito del usuario');
            }
        } else {
            console.log('No hay usuario autenticado o no se pudo obtener el UID');
        }
    } catch (error) {
        console.error('Error al cargar el carrito del usuario:', error.message);
    }
}


  
  // Función para guardar el carrito en Firestore
export async function saveCartToFirestore() {
    try {
        const user = auth.currentUser;
        if (user) {
            const userId = user.uid;
            const cartRef = doc(firestore, 'Carro', userId);
            await setDoc(cartRef, { items: cartItems });
            console.log('Carrito guardado en Firestore');
        } else {
            console.log('No hay usuario autenticado');
        }
    } catch (error) {
        console.error('Error al guardar el carrito en Firestore:', error.message);
    }
}  
    // Función para actualizar el carrito desde Firestore
export async function updateCartFromFirestore() {
    try {
        const user = auth.currentUser;
        if (user) {
        const userId = user.uid;
        const cartRef = doc(firestore, 'Carro', userId);
        const cartSnapshot = await getDoc(cartRef);
        if (cartSnapshot.exists()) {
            cartItems = cartSnapshot.data().items;
            console.log('Carrito cargado desde Firestore:', cartItems);
            updateCart();
        } else {
            console.log('No se encontró el carrito del usuario en Firestore');
        }
        } else {
            console.log('No hay usuario autenticado');
        }
    } catch (error) {
        console.error('Error al cargar el carrito desde Firestore:', error.message);
    }
}
  // Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
  //Función para validad que un usuario y/o el correo no estén registrados previamente
export const ConsultarUsuario = async (nom,user,pass,ed,email,tel) => {
    const usuariosCollection = collection(db, 'Usuarios');
    try {
          // Construir la consulta para buscar el usuario por su nombre
        const q = query(usuariosCollection, where('Usuario', '==', user));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
              // Iterar sobre los documentos encontrados (puede haber más de uno si hay usuarios con el mismo nombre)
            querySnapshot.forEach((doc) => {
                  // Mostrar los datos del usuario encontrado
                alert("El usuario "+user+" ya está registrado");
            });
        } else {
            createUser(nom,user,pass,ed,email,tel);
        }
    } catch (error) {
        console.error('Error al consultar el usuario:', error);
        alert("Error al registrar el usuario");
    }
}
  
  //Función para Obtener el correo del usuario para logearse
export async function ObtenerCorreo(user,pass){
    const usuariosCollection = collection(db, 'Usuarios');
    try {
          // Construir la consulta para buscar el usuario por su nombre
        const q = query(usuariosCollection, where('Usuario', '==', user));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
              // Iterar sobre los documentos encontrados (puede haber más de uno si hay usuarios con el mismo nombre)
            querySnapshot.forEach(async (doc) => {
                  // Mostrar los datos del usuario encontrado
                  loginUser(doc.data().Correo,pass,doc.data().Status,doc.data().Verificado);
                
            });
        } else {
            alert("Usuario no registrado");
        }
    } catch (error) {
        console.error('Error al consultar el usuario:', error);
        alert("Error al ingresar");
    }
}
