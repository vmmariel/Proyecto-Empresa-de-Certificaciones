verificarInicioSesion = () => {
  const cuenta = localStorage.getItem("cuenta");
  const token = localStorage.getItem("token");

  if (!token || !cuenta) {
    limpiarLocalStorage();
    updateIULoggedOut();
    return false;
  }
  updateIULoggedIn(cuenta);
  return true;
};

limpiarLocalStorage = () => {
  localStorage.clear();
};

updateIULoggedIn = (nombre) => {
  document.getElementById("botonIniciar").style.display = "none";

  document.getElementById("informacionUser").style.display = "flex";
  document.getElementById("nombreUsuarioL").textContent = nombre;
};

document.getElementById("botonCerrar").addEventListener("click", () => {
  limpiarLocalStorage();
  updateIULoggedOut();

  Swal.fire({
    position: "center",
    icon: "success",
    title: "¡Adiós!",
    text: "Has cerrado sesión correctamente.",
    showConfirmButton: false,
    timer: 1500,
  }).then(() => {
    window.location.href = "index.html";
  });
});

updateIULoggedOut = () => {
  document.getElementById("botonIniciar").style.display = "flex";

  document.getElementById("informacionUser").style.display = "none";
  document.getElementById("nombreUsuarioL").textContent = "";
};

const main = () => {
  verificarInicioSesion();
};

main();
