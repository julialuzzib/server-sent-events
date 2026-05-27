const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Permite receber JSON
app.use(express.json());

// Pasta pública
app.use(express.static(path.join(__dirname, 'public')));

// Armazena clientes SSE conectados
let clientes = [];

// Contagem dos votos
let votos = {
    gostei: 0,
    amei: 0,
    triste: 0
};

// ================================
// ROTA SSE
// ================================
app.get('/events', (req, res) => {

    // Headers obrigatórios SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Envia dados iniciais
    res.write(`data: ${JSON.stringify(votos)}\n\n`);

    // Salva cliente conectado
    clientes.push(res);

    console.log('Novo cliente conectado');

    // Remove cliente ao desconectar
    req.on('close', () => {
        clientes = clientes.filter(cliente => cliente !== res);
        console.log('Cliente desconectado');
    });
});

// ================================
// ROTA DE VOTAÇÃO
// ================================
app.post('/votar', (req, res) => {

    const { emoji } = req.body;

    if (votos[emoji] !== undefined) {
        votos[emoji]++;

        // Envia atualização para todos clientes
        clientes.forEach(cliente => {
            cliente.write(`data: ${JSON.stringify(votos)}\n\n`);
        });

        return res.json({
            sucesso: true,
            votos
        });
    }

    res.status(400).json({
        sucesso: false,
        mensagem: 'Emoji inválido'
    });
});

// ================================

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});