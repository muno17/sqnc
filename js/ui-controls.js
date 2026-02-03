window.onload = function () {
    const tempo = document.getElementById("tempo");
    const tempoDisplay = document.getElementById("tempoDisplay");

    tempo.addEventListener("input", function () {
        tempoDisplay.innerHTML = this.value;
    });
};
