const express = require('express')
const app = express()
const chalk = require('chalk');

//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))

//routes
app.get('/', (req, res) => {
	res.render('index')
})

//Listen on port 3000
// server = app.listen(3000)

var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello, World!');
    res.end();
}).listen(3000);

const hostname = "localhost";
const port = 3000;
	
app.listen(port, hostname, () => {
  console.log(chalk.blue(`Server is running at: http://${hostname}:${port}`))
})

