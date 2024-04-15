var btnAceptar = document.getElementById("btn_aceptar");
var btnCancelar = document.getElementById("btn_cancelar");
var total_producto = document.getElementById("pzp1");
var total_producto2 = document.getElementById("pzp2");
var total_producto3 = document.getElementById("pzp3");
var total_producto4 = document.getElementById("pzp4");
var total_producto5 = document.getElementById("pzp5");
var total_producto6 = document.getElementById("pzp6");
var titulo = document.getElementById("titulo");
var sbt1 = document.getElementById("sub1");
var sbt2 = document.getElementById("sub2");
var sbt3 = document.getElementById("sub3");
var sbt4 = document.getElementById("sub4");
var sbt5 = document.getElementById("sub5");
var sbt6 = document.getElementById("sub6");
var t = document.getElementById("totalc");
let total = 0;
var t1=0;
var t2=0;
var t3=0;
var t4=0;
var t5=0;
var t6=0;

window.onload = function(){
    var user = getCookie("usuarioactual");
    var producto = getCookie(user+"playeralsmnegra");
    var producto2 = getCookie(user+"tazalsm");
    var producto3 = getCookie(user+"cursolsmcesum");
    var producto4 = getCookie(user+"librolsm");
    var producto5 = getCookie(user+"cursolsmunjure");
    var producto6 = getCookie(user+"librodigaloenseñas");
    if(producto)
    {
        document.getElementById(`grupo_producto`).classList.add("grupo_producto-seleccionado");
    }
    if(producto2)
    {
        document.getElementById(`grupo_producto2`).classList.add("grupo_producto-seleccionado");
    }
    if(producto3)
    {
        document.getElementById(`grupo_producto3`).classList.add("grupo_producto-seleccionado");
    }
    if(producto4)
    {
        document.getElementById(`grupo_producto4`).classList.add("grupo_producto-seleccionado");
    }
    if(producto5)
    {
        document.getElementById(`grupo_producto5`).classList.add("grupo_producto-seleccionado");
    }
    if(producto6)
    {
        document.getElementById(`grupo_producto6`).classList.add("grupo_producto-seleccionado");
    }

    var fondo = getCookie(user+"fondo");
    var barrac = getCookie(user+"barra");
    if(fondo)
    {
        body.style.background = fondo;
    }
    if(barrac)
    {
        barranav.style.background = barrac;
    }
    titulo.textContent = user;
}


btnAceptar.addEventListener("click", () =>{
    var user = getCookie("usuarioactual");
    var producto = getCookie(user+"playeralsmnegra");
    var producto2 = getCookie(user+"tazalsm");
    var producto3 = getCookie(user+"cursolsmcesum");
    var producto4 = getCookie(user+"librolsm");
    var producto5 = getCookie(user+"cursolsmunjure");
    var producto6 = getCookie(user+"librodigaloenseñas");
    if(producto)
    {
        document.getElementById(`grupo_producto`).classList.remove("grupo_producto-seleccionado");
        setCookie(user+"playeralsmnegra","",0);
    }
    if(producto2)
    {
        document.getElementById(`grupo_producto2`).classList.remove("grupo_producto-seleccionado");
        setCookie(user+"tazalsm","",0);
    }
    if(producto3)
    {
        document.getElementById(`grupo_producto3`).classList.remove("grupo_producto-seleccionado");
        setCookie(user+"cursolsmcesum","",0);
    }
    if(producto4)
    {
        document.getElementById(`grupo_producto4`).classList.remove("grupo_producto-seleccionado");
        setCookie(user+"librolsm","",0);
    }
    if(producto5)
    {
        document.getElementById(`grupo_producto5`).classList.remove("grupo_producto-seleccionado");
        setCookie(user+"cursolsmunjure","",0);
    }
    if(producto6)
    {
        document.getElementById(`grupo_producto6`).classList.remove("grupo_producto-seleccionado");
        setCookie(user+"librodigaloenseñas","",0);
    }
    
    location.reload;
    alert("El total de su compra es de: $"+total+".00");
});

btnCancelar.addEventListener("click", () =>{
    var user = getCookie("usuarioactual");
    var producto = getCookie(user+"playeralsmnegra");
    var producto2 = getCookie(user+"tazalsm");
    var producto3 = getCookie(user+"cursolsmcesum");
    var producto4 = getCookie(user+"librolsm");
    var producto5 = getCookie(user+"cursolsmunjure");
    var producto6 = getCookie(user+"librodigaloenseñas");
    if(producto)
    {
        document.getElementById(`grupo_producto`).classList.remove("grupo_producto-seleccionado");
        setCookie(user+"playeralsmnegra","",0);
    }
    if(producto2)
    {
        document.getElementById(`grupo_producto2`).classList.remove("grupo_producto-seleccionado");
        setCookie(user+"tazalsm","",0);
    }
    if(producto3)
    {
        document.getElementById(`grupo_producto3`).classList.remove("grupo_producto-seleccionado");
        setCookie(user+"cursolsmcesum","",0);
    }
    if(producto4)
    {
        document.getElementById(`grupo_producto4`).classList.remove("grupo_producto-seleccionado");
        setCookie(user+"librolsm","",0);
    }
    if(producto5)
    {
        document.getElementById(`grupo_producto5`).classList.remove("grupo_producto-seleccionado");
        setCookie(user+"cursolsmunjure","",0);
    }
    if(producto6)
    {
        document.getElementById(`grupo_producto6`).classList.remove("grupo_producto-seleccionado");
        setCookie(user+"librodigaloenseñas","",0);
    }
    
    location.reload;
    //alert(document.cookie);
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

total_producto.addEventListener("change",function(){
    let tp1 = parseInt(total_producto.value*400);
    sbt1.value = tp1;
    t1 = tp1;
    totalcompra();
});
total_producto2.addEventListener("change",function(){
    let tp2 = parseInt(total_producto2.value*400);
    sbt2.value = tp2;
    t2 = tp2;
    totalcompra();
});
total_producto3.addEventListener("change",function(){
    let tp3 = parseInt(total_producto3.value*400);
    sbt3.value = tp3;
    t3 = tp3;
    totalcompra();
});
total_producto4.addEventListener("change",function(){
    let tp4 = parseInt(total_producto4.value*400);
    sbt4.value = tp4;
    t4 = tp4;
    totalcompra();
});
total_producto5.addEventListener("change",function(){
    let tp5 = parseInt(total_producto.value*400);
    sbt5.value = tp5;
    t5 = tp5;
    totalcompra();
});
total_producto6.addEventListener("change",function(){
    let tp6 = parseInt(total_producto6.value*400);
    sbt6.value = tp6;
    t6= tp6;
    totalcompra();
});

function borrar_cookies(){
    setCookie(user+"playeralsmnegra","",0);
}

function totalcompra() {
    total = t1+t2+t3+t4+t5+t6;
    t.textContent = "$"+total+".00";
}