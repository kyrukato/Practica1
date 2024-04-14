const botonAceptar = document.getElementById("btnAceptar");
const avisoCookies = document.getElementById("aviso-cookies");
const fondoAviso = document.getElementById("fondo-aviso");
const color_Links = document.getElementById("colorLinks");
const color_fondo = document.getElementById("select")
const borrarcookies = document.getElementById("borrar");

window.onload = function(){
    var colorPreferido = getCookie("colorfondo"); // Obtener el color preferido del usuario desde la cookie
    var colordeLinks = getCookie("p1");
    if (colorPreferido) { // Verificar si se encontró un color preferido
        body.style.background = colorPreferido; // Aplicar el color de fondo al cuerpo de la página
        console.log("Color preferido aplicado:", colorPreferido);
    }
    if(colordeLinks)
    {
        p5.style.background = colordeLinks;
        p4.style.background = colordeLinks;
        p3.style.background = colordeLinks;
        p2.style.background = colordeLinks;
        p1.style.background = colordeLinks;
    }
};

//Creamos un evento donde se ecucha el cambio que tiene nuestro elemento
color_fondo.addEventListener("change", function() {
    //Creamos una variable auxiliar que nos sive para obtener el elemento cambiado
    var opcionSeleccionada = this.value;
    //Imprimimos la salida en el elemento seleccionado
    body.style.background = opcionSeleccionada;
    setCookie("colorfondo", opcionSeleccionada, 1);
});

color_Links.addEventListener("change", function() {
    var opcionSeleccionada = this.value;
    //Imprimimos la salida en el elemento seleccionado
    p5.style.background = opcionSeleccionada;
    p4.style.background = opcionSeleccionada;
    p3.style.background = opcionSeleccionada;
    p2.style.background = opcionSeleccionada;
    p1.style.background = opcionSeleccionada;
    setCookie("p1", opcionSeleccionada, 1);
    setCookie("p2", opcionSeleccionada, 1);
    setCookie("p3", opcionSeleccionada, 1);
    setCookie("p4", opcionSeleccionada, 1);
    setCookie("p5", opcionSeleccionada, 1);
});


function setCookie(nombre,valor,expiracion)
{
    var d = new Date();
    d.setTime(d.getTime()+expiracion*24*60*60*1000);
    var exp = "expires="+d.toUTCString();
    document.cookie = nombre+"="+valor+";"+exp+";path=/;";
}

function getCookie(nombre){
    var nom = nombre+"=";
        var cookies = document.cookie.split(';'); // Obtener todas las cookies
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim(); // Eliminar espacios en blanco alrededor de la cookie
            if (cookie.indexOf(nom) === 0) { // Verificar si la cookie contiene la preferencia de color
                var colorPreferido = cookie.substring(nom.length, cookie.length); // Obtener el valor de la preferencia de color
                console.log("Preferencia de color recuperada:", colorPreferido);
                return colorPreferido;
            }
        }
        console.log("No se encontró ninguna preferencia de color en las cookies.");
        return null; // Devolver null si no se encuentra la preferencia de color
}

borrarcookies.addEventListener("click", borrar_cookies);

function borrar_cookies(){
    setCookie("colorfondo","",0);
    setCookie("p1","",0);
    setCookie("p2","",0);
    setCookie("p3","",0);
    setCookie("p4","",0);
    setCookie("p5","",0);
    location.reload();
}

dataLayer = [];

if(!localStorage.getItem("cookies-aceptadas"))
{
    avisoCookies.classList.add("activo");
    fondoAviso.classList.add("activo");
}

botonAceptar.addEventListener("click", () =>{
    avisoCookies.classList.remove("activo");
    fondoAviso.classList.remove("activo");
    localStorage.setItem("cookies-aceptadas",true);

    dataLayer.push({"event": "cookies-personalizadas"});
});
