let filas = 10;
let columnas = 10;
let minas = 10;
let tablero = [];
let enJuego = true;
let juegoIniciado = false;
let marcas = 0;

const tableroHTML = document.getElementById("tablero");

function mostrarAjustes() {
    document.getElementById("modal-ajustes").style.display = "block";
}

function cerrarAjustes() {
    document.getElementById("modal-ajustes").style.display = "none";
}

function menuDificultad() {
    const dificultad = document.getElementById("dificultad").value;
    const ajustesPersonalizados = document.getElementById("ajustes-personalizados");
    ajustesPersonalizados.style.display = dificultad === "personalizado" ? "block" : "none";

    switch (dificultad) {
        case "facil":
            filas = columnas = 5;
            minas = 5;
            break;
        case "medio":
            filas = columnas = 10;
            minas = 15;
            break;
        case "dificil":
            filas = columnas = 15;
            minas = 30;
            break;
        case "muyDificil":
            filas = columnas = 20;
            minas = 50;
            break;
        case "hardcore":
            filas = columnas = 25;
            minas = 100;
            break;
        case "leyenda":
            filas = columnas = 30;
            minas = 150;
            break;
    }
}

function guardarAjustes() {
    if (document.getElementById("dificultad").value === "personalizado") {
        filas = parseInt(document.getElementById("filas").value);
        columnas = parseInt(document.getElementById("columnas").value);
        minas = parseInt(document.getElementById("minas-input").value);
    }
    cerrarAjustes();
    nuevoJuego();
}

function nuevoJuego() {
    reiniciarVar();
    generarTableroHTML();
    generarTableroJuego();
    anadirEventos();
}

function reiniciarVar() {
    tablero = Array.from({ length: columnas }, () => Array(filas).fill(null));
    enJuego = true;
    juegoIniciado = false;
    marcas = 0;
    actualizarPanelMinas();
}

function generarTableroHTML() {
    let html = "";
    for (let f = 0; f < filas; f++) {
        html += "<tr>";
        for (let c = 0; c < columnas; c++) {
            html += `<td id="celda-${c}-${f}" style="width:30px;height:30px"></td>`;
        }
        html += "</tr>";
    }
    tableroHTML.innerHTML = html;
}

function anadirEventos() {
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            const celda = document.getElementById(`celda-${c}-${f}`);
            celda.addEventListener("click", () => descubrirCelda(c, f));
            celda.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                marcarCelda(c, f);
            });
        }
    }
}

function generarTableroJuego() {
    for (let c = 0; c < columnas; c++) {
        for (let f = 0; f < filas; f++) {
            tablero[c][f] = { valor: 0, estado: "oculto" };
        }
    }
    ponerMinas();
    contarMinas();
}

function ponerMinas() {
    let minasColocadas = 0;
    while (minasColocadas < minas) {
        const c = Math.floor(Math.random() * columnas);
        const f = Math.floor(Math.random() * filas);
        if (tablero[c][f].valor !== -1) {
            tablero[c][f].valor = -1;
            minasColocadas++;
        }
    }
}

function contarMinas() {
    for (let c = 0; c < columnas; c++) {
        for (let f = 0; f < filas; f++) {
            if (tablero[c][f].valor === -1) continue;
            let minasCerca = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const nc = c + i;
                    const nf = f + j;
                    if (nc >= 0 && nc < columnas && nf >= 0 && nf < filas && tablero[nc][nf].valor === -1) {
                        minasCerca++;
                    }
                }
            }
            tablero[c][f].valor = minasCerca;
        }
    }
}

function descubrirCelda(c, f) {
    if (!enJuego || tablero[c][f].estado === "descubierto") return;
    tablero[c][f].estado = "descubierto";
    const celda = document.getElementById(`celda-${c}-${f}`);
    if (tablero[c][f].valor === -1) {
        celda.innerHTML = `<i class="fas fa-bomb"></i>`;
        celda.style.backgroundColor = "red";
        terminarJuego(false);
    } else {
        celda.textContent = tablero[c][f].valor || "";
        celda.style.backgroundColor = "white";
        celda.style.color = "black";
        if (tablero[c][f].valor === 0) descubrirArea(c, f);
    }
}

function descubrirArea(c, f) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const nc = c + i;
            const nf = f + j;
            if (nc >= 0 && nc < columnas && nf >= 0 && nf < filas && tablero[nc][nf].estado === "oculto") {
                descubrirCelda(nc, nf);
            }
        }
    }
}

function marcarCelda(c, f) {
    const celda = document.getElementById(`celda-${c}-${f}`);
    if (celda.innerHTML === `<i class="fas fa-flag"></i>`) {
        celda.innerHTML = "";
        marcas--;
    } else {
        celda.innerHTML = `<i class="fas fa-flag"></i>`;
        marcas++;
    }
    actualizarPanelMinas();
}

function actualizarPanelMinas() {
    document.getElementById("minas").textContent = String(minas - marcas).padStart(3, "0");
}

function terminarJuego(ganado) {
    enJuego = false;
    if(!ganado){
        for(let c; c < columnas; c++){
            for(let f; f < filas; f++){
                const celda = document.getElementById(`celda-${c}-${f}`);
                if (tablero[c][f].valor === -1){
                    celda.innerHTML = `<i class="fas fa-bomb"></i>`;
                    celda.style.backgroundColor = "red";
                }
            }
        }
    }
    alert(ganado ? "Ganaste" : "Perdiste");
}
