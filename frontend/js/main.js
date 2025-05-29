document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const clave = document.getElementById("clave").value;

  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario, clave }),
    });

    const data = await response.json();

    if (data.success) {
      // Redirige a la pagina que seleccionemos 
      window.location.href = "registroP.html";
    } else {
      alert("Usuario o contraseña incorrectos.");
    }
  } catch (error) {
    alert("Error al conectar con el servidor.");
    console.error(error);
  }
});
