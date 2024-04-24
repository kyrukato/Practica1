  // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
  // Add Firebase products that you want to use
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'
import { getFirestore, collection, setDoc, getDoc, doc, where, query, getDocs} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js'
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";
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
const analytics = getAnalytics(app);
// Obtiene una referencia a tu base de datos Firebase
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app)

const btnEnviar = document.getElementById("boton");
const expresiones = {
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
  descripcion: /^[a-zA-ZÀ-ÿ\s]{1,400}$/, // Letras y espacios, pueden llevar acentos.
	cantidad: /^\d+(\.\d+)?$/, // 7 a 14 numeros.
  precio: /^\d+(\.\d+)?$/
}
const campos = {
  nombre: false,
  descripcion:false,
  cantidad: false,
  precio: false
}

const validarformulario = (e) =>{ 
  switch(e.target.name){
      case "nombre":
          validarCampo(expresiones.nombre, e.target, "nombre");
      break;
      case "descripcion":
          validarCampo(expresiones.descripcion, e.target, "descripcion"); 
      break;
      case "cantidad":
          validarCampo(expresiones.cantidad, e.target, "cantidad");
      break;
      case "precio":
          validarCampo(expresiones.precio, e.target, "precio");
      break;
  }
}

const validarCampo = (expresion, input, campo) =>{
  if(expresion.test(input.value)){
      document.getElementById(`grupo__${campo}`).classList.remove("formulario__grupo-incorrecto");
      document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-correcto");
      document.querySelector(`#grupo__${campo} i`).classList.add("fa-check-circle");
      document.querySelector(`#grupo__${campo} i`).classList.remove("fa-circle-xmark");
      document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove("formulario__input-error-activo");
      campos[campo] = true;
  }
  else{
      document.getElementById(`grupo__${campo}`).classList.remove("formulario__grupo-correcto");
      document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-incorrecto");
      document.querySelector(`#grupo__${campo} i`).classList.remove("fa-check-circle");
      document.querySelector(`#grupo__${campo} i`).classList.add("fa-circle-xmark");
      document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add("formulario__input-error-activo");
      campos[campo] = false;
  }
}

inputs.forEach((input)=>{
  input.addEventListener("keyup",validarformulario);
  input.addEventListener("blur",validarformulario);
});

btnEnviar.addEventListener("click", async () =>{
  e.preventDefault();
    if(campos.nombre && campos.cantidad && campos.precio && campos.descripcion ){
        document.querySelectorAll(".formulario__grupo-correcto").forEach((icono) =>{
            icono.classList.remove("formulario__grupo-correcto");
        });
        document.getElementById("formulario__mensaje").classList.remove("formulario__mensaje-activo");
        subirProducto();
    }
    else{
        if(!campos.nombre){
            document.getElementById(`grupo__nombre`).classList.add("formulario__grupo-incorrecto");
            document.getElementById(`grupo__nombre`).classList.remove("formulario__grupo-correcto");
            document.querySelector(`#grupo__nombre i`).classList.remove("fa-check-circle");
            document.querySelector(`#grupo__nombre i`).classList.add("fa-circle-xmark");
            document.querySelector(`#grupo__nombre .formulario__input-error`).classList.add("formulario__input-error-activo");
        }
        if(!campos.cantidad){
            document.getElementById(`grupo__cantidad`).classList.add("formulario__grupo-incorrecto");
            document.getElementById(`grupo__cantidad`).classList.remove("formulario__grupo-correcto");
            document.querySelector(`#grupo__cantidad i`).classList.remove("fa-check-circle");
            document.querySelector(`#grupo__cantidad i`).classList.add("fa-circle-xmark");
            document.querySelector(`#grupo__cantidad .formulario__input-error`).classList.add("formulario__input-error-activo");
        }
        if(!campos.descripcion){
            document.getElementById(`grupo__descripcion`).classList.add("formulario__grupo-incorrecto");
            document.getElementById(`grupo__descripcion`).classList.remove("formulario__grupo-correcto");
            document.querySelector(`#grupo__descripcion i`).classList.remove("fa-check-circle");
            document.querySelector(`#grupo__descripcion i`).classList.add("fa-circle-xmark");
            document.querySelector(`#grupo__descripcion .formulario__input-error`).classList.add("formulario__input-error-activo");
        }
        if(!campos.precio){
            document.getElementById(`grupo__precio`).classList.add("formulario__grupo-incorrecto");
            document.getElementById(`grupo__precio`).classList.remove("formulario__grupo-correcto");
            document.querySelector(`#grupo__precio i`).classList.remove("fa-check-circle");
            document.querySelector(`#grupo__precio i`).classList.add("fa-circle-xmark");
            document.querySelector(`#grupo__precio .formulario__input-error`).classList.add("formulario__input-error-activo");
        }
        document.getElementById("formulario__mensaje").classList.add("formulario__mensaje-activo");
    }
});

// Función para subir producto
export async function subirProducto() {
  var fileInput = document.getElementById('fileInput');
  var file = fileInput.files[0]; // Obtén el archivo seleccionado

  const referencia = ref(storage,"/Productos/"+file.name)
// Crear una referencia al storage de Firebase
//var storageRef = storage.ref('Productos/' + file.name);

// Subir el archivo al storage
const task = uploadBytes(referencia, file).then((snapshot) => {
  console.log('Uploaded a blob or file!');
});
  getDownloadURL(ref(storage, referencia))
  .then((url) => {
    const urld = url;
  })
  .catch((error) => {
    console.log(error.message);
  });
  
}