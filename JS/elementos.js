//Creamos las variables que vamos a usar
var cambiolista = document.getElementById("lista");
var cambioseleccion = document.getElementById("select");
var cant1 = document.getElementById("pzp1");
var salida = document.getElementById("texto");

//Creamos un evento donde se ecucha el cambio que tiene nuestro elemento
cambiolista.addEventListener("change", function() {
    //Creamos una variable auxiliar que nos sive para obtener el elemento cambiado
    var opcionSeleccionada = this.value;
    //Imprimimos la salida en el elemento seleccionado
    salida.value = opcionSeleccionada;
});

cambioseleccion.addEventListener("change", function(){
    var opc = this.value;
    salida.value = opc;
});




