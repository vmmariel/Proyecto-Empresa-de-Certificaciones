document
  .getElementById("formIniciarSesion")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const cuentaInputIS = document.getElementById("cuentaInputIS").value;
    const contrasenaInputIS =
      document.getElementById("contrasenaInputIS").value;

    if (cuentaInputIS == "") {
      mostrarMensajeValidacion("Por favor ingresa tu cuenta");
      return;
    }

    if (contrasenaInputIS == "" || contrasenaInputIS.length < 4) {
      mostrarMensajeValidacion(
        "Por favor ingresa tu contraseña (mínimo 4 caracteres)"
      );
      return;
    }

    await enviarFormulario(cuentaInputIS, contrasenaInputIS);

    resetearFormulario();

    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
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

enviarFormulario = async (cuentaInputIS, contrasenaInputIS) => {
  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cuenta: cuentaInputIS,
        contrasena: contrasenaInputIS,
      }),
    });

    if (res.ok) {
      const data = await res.json();

      guardarLocalStorage(data);

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
        icon: "success",
        title: "Inició sesión correctamente.",
      });
    } else {
      Swal.fire({
        title: "Error al iniciar sesión",
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

resetearFormulario = () => {
  document.getElementById("formIniciarSesion").reset();
};

guardarLocalStorage = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("cuenta", data.usuario.cuenta);
  localStorage.setItem("pago", data.usuario.pago);
  localStorage.setItem("intento", data.usuario.intento);
};

