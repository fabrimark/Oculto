// Função para embaralhar a lista
function embaralhar(lista) {
    let listaEmbaralhada = lista.slice();
    for (let i = listaEmbaralhada.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [listaEmbaralhada[i], listaEmbaralhada[j]] = [listaEmbaralhada[j], listaEmbaralhada[i]];
    }
    return listaEmbaralhada;
}

// Função para fazer o sorteio
function sorteioAmigoOculto(participantes) {
    while (true) {
        let sorteados = embaralhar(participantes);
        let resultado = {};
        let valido = true;

        for (let i = 0; i < participantes.length; i++) {
            if (participantes[i] === sorteados[i]) {
                valido = false;
                break;
            }
            resultado[participantes[i]] = sorteados[i];
        }

        if (valido) return resultado;
    }
}

// Função para salvar o estado
function salvarEstado(resultados, participantes) {
    localStorage.setItem('resultados', JSON.stringify(resultados));
    localStorage.setItem('participantes', JSON.stringify(participantes));
}

// Função para carregar o estado
function carregarEstado() {
    let resultados = JSON.parse(localStorage.getItem('resultados'));
    let participantes = JSON.parse(localStorage.getItem('participantes'));
    return { resultados, participantes };
}

// Função para exibir o resultado para um participante específico
function exibirResultadoIndividual(resultados, participante) {
    if (participante in resultados) {
        alert(`${participante}, você tirou ${resultados[participante]}`);
    } else {
        alert(`Nome ${participante} não encontrado.`);
    }
}

// Função para iniciar o sorteio
function iniciarSorteio() {
    let participantesTexto = document.getElementById('participantes').value.trim();
    let participantes = participantesTexto.split('\n');
    if (participantes.length < 2) {
        alert("Insira pelo menos dois participantes.");
        return;
    }

    let resultados = sorteioAmigoOculto(participantes);
    salvarEstado(resultados, participantes);
    processarResultados(resultados, participantes);
}

// Função para processar os resultados
function processarResultados(resultados, participantes) {
    let nomeParticipante = prompt("Digite seu nome:");
    if (nomeParticipante === null) return;

    exibirResultadoIndividual(resultados, nomeParticipante);
    participantes = participantes.filter(p => p !== nomeParticipante);
    salvarEstado(resultados, participantes);

    if (participantes.length === 0) {
        alert("Todos os participantes já visualizaram seus resultados.");
        localStorage.removeItem('resultados');
        localStorage.removeItem('participantes');
        document.getElementById('sortearBtn').disabled = false;
    } else {
        document.getElementById('sortearBtn').disabled = true;
    }
}

// Função para carregar o resultado salvo
function carregarResultado() {
    let { resultados, participantes } = carregarEstado();
    if (resultados && participantes.length > 0) {
        processarResultados(resultados, participantes);
    } else {
        alert("Nenhum sorteio salvo encontrado.");
    }
}

document.getElementById('sortearBtn').addEventListener('click', iniciarSorteio);
document.getElementById('carregarBtn').addEventListener('click', carregarResultado);

// Desabilitar o botão Sortear se houver um sorteio em andamento
let { participantes } = carregarEstado();
if (participantes && participantes.length > 0) {
    document.getElementById('sortearBtn').disabled = true;
}
