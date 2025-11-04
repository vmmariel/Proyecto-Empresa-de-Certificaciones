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

verificarPago = () => {
  const pago = localStorage.getItem("pago");
  if (pago === "true") {
    return true;
  } else {
    return false;
  }
};

checarPago = () => {
  const pago = verificarPago();

  const pagadoAlert = document.getElementById("pagadoAlert");
  const disponibleAlert = document.getElementById("disponibleAlert");
  if (pago) {
    pagadoAlert.style.display = "flex";
    disponibleAlert.style.display = "none";
  } else {
    pagadoAlert.style.display = "none";
    disponibleAlert.style.display = "flex";
  }
};

const main = () => {
  verificarInicioSesion();

  checarPago();
};

main();

// boton

document.getElementById("pagoBoton").addEventListener("click", () => {
  const sesionIniciada = verificarInicioSesion();

  if (!sesionIniciada) {
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "Inicia sesión",
      confirmButtonColor: "#171717",
      text: "Debes iniciar sesión antes de realizar la compra de la Certificación en C#.",
      showConfirmButton: true,
      confirmButtonText: "Iniciar sesión",
    }).then((result) => {
      if (result.isConfirmed) window.location.href = "iniciarSesion.html";
    });
    return;
  }

  const yaPago = verificarPago();

  if (yaPago) {
    Swal.fire({
      position: "center",
      icon: "info",
      title: "Pago registrado",
      text: "Ya has pagado esta certificación anteriormente.",
      showConfirmButton: false,
      timer: 1500,
    });

    return;
  }

  Swal.fire({
    title: "¿Deseas comprar la Certificación en C#?",
    text: "Podrás acceder al examen de certificación una vez completado el pago.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, comprar",
    confirmButtonColor: "#171717",
    cancelButtonColor: "#db3333",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await confirmarCompra();
    } else {
      Swal.fire({
        position: "top",
        icon: "info",
        title: "Has cancelado la compra",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
});

confirmarCompra = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/payment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    let data;

    try {
      data = await res.json();
    } catch (error) {
      data = {};
    }

    if (res.ok) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "¡Compra realizada!",
        text: "Has adquirido correctamente la Certificación en C#.",
        showConfirmButton: false,
        timer: 1500,
      });

      localStorage.setItem("pago", "true");
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error en la compra",
        text: "No se pudo completar la compra. Inténtalo de nuevo más tarde.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  } catch (error) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "Error en la compra",
      text: "No se pudo completar la compra. Inténtalo de nuevo más tarde.",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

verificarIntento = () => {
  const intento = localStorage.getItem("intento");
  if (intento === "true") {
    return true;
  } else {
    return false;
  }
};

// boton iniciar examen
document.getElementById("iniciarExamen").addEventListener("click", () => {
  const sesionIniciada = verificarInicioSesion();

  if (!sesionIniciada) {
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "Inicia sesión",
      confirmButtonColor: "#171717",
      text: "Debes iniciar sesión antes de realizar el examen de certificación.",
      showConfirmButton: true,
      confirmButtonText: "Iniciar sesión",
    }).then((result) => {
      if (result.isConfirmed) window.location.href = "iniciarSesion.html";
    });
    return;
  }

  const yaPago = verificarPago();

  if (!yaPago) {
    Swal.fire({
      position: "center",
      icon: "info",
      title: "Acceso restringido",
      text: "Debes comprar primero el pase para poder realizar la certificación.",
      showConfirmButton: false,
      timer: 1500,
    });

    return;
  }
  const yaIntento = verificarIntento();

  if (yaIntento) {
    Swal.fire({
      position: "center",
      icon: "info",
      title: "Intento previo detectado",
      text: "Usted ya intentó previamente resolver este examen.",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  Swal.fire({
    title: "¿Estás seguro?",
    text: "¿Deseas iniciar el examen de certificación ahora?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, iniciar examen",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#171717",
    cancelButtonColor: "#db3333",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.setItem("intento","true")
      window.location.href = "examen.html";
    }
  });
});
