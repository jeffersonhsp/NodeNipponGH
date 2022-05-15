var WebSocketServer = require('ws').server;
var http = require('http');

//Porta que o server irá escutar  
const port = process.env.PORT || 8080;

//Cria o server
var server = http.createServer(function(req,res){
    //res.end('<h1> Ok </h1> ${port}')
    res.end(`Server está executando na porta ${port}`);
});

//Server irá escutar na porta definida em 'port'
server.listen(port, () => {
    //Server está pronto
    console.log(`Server está executando na porta ${port}`);
});


//Chamado quando um client deseja conectar
var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(new Date()), function() {  })
  }, 1000)

  console.log("websocket connection open")

  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
  })
})