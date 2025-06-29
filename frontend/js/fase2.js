document.getElementById('fase2-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const data = {
    documento: 'Cédula',
    responsable: document.querySelector('[name="responsable1"]').value,
    fechaEntrega: document.querySelector('[name="fecha1"]').value,
    formatoEntrega: document.querySelector('[name="formato1"]').value,
    realizado: document.querySelector('[name="realizado1"]').value,
    observaciones: document.querySelector('[name="observaciones1"]').value
  };

  console.log('Datos capturados:', data);

  // Aquí puedes hacer fetch o axios para guardar en la BD
  // fetch('/api/fase2', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  //   .then(res => res.json())
  //   .then(res => alert("Guardado correctamente"))
  //   .catch(err => console.error('Error:', err));
});

function verificarFase2() {
  alert('Verificación aún no implementada. 😅');
}
