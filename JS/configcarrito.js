var colorfondo = document.getElementById("select");
var barra = document.getElementById("colorbarra");
var usuario = getCookie("usuarioactual");
var btnCambiar = document.getElementById("btnCambiar");
var btnRestaurar = document.getElementById("btnRestaurar");
var opcion;
var opcion2;


window.onload = function(){
    var fondo = getCookie(usuario+"fondo");
    var barrac = getCookie(usuario+"barra");
    if(fondo)
    {
        body.style.background = fondo;
    }
    if(barrac)
    {
        barranav.style.background = barrac;
    }
};


colorfondo.addEventListener("click",function(){
    opcion = this.value;
    body.style.background = opcion;
});

barra.addEventListener("click",function(){
    opcion2 = this.value;
    barranav.style.background = opcion2;
});

btnCambiar.addEventListener("click", function(){
    setCookie(usuario+"fondo",opcion,10);
    setCookie(usuario+"barra",opcion2,20);
});

btnRestaurar.addEventListener("click", function(){
    setCookie(usuario+"fondo","",0);
    setCookie(usuario+"barra","",0);
    location.reload;
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