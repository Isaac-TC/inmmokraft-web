function cerrarSesion() {
  localStorage.removeItem("usuarioLogueado");
  window.location.href = "Home.html";
}

function eliminarPropiedad(codigo) {
  if (!confirm("¿Deseas eliminar esta propiedad?")) return;
  fetch(`http://localhost:3000/api/propiedades/${codigo}`, { method: "DELETE" })
    .then(res => res.text())
    .then(msg => {
      alert(msg);
      location.reload();
    });
}

fetch("http://localhost:3000/api/propiedades")
  .then(res => res.json())
  .then(data => {
    const tabla = document.getElementById("tabla-propiedades");
    data.forEach(prop => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td class="border px-2 py-1 text-center">${prop.codigo}</td>
        <td class="border px-2 py-1 text-center">${prop.direccion || '-'}</td>
        <td class="border px-2 py-1 text-center">${prop.vendedor || '-'}</td>
        <td class="border px-2 py-1 text-center">${prop.comprador || '-'}</td>
        <td class="border px-2 py-1 text-center font-semibold">${prop.estado || '-'}</td>
        <td class="border px-2 py-1 text-center space-x-1">
          <button onclick="eliminarPropiedad('${prop.codigo}')" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
        </td>`;
      tabla.appendChild(fila);
    });
  });
