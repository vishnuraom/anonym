var express = require("express");
var app = express();
var gcm = require("node-gcm");
var dotenv = require('dotenv');
dotenv.load();

var sender = new gcm.Sender(process.env.FCM_API_KEY);
var regTokens = [process.env.REG_TOKEN];

var pug = require('pug');
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug')
app.get('/', function (req, res) {
  var html = pug.renderFile('index.pug');
	res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(html);
})

app.post('/msg', function (req, res) {
  //console.log(req.body.content);
  var message = new gcm.Message({
    notification: {
      title: "Anonymous Messenger",
      icon: "ic_launcher",
      body: req.body.content
    }
  });
  
  sender.send(message, { registrationTokens: regTokens }, RETRY_COUNT, function (err, response) {  
  if (err) console.error(err);
  else console.log(response);
  });

  var html = pug.renderFile('index.pug');
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(html);
});

app.listen(process.env.PORT || 3000)