function cerrarSesion() {
  localStorage.removeItem("usuarioLogueado");
  window.location.href = "home.html";
}

function buscarPropiedad() {
  const codigo = document.getElementById("codigoInput").value.trim().toUpperCase();
  if (!codigo) return alert("Por favor ingresa un código válido.");

  fetch(`http://localhost:3000/api/propiedades/${codigo}`)
    .then(res => {
      if (!res.ok) throw new Error("No se encontró la propiedad");
      return res.json();
    })
    .then(data => {
      document.getElementById("resultado").classList.remove("hidden");
      document.getElementById("direccion").textContent = data.direccion;
      document.getElementById("tipo").textContent = data.tipo_operacion;
      document.getElementById("estado").textContent = data.estado;

      mostrarDocumento("doc_escritura", data.escritura);
      mostrarDocumento("doc_gravamenes", data.gravamenes);
      mostrarDocumento("doc_impuestos", data.impuestos);
      mostrarDocumento("doc_catastral", data.catastral);
      mostrarDocumento("doc_papeleta", data.papeleta);
      mostrarDocumento("doc_notarizacion", data.notarizacion);

      const cumpleTodo = data.escritura && data.gravamenes && data.impuestos &&
                         data.catastral && data.papeleta && data.notarizacion;

      const veredicto = document.getElementById("veredicto");
      if (cumpleTodo) {
        veredicto.textContent = "✅ Esta propiedad está lista para ser vendida o alquilada.";
        veredicto.classList.remove("text-red-600");
        veredicto.classList.add("text-green-600");
      } else {
        veredicto.textContent = "⚠️ Faltan documentos. No se puede continuar con la operación.";
        veredicto.classList.remove("text-green-600");
        veredicto.classList.add("text-red-600");
      }
    })
    .catch(() => {
      alert("⚠️ No se encontró la propiedad o hubo un error.");
      document.getElementById("resultado").classList.add("hidden");
    });
}

function mostrarDocumento(id, valor) {
  document.getElementById(id).textContent = valor ? "✅ Completado" : "❌ Pendiente";
}
