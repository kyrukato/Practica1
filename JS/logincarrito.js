const cancelar = document.getElementById("btnCancelar");
const login = document.getElementById("btnEnviar");
var user = document.getElementById("usuario");
var pass = document.getElementById("password");

login.addEventListener("click", () => {
  let usuario = user.value;
  let contra = pass.value;

  
  if (usuario === getCookie("user" + usuario) && contra === getCookie(usuario)) {
    window.location.replace("https://jivanimiranda.000webhostapp.com/iniciocarrito.html");
    alert("autenticacion exitosa"); 
    setCookie("usuarioactual", usuario, 1); 
  } else {
    if (!(usuario === getCookie("user" + usuario))) {
      alert("usuario no registrado");
    }
    if (!(contra === getCookie(usuario))) {
      alert("contraseña incorrecta");
    }
  }
});

function getCookie(nombre) {
  var nom = nombre + "=";
  var cookies = document.cookie.split(";"); // Obtener todas las cookies
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim(); // Eliminar espacios en blanco alrededor de la cookie
    if (cookie.indexOf(nom) === 0) {
      // Verificar si la cookie contiene la preferencia de color
      var colorPreferido = cookie.substring(nom.length, cookie.length); // Obtener el valor de la preferencia de color
      console.log("Preferencia de color recuperada:", colorPreferido);
      return colorPreferido;
    }
  }
  console.log("No se encontró ninguna preferencia de color en las cookies.");
  return null; // Devolver null si no se encuentra la preferencia de color
}

function setCookie(nombre, valor, expiracion) {
  var d = new Date();
  d.setTime(d.getTime() + expiracion * 24 * 60 * 60 * 1000);
  var exp = "expires=" + d.toUTCString();
  document.cookie = nombre + "=" + valor + ";" + exp + ";path=/;";
}
