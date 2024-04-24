export async function setCookie(nombre,valor,expiracion)
{
    var d = new Date();
    d.setTime(d.getTime()+expiracion*24*60*60*1000);
    var exp = "expires="+d.toUTCString();
    document.cookie = nombre+"="+valor+";"+exp+";path=/;";
}

export function getCookie(nombre){
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
