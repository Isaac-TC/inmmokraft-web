let verificado = false;

function verificarSeguimiento() {
  const filas = document.querySelectorAll("#tablaSeguimiento tbody tr");
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  filas.forEach(fila => {
    const check = fila.querySelector(".check").checked;
    const fechaInput = fila.querySelector(".fecha-solicitud").value;
    const dias = parseInt(fila.querySelector(".dias").value);
    const plazoCelda = fila.querySelector(".fecha-plazo");
    const alertaCelda = fila.querySelector(".alerta");

    if (!fechaInput || isNaN(dias)) {
      plazoCelda.textContent = "-";
      alertaCelda.textContent = "⚠️ Datos incompletos";
      alertaCelda.className = "alerta fail";
      return;
    }

    const fechaSolicitud = new Date(fechaInput);
    const fechaPlazo = new Date(fechaSolicitud);
    fechaPlazo.setDate(fechaPlazo.getDate() + dias);
    fechaPlazo.setHours(0, 0, 0, 0);

    const fechaPlazoStr = fechaPlazo.toISOString().split("T")[0];
    plazoCelda.textContent = fechaPlazoStr;

    if (check && hoy <= fechaPlazo) {
      alertaCelda.textContent = "✅ Completado";
      alertaCelda.className = "alerta ok";
    } else if (hoy > fechaPlazo) {
      alertaCelda.textContent = "🚨 Atrasado";
      alertaCelda.className = "alerta fail";
    } else {
      alertaCelda.textContent = "⏳ Pendiente";
      alertaCelda.className = "alerta";
    }
  });

  verificado = true;
}

function guardarSeguimiento() {
  const asesor = document.getElementById("asesor").value.trim();
  const contacto = document.getElementById("contacto").value;

  if (!verificado) {
    alert("⚠️ Primero debes hacer clic en 'Verificar seguimiento'");
    return;
  }

  const filas = document.querySelectorAll("#tablaSeguimiento tbody tr");
  const promesas = [];

  filas.forEach(fila => {
    const tarea = fila.cells[0].textContent;
    const realizado = fila.querySelector(".check").checked ? 1 : 0;
    const fechaSolicitud = fila.querySelector(".fecha-solicitud").value;
    const dias = parseInt(fila.querySelector(".dias").value);
    const fechaPlazo = fila.querySelector(".fecha-plazo").textContent;
    const alerta = fila.querySelector(".alerta").textContent;

    if (!fechaSolicitud || isNaN(dias) || fechaPlazo === "-" || alerta === "-" || alerta.includes("incompleto")) {
      console.warn(`⛔ Fila "${tarea}" incompleta o no verificada. No se guarda.`);
      return;
    }

    const data = {
      tarea,
      realizado,
      fechaSolicitud,
      dias,
      fechaPlazo,
      alerta,
      asesor,
      contacto
    };

    

    const promesa = fetch("http://localhost:3000/api/seguimiento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    promesas.push(promesa);
  });

  if (promesas.length === 0) {
    alert("⚠️ No se guardaron datos. Verifica que todas las filas estén completas y validadas.");
    return;
  }

  Promise.all(promesas)
    .then(() => {
      alert(`✅ ${promesas.length} fila(s) guardadas correctamente.`);
      verificado = false;
    })
    .catch(() => {
      alert("❌ Ocurrió un error al guardar una o más filas.");
    });
}


// FUNCIONALIDAD DE BOTONES EDITAR Y ELIMINAR
document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("tablaSeguimiento");

  tabla.addEventListener("click", function (e) {
    const boton = e.target.closest("button");
    if (!boton) return;

    const fila = boton.closest("tr");

    if (boton.querySelector(".fa-trash-alt")) {
      // Botón Eliminar
      if (confirm("¿Seguro que deseas eliminar esta fila?")) {
        fila.remove();
      }
    } else if (boton.querySelector(".fa-edit")) {
      // Botón Editar
      const celdaTarea = fila.cells[0];
      const textoActual = celdaTarea.textContent;

      const nuevoTexto = prompt("Editar tarea:", textoActual);
      if (nuevoTexto !== null && nuevoTexto.trim() !== "") {
        celdaTarea.textContent = nuevoTexto.trim();
      }
    }
  });
});
