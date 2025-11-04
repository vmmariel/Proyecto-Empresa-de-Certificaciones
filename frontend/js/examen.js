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

  document.getElementById("usuarioExamen").textContent = nombre;

  const fecha = new Date();
  const opciones = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
  document.getElementById("fechaExamen").textContent = fechaFormateada;
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

const main = async () => {
  const inicioSesion = verificarInicioSesion();

  if (!inicioSesion) {
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "Inicia sesión",
      text: "Debes iniciar sesión antes de acceder al examen de certificación.",
      showConfirmButton: true,
      confirmButtonColor: "#171717",
    }).then(() => {
      window.location.href = "index.html";
    });

    return;
  }

  await cargarPreguntas();
};

const listaPreguntas = document.getElementById("listaPreguntas");
let preguntas = [];

cargarPreguntas = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/questions/start", {
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
      construirPreguntas(data.questions);
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error al cargar las preguntas",
        text: "No se pudieron cargar las preguntas del examen. Inténtalo de nuevo más tarde.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.href = "index.html";
      });
    }
  } catch (error) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "Error al cargar las preguntas",
      text: "No se pudieron cargar las preguntas del examen. Inténtalo de nuevo más tarde.",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      window.location.href = "index.html";
    });
  }
};

construirPreguntas = (questions) => {
  preguntas = questions;

  const prespondidas = document.getElementById("prespondidas");
  prespondidas.innerText = "0";

  const totalPreguntas = document.getElementById("totalPreguntas");
  totalPreguntas.innerText = `${preguntas.length}`;

  const totalPreguntasInfo = document.getElementById("totalPreguntasInfo");
  totalPreguntasInfo.innerText = `${preguntas.length}`;

  const porcentajePreg = document.getElementById("porcentajePreg");
  porcentajePreg.innerText = "0%";

  const progreso = document.getElementById("progreso");
  progreso.style.width = "0%";

  const botonEnviar = document.getElementById("botonEnviar");
  botonEnviar.style.background = "#e7e7e7";

  listaPreguntas.innerHTML = "";

  preguntas.forEach((q, index) => {
    const div = document.createElement("div");
    div.className = "cartaPregunta cartaGlobal";

    const randomOpciones = q.options.sort(() => Math.random() - 0.5);

    let opciones = "";
    randomOpciones.forEach((option, indexOption) => {
      opciones += `<input type="radio" id="radio${index}${indexOption}" name="q_radio-group${q.id}" value="${option}" class="radio-input">
            <label for="radio${index}${indexOption}" class="radio-label">
                <span class="radio-inner-circle"></span>
                ${option}
            </label>`;
    });

    div.innerHTML = `
      <div class="encabezadoPregunta">
          <div class="tituloPregunta">
              <span>${index + 1}</span>
              <p>${q.text}</p>
          </div>
          <div id="pregunta${index}" class="indicador"><i class="fa-regular fa-circle-check"></i></div>
      </div>
      <div class="opcionesPregunta">

      ${opciones}
      </div>
    `;

    listaPreguntas.appendChild(div);
  });
};

listaPreguntas.addEventListener("change", (e) => {
  if (e.target.matches("input[type='radio']")) {
    const preguntaDiv = e.target.closest(".cartaPregunta");

    if (preguntaDiv) {
      // Agregamos la clase 'respondida'
      preguntaDiv.classList.add("respondida");

      // Obtenemos el índice de la pregunta actual (desde el ID del div)
      const idPregunta = preguntaDiv.querySelector(".indicador").id; // ejemplo: "pregunta0"

      // Buscamos el elemento por ID en todo el documento
      const indicador = document.getElementById(idPregunta);

      if (indicador) {
        indicador.style.opacity = "1";
      }
    }

    // Contamos cuántas preguntas están respondidas
    const preguntasRespondidas = document.querySelectorAll(
      ".cartaPregunta.respondida"
    ).length;

    actualizarNumeroRes(preguntasRespondidas, preguntas.length);
  }
});

actualizarNumeroRes = (numero, total) => {
  const porcentaje = (numero * 100) / total;

  const prespondidas = document.getElementById("prespondidas");
  prespondidas.innerText = `${numero}`;

  const porcentajePreg = document.getElementById("porcentajePreg");
  porcentajePreg.innerText = `${porcentaje}%`;

  const progreso = document.getElementById("progreso");
  progreso.style.width = `${porcentaje}%`;

  const botonEnviar = document.getElementById("botonEnviar");
  if (numero === total) {
    botonEnviar.style.background = "#171717";
  } else {
    botonEnviar.style.background = "#e7e7e7";
  }
};

document.getElementById("formExamenId").addEventListener("submit", (e) => {
  e.preventDefault();

  const answers = preguntas.map((q) => {
    const selected = document.querySelector(
      `input[name="q_radio-group${q.id}"]:checked`
    );
    return { id: q.id, answer: selected ? selected.value : "" };
  });

  if (answers.some((a) => a.answer === "")) {
    Swal.fire({
      position: "center",
      icon: "info",
      title: "Faltan preguntas por responder",
      text: "Debes contestar todas las preguntas antes de enviar el formulario.",
      showConfirmButton: true,
      confirmButtonText: "Entendido",
      confirmButtonColor: "#171717",
    });

    return;
  }

  Swal.fire({
    title: "¿Estás seguro de enviar el examen?",
    text: "Una vez enviado, no podrás volver a intentarlo.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#171717",
    cancelButtonColor: "#db3333",
    confirmButtonText: "Sí, enviar examen",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await enviarFormulario(answers);
    }
  });
});

// enviar form
enviarFormulario = async (answers) => {
  try {
    const res = await fetch("http://localhost:3000/api/questions/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ answers }),
    });

    if (res.ok) {
      const data = await res.json();

      if (data.aprobo) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Examen aprobado!" + data.mensaje,
          text: "¡Felicidades! Has aprobado la certificación con una calificacion de: " + data.porcentaje,
          confirmButtonColor: "#171717",
          confirmButtonText: "Descargar Certificado"
        }).then(async () => {
          await generarCertificado()
        });

      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Examen reprobado" + data.mensaje,
          text: "No alcanzaste la puntuación mínima para aprobar. Tu calificación fue de: " + data.porcentaje,
          confirmButtonColor: "#171717",
        }).then(() => {
          // Redirige al terminar la alerta
          window.location.href = "certificaciones.html";
        });
      }
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error al enviar las respuestas",
        text: "Hubo un problema al procesar el examen. Inténtalo de nuevo más tarde.",
        confirmButtonColor: "#171717",
      });
    }
  } catch (error) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor. Revisa tu conexión a Internet e inténtalo nuevamente.",
      confirmButtonColor: "#171717",
    });
  }
};

generarCertificado = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/questions/certificado", {
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
        icon: "success",
        title: "¡Certificado generado!",
        text: "Tu certificado se descargará automáticamente.",
        showConfirmButton: true,
        timer: 2000,
      }).then(() => {
        window.open(data.pdfUrl, "_blank")

        
        window.location.href = "certificaciones.html";
      });

    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error al generar el certificado",
        text: "No se pudo descargar el certificado. Inténtalo de nuevo más tarde.",
        showConfirmButton: false,
        timer: 2000,
      })
    }
  } catch (error) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "Error al generar el certificado",
      text: "No se pudo descargar el certificado. Inténtalo de nuevo más tarde.",
      showConfirmButton: false,
      timer: 2000,
    })
  }
};

main();
