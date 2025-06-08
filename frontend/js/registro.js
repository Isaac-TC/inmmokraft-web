const documentos = [
  { id: 'escritura', nombre: 'Escritura', dias: 3 },
  { id: 'gravamenes', nombre: 'Certificado de gravámenes', dias: 2 },
  { id: 'impuestos', nombre: 'Pago de impuestos', dias: 1 },
  { id: 'catastral', nombre: 'Ficha catastral', dias: 2 },
  { id: 'papeleta', nombre: 'Papeleta de votación', dias: 1 },
  { id: 'notarizacion', nombre: 'Notarización (si aplica)', dias: 2 }
];

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("tabla-documentos");

  documentos.forEach((doc, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border px-2">${index + 1}</td>
      <td class="border px-2">${doc.nombre}</td>
      <td class="border px-2">
        <input type="file" id="file_${doc.id}" onchange="habilitarCheckbox('${doc.id}')">
      </td>
      <td class="border px-2 text-center">
        <input type="checkbox" id="doc_${doc.id}" disabled>
      </td>
      <td class="border px-2">${doc.dias}</td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById("formulario").addEventListener("submit", e => {
    e.preventDefault();

    const data = {
      tipo_operacion: document.getElementById("tipoOperacion").value,
      direccion: document.getElementById("direccion").value,
      vendedor: document.getElementById("vendedor").value,
      comprador: document.getElementById("comprador").value,
      agente: document.getElementById("agente").value,
      estado: document.getElementById("estado").value,
      documentos: {}
    };

    documentos.forEach(doc => {
      data.documentos[doc.id] = document.getElementById(`doc_${doc.id}`).checked;
    });

    fetch("http://localhost:3000/api/registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(msg => {
      alert("✅ Propiedad registrada con éxito");
      document.getElementById("formulario").reset();
      documentos.forEach(doc => {
        document.getElementById(`file_${doc.id}`).value = '';
        const checkbox = document.getElementById(`doc_${doc.id}`);
        checkbox.checked = false;
        checkbox.disabled = true;
      });
      document.getElementById("tipoOperacion").focus();
    })
    .catch(err => {
      console.error(err);
      alert("⚠️ Error al registrar la propiedad");
    });
  });
});

function habilitarCheckbox(tipo) {
  const archivo = document.getElementById(`file_${tipo}`).files[0];
  const checkbox = document.getElementById(`doc_${tipo}`);
  checkbox.disabled = !archivo;
  checkbox.checked = !!archivo;
}
