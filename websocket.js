var WebSocketServer = require('websocket').server;
var http = require('http');

//Porta que o server irá escutar  
const port = process.env.PORT || 8080;

//Cria o server
var server = http.createServer(function(req,res){
    res.end("<h1> Ok </h1>")
});

//Server irá escutar na porta definida em 'port'
server.listen(port, () => {
    //Server está pronto
    console.log(`Server está executando na porta ${port}`);
});

//Cria o WebSocket server
wsServer = new WebSocketServer({
  httpServer: server
});

//Chamado quando um client deseja conectar
wsServer.on('request', (request) => {
    //Estado do led: false para desligado e true para ligado
    let state = false;

    //Aceita a conexão do client
    let client = request.accept(null, request.origin);

    //Chamado quando o client envia uma mensagem
    client.on('message', (message) => {
        //Se é uma mensagem string utf8
        if (message.type === 'utf8') {
            //Mostra no console a mensagem
            console.log(message.utf8Data);
        }
    });

    //Cria uma função que será executada a cada 1 segundo (1000 millis) para enviar o estado do led
    let interval = setInterval(() => {
        //Envia para o client "ON" ou "OFF" dependendo do estado atual da variável state
        client.sendUTF(state? '{"output1":"ON"}' : '{"output1":"OFF"}');
        //Inverte o estado
        state = !state;
    }, 100);//Tempo entre chamadas => 1000 millis = 1 segundo 

    //Chamado quando a conexão com o client é fechada
    client.on('close', () => {
        console.log("Conexão fechada");
        //Remove o intervalo de envio de estado
        clearInterval(interval);
    });
});