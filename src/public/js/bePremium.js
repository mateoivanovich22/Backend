const socket = io();

const userRole = document.getElementById("user-role")
const botonUpgrade = document.getElementById("botonUpgrade");
const convertirseEnUser = document.getElementById("convertirseEnUser");

if (userRole === 'user') {
  botonUpgrade.style.display = "block";
  convertirseEnUser.style.display = "none";
} else {
  botonUpgrade.style.display = "none";
  convertirseEnUser.style.display = "block";
}

function returnHome() {
  window.location.href = "/api/products";
}
function mostrarFormulario(userId) {
    const botonUpgrade = document.getElementById("botonUpgrade");
    botonUpgrade.style.display = "none";
  
    const upgradeForm = document.getElementById("upgradeForm");
    upgradeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      enviarSolicitudDeActualizacion(userId);
    });
  
    upgradeForm.style.display = "block";
  }

async function enviarSolicitudDeActualizacion(userId) {
    let formData = {}
  
    formData.identification= document.querySelector("#file1").files[0].name;
    formData.proofOfAddress= document.querySelector("#file2").files[0].name
    formData.bankStatement= document.querySelector("#file3").files[0].name

    const response = await fetch(`/api/users/${userId}/documents`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
            },
        body: JSON.stringify(formData)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Documentos cargados con éxito") {
          alert("Documentos enviados con éxito");
        } else {
          alert("Error al enviar los documentos");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    socket.emit("upgradeUser", userId);
}
  

socket.on("user upgraded", () => {
  const messageUpgradedElementFalse = document.getElementById(
    "messageUpgradedFalse"
  );
  messageUpgradedElementFalse.style.display = "none";

  const downgrade = document.getElementById("downgrade");
  downgrade.style.display = "none";

  const messageUpgradedElement = document.getElementById("messageUpgraded");
  messageUpgradedElement.style.display = "block";
  messageUpgradedElement.style.color = "white";

  const botonUpgrade = document.getElementById("botonUpgrade");
  botonUpgrade.style.display = "none";
  const convertirseEnUser = document.getElementById("convertirseEnUser");
  convertirseEnUser.style.display = "block";
});

socket.on("user upgraded false", () => {
  const messageUpgradedElement = document.getElementById(
    "messageUpgradedFalse"
  );
  messageUpgradedElement.style.display = "block";
  messageUpgradedElement.style.color = "white";

  const botonUpgrade = document.getElementById("botonUpgrade");
  botonUpgrade.style.display = "none";

  const convertirseEnUser = document.getElementById("convertirseEnUser");
  convertirseEnUser.style.display = "block";
});

function darseDeBaja(userId) {
  socket.emit("darseDeBaja", userId);
}

socket.on("user downgrade", () => {
  const messageUpgradedElement = document.getElementById("messageUpgraded");
  messageUpgradedElement.style.display = "none";

  const downgrade = document.getElementById("downgrade");
  downgrade.style.display = "block";
  downgrade.style.color = "white";

  const botonUpgrade = document.getElementById("botonUpgrade");
  botonUpgrade.style.display = "block";

  const convertirseEnUser = document.getElementById("convertirseEnUser");
  convertirseEnUser.style.display = "none";
});
