// ================================
// CONEXÃO SSE
// ================================
const eventSource = new EventSource('/events');

eventSource.onmessage = (event) => {

    const votos = JSON.parse(event.data);

    document.getElementById('gostei').textContent = votos.gostei;
    document.getElementById('amei').textContent = votos.amei;
    document.getElementById('triste').textContent = votos.triste;
};

// ================================
// FUNÇÃO DE VOTAR
// ================================
async function votar(emoji) {

    await fetch('/votar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emoji })
    });
}