import { ConsultarUsuario } from "./BD.js";
const formulario = document.getElementById("formulario");
const inputs = document.querySelectorAll("#formulario input");
const cancelar = document.getElementById("btnCancelar");
const enviar = document.getElementById("btnEnviar");
const expresiones = {
	usuario: /^[a-zA-Z0-9\_\-]{5,16}$/, // Letras, numeros, guion y guion_bajo
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	password: /^.{6,12}$/, // 4 a 12 digitos.
	correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	telefono: /^\d{10}$/, // 7 a 14 numeros.
    edad: /^(?:100|[1-9]?[0-9])$/
}

const campos = {
    usuario: false,
    nombre: false,
    password:false,
    correo: false,
    telefono: false
}


const validarformulario = (e) =>{ 
    switch(e.target.name){
        case "usuario":
            validarCampo(expresiones.usuario, e.target, "usuario");
        break;
        case "nombre":
            validarCampo(expresiones.nombre, e.target, "nombre");
        break;
        case "password":
            validarCampo(expresiones.password, e.target, "password"); 
            validarContrasena();
        break;
        case "password2":
            validarContrasena();
        break;
        case "correo":
            validarCampo(expresiones.correo, e.target, "correo");
        break;
        case "telefono":
            validarCampo(expresiones.telefono, e.target, "telefono");
        break;
        case "edad":
            validarCampo(expresiones.edad, e.target, "edad");
        break;
    }
}

const validarContrasena = () =>{
    const pass1 = document.getElementById("password");
    const pass2 = document.getElementById("password2");

    if(pass1.value !== pass2.value)
    {
        document.getElementById(`grupo__password2`).classList.remove("formulario__grupo-correcto");
        document.getElementById(`grupo__password2`).classList.add("formulario__grupo-incorrecto");
        document.querySelector(`#grupo__password2 i`).classList.remove("fa-check-circle");
        document.querySelector(`#grupo__password2 i`).classList.add("fa-circle-xmark");
        document.querySelector(`#grupo__password2 .formulario__input-error`).classList.add("formulario__input-error-activo");
        campos["password"] = false;
    }
    else{
        document.getElementById(`grupo__password2`).classList.remove("formulario__grupo-incorrecto");
        document.getElementById(`grupo__password2`).classList.add("formulario__grupo-correcto");
        document.querySelector(`#grupo__password2 i`).classList.add("fa-check-circle");
        document.querySelector(`#grupo__password2 i`).classList.remove("fa-circle-xmark");
        document.querySelector(`#grupo__password2 .formulario__input-error`).classList.remove("formulario__input-error-activo");
        campos["password"] = true;
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

enviar.addEventListener("click",(e)=>{
    var usuario = document.getElementById("usuario");
    var contra = document.getElementById("password");
    var telefono = document.getElementById("telefono");
    var correo = document.getElementById("correo");
    var edad = document.getElementById("edad");
    var nombre = document.getElementById("nombre");
    var user = usuario.value;
    var pass = contra.value;
    var email = correo.value;
    var tel = telefono.value;
    var ed = edad.value;
    var nom = nombre.value;
    e.preventDefault();
    if(campos.usuario && campos.nombre && campos.password && campos.telefono && campos.correo &&    campos.edad){
        document.querySelectorAll(".formulario__grupo-correcto").forEach((icono) =>{
            icono.classList.remove("formulario__grupo-correcto");
        });
        document.getElementById("formulario__mensaje").classList.remove("formulario__mensaje-activo");
        ConsultarUsuario(nom,user,pass,ed,email,tel);
    }
    else{
        if(!campos.usuario){
            document.getElementById(`grupo__usuario`).classList.add("formulario__grupo-incorrecto");
            document.getElementById(`grupo__usuario`).classList.remove("formulario__grupo-correcto");
            document.querySelector(`#grupo__usuario i`).classList.remove("fa-check-circle");
            document.querySelector(`#grupo__usuario i`).classList.add("fa-circle-xmark");
            document.querySelector(`#grupo__usuario .formulario__input-error`).classList.add("formulario__input-error-activo");
        }
        if(!campos.nombre){
            document.getElementById(`grupo__nombre`).classList.add("formulario__grupo-incorrecto");
            document.getElementById(`grupo__nombre`).classList.remove("formulario__grupo-correcto");
            document.querySelector(`#grupo__nombre i`).classList.remove("fa-check-circle");
            document.querySelector(`#grupo__nombre i`).classList.add("fa-circle-xmark");
            document.querySelector(`#grupo__nombre .formulario__input-error`).classList.add("formulario__input-error-activo");
        }
        if(!campos.password){
            document.getElementById(`grupo__password`).classList.add("formulario__grupo-incorrecto");
            document.getElementById(`grupo__password`).classList.remove("formulario__grupo-correcto");
            document.querySelector(`#grupo__password i`).classList.remove("fa-check-circle");
            document.querySelector(`#grupo__password i`).classList.add("fa-circle-xmark");
            document.querySelector(`#grupo__password .formulario__input-error`).classList.add("formulario__input-error-activo");
        }
        if(!campos.correo){
            document.getElementById(`grupo__correo`).classList.add("formulario__grupo-incorrecto");
            document.getElementById(`grupo__correo`).classList.remove("formulario__grupo-correcto");
            document.querySelector(`#grupo__correo i`).classList.remove("fa-check-circle");
            document.querySelector(`#grupo__correo i`).classList.add("fa-circle-xmark");
            document.querySelector(`#grupo__correo .formulario__input-error`).classList.add("formulario__input-error-activo");
        }
        if(!campos.telefono){
            document.getElementById(`grupo__telefono`).classList.add("formulario__grupo-incorrecto");
            document.getElementById(`grupo__telefono`).classList.remove("formulario__grupo-correcto");
            document.querySelector(`#grupo__telefono i`).classList.remove("fa-check-circle");
            document.querySelector(`#grupo__telefono i`).classList.add("fa-circle-xmark");
            document.querySelector(`#grupo__telefono .formulario__input-error`).classList.add("formulario__input-error-activo");
        }
        if(!campos.edad){
            document.getElementById(`grupo__edad`).classList.add("formulario__grupo-incorrecto");
            document.getElementById(`grupo__edad`).classList.remove("formulario__grupo-correcto");
            document.querySelector(`#grupo__edad i`).classList.remove("fa-check-circle");
            document.querySelector(`#grupo__edad i`).classList.add("fa-circle-xmark");
            document.querySelector(`#grupo__edad .formulario__input-error`).classList.add("formulario__input-error-activo");
        }
        document.getElementById("formulario__mensaje").classList.add("formulario__mensaje-activo");
    }
});

cancelar.addEventListener("click", async () =>{
    window.location.replace("/CorritoV2/loginv2.html");
});

