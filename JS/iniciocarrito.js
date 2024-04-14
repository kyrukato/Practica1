var carrito = document.querySelectorAll(".link_carrito");
var titulo = document.getElementById("titulo");
var usuario = getCookie("usuarioactual");

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
    titulo.textContent = usuario
};

carrito.forEach(function(elemento) {
    elemento.addEventListener('click', function() {
        // Obtener el nombre del ícono
        var nombreIcono = elemento.className.split(' ')[1]; // Asumiendo que la segunda clase es el nombre del ícono
        //alert('Se ha clickeado el ícono ' + nombreIcono);
        switch(nombreIcono){
            case "playeralsmnegra":
                var usuario = getCookie("usuarioactual");
                setCookie(usuario+nombreIcono,nombreIcono,1);
            break;
            case "tazalsm":
                var usuario = getCookie("usuarioactual");
                setCookie(usuario+nombreIcono,nombreIcono,1);
                alert(nombreIcono);
            break;
            case "cursolsmcesum":
                var usuario = getCookie("usuarioactual");
                setCookie(usuario+nombreIcono,nombreIcono,1);
            break;
            case "librolsm":
                var usuario = getCookie("usuarioactual");
                setCookie(usuario+nombreIcono,nombreIcono,1);
            break;
            case "librodigaloenseñas":
                var usuario = getCookie("usuarioactual");
                setCookie(usuario+nombreIcono,nombreIcono,1);
            break;
            case "cursolsmunjure":
                var usuario = getCookie("usuarioactual");
                setCookie(usuario+nombreIcono,nombreIcono,1);
            break;
        }
    });
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
                return colorPreferido;
            }
        }
        console.log("No se encontró ninguna preferencia de color en las cookies.");
        return null; // Devolver null si no se encuentra la preferencia de color
}
