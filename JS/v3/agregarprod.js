  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
  import { AgregarProducto } from "/JS/v3/cambiosbd.js";
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
      const formulario = document.getElementById("formulario");
      const inputs = document.querySelectorAll("#formulario input");
      // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  // Obtiene una referencia a tu base de datos Firebase
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);
  
  const btnEnviar = document.getElementById("boton");
  const expresiones = {
      nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
      cantidad: /^\d+(\.\d+)?$/, // 7 a 14 numeros.
    precio: /^\d+(\.\d+)?$/
  }
  const campos = {
    nombre: false,
    cantidad: false,
    precio: false,
    imagen: false
  }
  
  window.onload = function(){
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            if(user.email !== "admin@admin.com")
            {
                window.location.replace("/Carrito/usuariov3.html")
            }
        } else {
            window.location.replace("/Carrito/loginv3.html");
        }
    });
  }
  
  const validarformulario = (e) =>{ 
    switch(e.target.name){
        case "nombre":
            validarCampo(expresiones.nombre, e.target, "nombre");
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
  
  btnEnviar.addEventListener("click", async (e) =>{
    e.preventDefault();
      if(campos.nombre && campos.cantidad && campos.precio && campos.imagen){
          document.querySelectorAll(".formulario__grupo-correcto").forEach((icono) =>{
              icono.classList.remove("formulario__grupo-correcto");
          });
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
          if(!campos.precio){
              document.getElementById(`grupo__precio`).classList.add("formulario__grupo-incorrecto");
              document.getElementById(`grupo__precio`).classList.remove("formulario__grupo-correcto");
              document.querySelector(`#grupo__precio i`).classList.remove("fa-check-circle");
              document.querySelector(`#grupo__precio i`).classList.add("fa-circle-xmark");
              document.querySelector(`#grupo__precio .formulario__input-error`).classList.add("formulario__input-error-activo");
          }
          if(!campos.imagen){
            alert("No se ha subido una imagen");
          }
      }
  });
  
  var img = document.getElementById('fileInput');
  img.addEventListener("change", function(event) {
    // Verificar si se seleccionó un archivo
    if (event.target.files.length > 0) {
        // Se seleccionó un archivo, en este caso una imagen
        campos.imagen = true;
    } else {
        // No se seleccionó ningún archivo
        campos.imagen = false;
    }
  });
  
  
  // Función para subir producto
  export async function subirProducto() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0]; // Obtén el archivo seleccionado
    let nomprod = document.getElementById("nombre");
    let descprod = document.getElementById("des");
    let cantprod = document.getElementById("cantidad");
    let precprod = document.getElementById("precio");
    const nombre = nomprod.value;
    const descripcion = descprod.value;
    const cantidad = parseInt(cantprod.value);
    const precio = parseFloat(precprod.value);
    const referencia = ref(storage,"/Productos/"+file.name)
  // Crear una referencia al storage de Firebase
  //var storageRef = storage.ref('Productos/' + file.name);
  
  // Subir el archivo al storage
    const task = uploadBytes(referencia, file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
    getDownloadURL(ref(storage, "/Productos/"+file.name))
      .then((url) => {
        const imagenurl = url;
        AgregarProducto(cantidad,descripcion,imagenurl,nombre,precio,"Activo");
      })
      .catch((error) => {
        // Handle any errors
      });
  }