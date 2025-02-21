const WebSocket = require('ws');
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Servidor WebSocket funcionando');
});
const wss = new WebSocket.Server({ server });
// Array para almacenar mensajes previos
const mensajesGuardados = [];
wss.on('connection', (ws) => {
    console.log('Cliente conectado');
    // Enviar mensajes anteriores al nuevo cliente
    ws.send(JSON.stringify({ type: 'history', messages: mensajesGuardados }));
    ws.on('message', (data) => {
        const parsedData = JSON.parse(data);
        const username = parsedData.username;
        const message = parsedData.message;
        const mensajeCompleto = `De ${username}: ${message}`;
        console.log(mensajeCompleto);
        // Guardar el mensaje en el array
        mensajesGuardados.push(mensajeCompleto);
        // Enviar el mensaje a todos los clientes
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'message', message: mensajeCompleto }));
            }
        });
    });
    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});
server.listen(3000, '0.0.0.0', () => {
    console.log('Servidor WebSocket corriendo en ws://localhost:3000');
});