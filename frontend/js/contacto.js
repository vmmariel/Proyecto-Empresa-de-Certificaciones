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

//&========= Validación y envío del formulario de contacto =========&\\
document
  .getElementById("formularioContacto")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombreForm").value;
    const email = document.getElementById("emailForm").value;
    const telefono = document.getElementById("numeroForm").value;
    const mensaje = document.getElementById("mensajeForm").value;

    if (nombre === "") {
      mostrarMensajeValidacion("Por favor ingresa tu nombre");
      return;
    }

    if (email === "") {
      mostrarMensajeValidacion("Por favor ingresa tu correo electrónico");
      return;
    }

    if (mensaje === "" || mensaje.length < 10) {
      mostrarMensajeValidacion(
        "Por favor ingresa un mensaje válido (mínimo 10 caracteres)"
      );
      return;
    }

    const seEnvio = await enviarFormulario(nombre, email, telefono, mensaje);

    if (seEnvio) {
      Swal.fire({
        position: "top",
        icon: "success",
        title: "Mensaje Enviado",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        position: "top",
        icon: "error",
        title: "Error al enviar el mensaje",
        confirmButtonColor: "#171717",
      });
    }
    resetearFormulario();
  });

mostrarMensajeValidacion = (mensaje) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "error",
    title: mensaje,
  });
};

enviarFormulario = async (nombre, email, telefono, mensaje) => {
  // Lógica para enviar el formulario
  try {
    const response = await fetch("http://localhost:3000/api/contacto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, email, telefono, mensaje }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Servidor respondió:", data.message);
      return true; 
    } else {
      console.error("Error al enviar el mensaje:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error de conexión con el servidor:", error);
    return false;
  }
};

resetearFormulario = () => {
  document.getElementById("formularioContacto").reset();
};
