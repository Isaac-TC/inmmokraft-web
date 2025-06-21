let verificado = false;

function verificarSeguimiento() {
  const filas = document.querySelectorAll("#tablaSeguimiento tbody tr");
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // 🔄 Normaliza la fecha actual

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

    if (
      !fechaSolicitud ||
      isNaN(dias) ||
      fechaPlazo === "-" ||
      alerta === "-" ||
      alerta.includes("incompleto")
    ) {
      console.warn(`⛔ Fila "${tarea}" incompleta o no verificada. No se guarda.`);
      return;
    }

    const data = {
      tarea,
      realizado,
      fechaSolicitud,
      dias,
      fechaPlazo,
      alerta
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
