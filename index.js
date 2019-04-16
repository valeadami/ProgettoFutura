//10/04/2019 PROGETTO FUTURA
/****************************************** */
const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const clsPLQ=require('./Classi/clsPanloquacity.js')
/*********** */
//const request = require('request');

/*const querystring = require('querystring');
const parseurl = require('parseurl');
const path = require("path");
const https = require('https');*/

/*** DIALOGFLOW FULFILLMENT */
const {WebhookClient} = require('dialogflow-fulfillment');
//15/04/2019: se metto le variabili globali, poi posso caricare dinamicamente i moduli
// a seconda del bot utilizzato
var controller; //=require('./Classi/clsControllerS3.js')
var studente;
var carrieraStudente;

/** utilità 
const fs = require("fs");
const utf8=require('utf8');*/
const fs = require("fs");
//file di configurazione
//const env = require('node-env-file');
//env(__dirname + '/.env');




var app = express();
var bot=''; // CHICKCHAT
/*app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

//inizializzo la sessione
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false, maxAge: 180000,name:'JSESSIONID'}
  }));
//uso le variabili di sessione
app.use(function (req, res, next) {
    
    req.session.username='';
    req.session.matId='';
    req.session.stuId='';
    
  
    next();
  })
  /*
  postData = querystring.stringify({
    'searchText': 'ciao',
    'user':'',
    'pwd':'',
    'ava':'FarmaInfoBot'
    
  });
  */

    //PER TEST
    app.get('/testSessione', function(req, res, next) {
      
        clsPLQ.Log();
          res.setHeader('Content-Type', 'text/html')
          res.write("sono nella root ");
          res.write('<p>views: ' + req.session.views + '</p>')
          res.write('<p> id sessione ' + req.session.id  +' expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
        
          res.end()
      
      })
//15/04/2019

app.get('/listSessione', function(req, res, next) {
  res.send('guarda la console per vedere elenco file...');
  listSessione(__dirname +'/sessions/');

})
//15/04/2019 attenzione: a te serve solo il remove singolo!!!

app.get('/deleteSessione', function(req, res, next) {
      
  res.send('ora elimino i files, poi gira di nuovo listSessione per verifica...');
  listDeleteSessione(__dirname +'/sessions/');

})
//CHICKCHAT
 function WebhookProcessing(req, res) {
    const agent = new WebhookClient({request: req, response: res});
    //10/01/2019
    //copiato codice da progetto api
    console.log('------sono su FUTURA app ----- la richiesta proviene da '+ agent.requestSource);
    bot=req.query.ava;
    console.log('Il bot  interrogato : '+bot);

    //15/04/2019 questo funziona
   /* if (bot=='HEADdemo'){
      controller=require('./Classi/clsControllerS3.js')
      console.log('tipo di controller ---->'+ typeof controller);
      
      controller.testCC().then((t)=>{
        console.log('sto cazzo de t in WebhookProcessing '+ t);
      });
    
    }*/
    var name=req.body.queryResult.intent.name;
    //QUALSIASI INTENT RISPONDE A CALLAVA ANCHE FALLBACK
    var displayname=req.body.queryResult.intent.displayName;
    console.log('nome intent '+name+ ' , display name '+ displayname);
    //******************************************* */
  
    //recupero la sessionId della conversazione
    
    agent.sessionId=req.body.session.split('/').pop();
  //assegno all'agente il parametro di ricerca da invare sotto forma di searchText a Panloquacity
  /*  agent.parameters['Command']=req.body.queryResult.parameters.Command;
    if (req.body.queryResult.parameters.esame){

      console.log(' ho esame =' + req.body.queryResult.parameters.esame);
      agent.parameters['esame']=req.body.queryResult.parameters.esame;
    }*/
    //fulfillment text
    agent.fulfillmentText=req.body.queryResult.fulfillmentText;
    console.log('----> fulfillment text =' +agent.fulfillmentText);
    console.info(` sessione agente ` + agent.sessionId +` con parametri` + agent.parameters.Command);
  //20/03/2019 fallback su plq
    if (req.body.queryResult.parameters.searchText){

      console.log(' ho param searchText per PLQ =' + req.body.queryResult.parameters.searchText);
      agent.parameters['searchText']=req.body.queryResult.parameters.searchText;
    }
    //gestione degli intent
    //nuovo del 21/03/2019 fallback intent
      var blnIsFallback=req.body.queryResult.intent.isFallback;
      console.log('blnIsFallback ?? '+blnIsFallback);
     
     //la funzione callAva sostiutisce la funzione welcome 
     // callAVA anytext AnyText sostituisce 'qualunquetesto'
      let intentMap = new Map();

      if (blnIsFallback){
  
        //recupero il query text del body
        var stringa=req.body.queryResult.queryText;
        console.log('query text del fallback :'+stringa);
        agent.queryText=stringa;
        //
        console.log('agent.queryText fallback '+agent.queryText);
      } /*else{
        intentMap.set(displayname, callAVANEW); 
        console.log('funzione callAVANEW per tutto il resto');
      }*/
      //a prescindere,
      intentMap.set(displayname, clsPLQ.callAVA);
      agent.handleRequest(intentMap);
  }
  
  //app.post('/fulfillment', appDFActions);
  app.post("/fulfillment", function (req,res){

   // console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
    console.log('DIALOGFLOW Request body: ' + JSON.stringify(req.body));
  
    
    WebhookProcessing(req, res); 
  
  
  });
 
app.listen(process.env.PORT || 3000, function() {
    console.log("App started on port " + process.env.PORT );
  });
//PER VERIFICHE DEI FILES DI SESSIONE
  function listSessione(path){
    //var stringa='';
    fs.readdir(path, (err, files) => {
    if (err) return console.log('Unable to scan directory: ' + err);
        files.forEach(file => {
            //stringa+=file+'\n';
        console.log('NOME DEL FILE '+file +'\n');
       
        });
       // console.log('stringa '+stringa);
       // return stringa;
    });
    
  } 
  function listDeleteSessione(path){
    
    fs.readdir(path, (err, files) => {
    if (err) return console.log('Unable to scan directory: ' + err);
        files.forEach(file => {
           
        console.log('NOME DEL FILE DA ELIMINARE '+file +'\n');
        deleteSessione(path, file)
       
        });
       
       
    });
    
  } 
  //eliminare file
function deleteSessione(path, strSessione){
    fs.unlink(path+ strSessione, (err) => {
      if (err) throw err;
      console.log('in deleteSessione: eliminato il file: ' + path + strSessione);
    });
  
  } 