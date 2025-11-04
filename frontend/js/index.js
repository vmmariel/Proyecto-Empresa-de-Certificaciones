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

llamadaCerrarSesion = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      const data = await res.json();

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
    } else {
      Swal.fire({
        title: "Error al cerrar sesión",
        text: `Ingrese sus credenciales correctamente`,
        icon: "error",
      });
    }
  } catch (error) {
    Swal.fire({
      title: "Error de conexión",
      text: "Ocurrió un error al conectar con el servidor",
      icon: "error",
    });
  }
};

document.getElementById("botonCerrar").addEventListener("click", async () => {
  try {
    await llamadaCerrarSesion();
  } catch (error) {
    Swal.fire({
      title: "Error de conexión",
      text: "Ocurrió un error al conectar con el servidor",
      icon: "error",
    });
  } finally {
    updateIULoggedOut();
    limpiarLocalStorage();
  }
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
