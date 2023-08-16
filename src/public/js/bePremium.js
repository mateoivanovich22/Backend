const socket = io();

function returnHome(){
    window.location.href = '/api/products';
}

function upgrade(id){
    socket.emit('upgradeUser', id);
}

function returnHome(){
    window.location.href = '/api/products';
}

socket.on("user upgraded", () => {
    const messageUpgradedElementFalse = document.getElementById("messageUpgradedFalse");
    messageUpgradedElementFalse.style.display = "none";

    const downgrade = document.getElementById("downgrade")
    downgrade.style.display = "none";

    const messageUpgradedElement = document.getElementById("messageUpgraded");
    messageUpgradedElement.style.display = "block";
    messageUpgradedElement.style.color = "white"

    const botonUpgrade = document.getElementById("botonUpgrade");
    botonUpgrade.style.display = "none";
    const convertirseEnUser = document.getElementById("convertirseEnUser");
    convertirseEnUser.style.display = "block";
})

socket.on("user upgraded false", () => {
    const messageUpgradedElement = document.getElementById("messageUpgradedFalse");
    messageUpgradedElement.style.display = "block";
    messageUpgradedElement.style.color = "white"

    const botonUpgrade = document.getElementById("botonUpgrade");
    botonUpgrade.style.display = "none";

    const convertirseEnUser = document.getElementById("convertirseEnUser");
    convertirseEnUser.style.display = "block";

    
})

function darseDeBaja(userId){
    socket.emit("darseDeBaja", userId);
}

socket.on("user downgrade", () => {
    const messageUpgradedElement = document.getElementById("messageUpgraded");
    messageUpgradedElement.style.display = "none";

    const downgrade = document.getElementById("downgrade")
    downgrade.style.display = "block";
    downgrade.style.color = "white";

    const botonUpgrade = document.getElementById("botonUpgrade");
    botonUpgrade.style.display = "block";

    const convertirseEnUser = document.getElementById("convertirseEnUser");
    convertirseEnUser.style.display = "none";
})