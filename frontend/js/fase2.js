// NO USES "require" AQUÍ, este archivo es para el navegador
console.log("✅ fase2.js cargado correctamente");

function verificarfase2() {
  const inputs = document.querySelectorAll('tbody input, tbody select');
  let completo = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = "red";
      completo = false;
    } else {
      input.style.borderColor = "#ccc";
    }
  });

  if (completo) {
    alert("✅ Todos los campos están llenos.");
  } else {
    alert("⚠️ Faltan campos por completar.");
  }
}

function guardarfase2() {
  const filas = document.querySelectorAll("tbody tr");
  const datos = [];

  filas.forEach(fila => {
    const celdas = fila.querySelectorAll("td");
    const data = {
  documento: celdas[0].textContent.trim(),
  responsable: celdas[1].querySelector("input").value.trim(),
  fecha_entrega: celdas[2].querySelector("input").value || null,
  formato_entrega: celdas[3].querySelector("input").value.trim(),
  realizado: celdas[4].querySelector("select").value,
  observaciones: celdas[5].querySelector("input").value.trim()
};

    datos.push(data);
  });

  fetch("http://localhost:3000/api/fase2/guardar-fase2", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        alert("✅ Datos guardados correctamente.");
      } else {
        alert("❌ Error al guardar: " + res.message);
      }
    })
    .catch(err => {
      console.error("❌ Error en la solicitud:", err);
      alert("❌ Error al conectar con el servidor.");
    });
}

// 👇 FUNCIONALIDAD de Editar y Eliminar para Fase 2
document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.querySelector("tbody");

  tabla.addEventListener("click", (e) => {
    const boton = e.target.closest("button");
    if (!boton) return;

    const fila = boton.closest("tr");

    // 🗑 Eliminar
    if (boton.querySelector(".fa-trash-alt")) {
      if (confirm("¿Deseas eliminar esta fila?")) {
        fila.remove();
      }
    }

    // ✏️ Editar
    if (boton.querySelector(".fa-edit")) {
      const celdaDocumento = fila.cells[0];
      const textoActual = celdaDocumento.textContent.trim();
      const nuevoTexto = prompt("Editar nombre del documento:", textoActual);
      if (nuevoTexto !== null && nuevoTexto.trim() !== "") {
        celdaDocumento.textContent = nuevoTexto.trim();
      }
    }
  });
});
