import {ObtenerCorreo} from "./BDv3.js";
const cancelar = document.getElementById("btnCancelar");
const login = document.getElementById("btnEnviar");
var user = document.getElementById("usuario");
var pass = document.getElementById("password");

login.addEventListener("click", async () => {
    let usuario = user.value;
    let contra = pass.value;
    ObtenerCorreo(usuario,contra);
});