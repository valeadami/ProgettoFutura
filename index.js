//10/04/2019 PROGETTO FUTURA
/****************************************** */
const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
/*********** */
const request = require('request');

const querystring = require('querystring');
const parseurl = require('parseurl');
const path = require("path");
const https = require('https');

/*** DIALOGFLOW FULFILLMENT */
const {WebhookClient} = require('dialogflow-fulfillment');


/** utilità */
const fs = require("fs");
const utf8=require('utf8');
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
  postData = querystring.stringify({
    'searchText': 'ciao',
    'user':'',
    'pwd':'',
    'ava':'FarmaInfoBot'
    
  });
  //questo diventerà un modulo con la conessione a PLQ
   const options = {
     //modifica del 12/11/2018 : cambiato porta per supportare HTTPS
     
    hostname: '86.107.98.69', 
    port: 8443,
    rejectUnauthorized: false, 
    path: '/AVA/rest/searchService/search_2?searchText=', 
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json', 
      'Cookie':'' // +avaSession 
    }
  };


    //PER TEST
    app.get('/testSessione', function(req, res, next) {
      
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
      intentMap.set(displayname, callAVA);
      agent.handleRequest(intentMap);
  }
  
  //app.post('/fulfillment', appDFActions);
  app.post("/fulfillment", function (req,res){

    console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
    console.log('DIALOGFLOW Request body: ' + JSON.stringify(req.body));
    //console.log('vedo le var di sessione di Express ?? '+ req.session.id );
    
    WebhookProcessing(req, res); 
  
  
  });
 

 
  /**** FUNZIONI A SUPPORTO copiate da progetto api */

function scriviSessione(path, strSessione, strValore) {
  
  fs.appendFile(path + strSessione,strValore, function (err) {
    if (err) {
      
      throw err;
    
    } else {
    console.log('DENTRO SCRIVI SESSIONE: SALVATO FILE '+ path + strSessione);
    
    }
     
  });
 
} 

function leggiSessione(path, strSessione){
  var contents='';
  try {
    fs.accessSync(path + strSessione); //__dirname +'/sessions/'
    contents = fs.readFileSync(path + strSessione, 'utf8'); //__dirname+'/sessions/'
    console.log('DENTRO LEGGI SESSIONE ' +contents);
  

  }catch (err) {
    if (err.code==='ENOENT')
    console.log('DENTRO LEGGI SESSIONE :il file non esiste...')
   
  }
  return contents;

} 
//15/04/2019 questa funzione lista tutti i files che si trovano sotto la cartella sessions
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
 //list + delete 15/04/2019
 function listDeleteSessione(path){
  var stringa='';
  fs.readdir(path, (err, files) => {
  if (err) return console.log('Unable to scan directory: ' + err);
      files.forEach(file => {
         
      console.log('NOME DEL FILE DA ELIMINARE '+file +'\n');
      deleteSessione(path, file)
     
      });
     
     
  });
  
}  
//prove del 12/04/2019
/*function leggiSessioneNew(path, strSessione){
 var contents='';
 
    fs.accessSync(__dirname+ '/sessions/'+ strSessione);
   fs.readFileSync(__dirname+'/sessions/'+ strSessione, 'utf8', (err, data) => {
     if (err) {
      if (err.code==='ENOENT')
      console.log('DENTRO LEGGI SESSIONE :il file non esiste...')
     reject('si è verificato errore '+err.code)
     }
     console.log('DENTRO LEGGI SESSIONE ' +data);
    contents=data;
   });
   return contents;
} */
//eliminare file
function deleteSessione(path, strSessione){
  fs.unlink(path+ strSessione, (err) => {
    if (err) throw err;
    console.log('in deleteSessione: eliminato il file: ' + path + strSessione);
  });

}




 // 18/12/2018
 function getComandi(arComandi)
  {

    var comandi=arComandi;
    if (comandi.length>0){
        //prosegui con il parsing
        //caso 1: ho solo un comando, ad esempio lo stop->prosegui con il parsing
        switch (comandi.length){
          case 1:
            comandi=arComandi;
            break;

          case 2:
          //caso 2: ho due comandi, stop e img=path image, quindi devo scomporre comandi[1] 
            var temp=arComandi[1].toString();
            //temp=img=https.....
            //splitto temp in un array con due elementi divisi da uguale
            temp=temp.split("=");
            console.log('valore di temp[1]= ' +temp[1]);
            arComandi[1]=temp[1];
            comandi=arComandi;

            //scompongo arComandi[1]
            break;

          default:
            //
            console.log('sono in default');

        }
       return comandi; //ritorno array come mi serve STOP oppure STOP, PATH img
      
    } else {
      console.log('non ci sono comandi')

      //non ci sono comandi quindi non fare nulla
      return undefined;
    }
   
  } 

 /* 10/04/2019  per domani stazione marittima*/
 function callAVA(agent) {
  return new Promise((resolve, reject) => {
 
    let strRicerca='';
    let sessionId = agent.sessionId;
    console.log('dentro call ava il mio session id '+sessionId);
    
    if (agent.queryText){
      //strRicerca=agent.queryText;
       strRicerca=utf8.encode(agent.queryText);
        console.log('FALLBACK in CAllAva valore di strRicerca ' + strRicerca); 
    } 
    if (agent.parameters.searchText){
        strRicerca= utf8.encode(agent.parameters.searchText); 
        console.log('***** in CAllAva valore di strRicerca ' + strRicerca);
    }
  
   
  //var str= utf8.encode(strRicerca); 
  if (strRicerca) {
    strRicerca=querystring.escape(strRicerca); 
    options.path+=strRicerca+'&user=&pwd=&ava='+bot;
    console.log(' valore di options.path INIZIO = '+ options.path);
  }
 
   let data = '';
   let strOutput='';
  //aggiunta la sessione
    var ss=leggiSessione(__dirname +'/sessions/', sessionId); //leggiSessioneNew   leggiSessione
    if (ss===''){
        options.headers.Cookie='JSESSIONID=';
        console.log('DENTRO CALL AVA: SESSIONE VUOTA');
    }else {
        options.headers.Cookie='JSESSIONID='+ss;
        console.log('DENTRO CALL AVA:  HO LA SESSIONE + JSESSIONID');
    }
    const req = https.request(options, (res) => {
    console.log(`STATUS DELLA RISPOSTA: ${res.statusCode}`);
    console.log(`HEADERS DELLA RISPOSTA: ${JSON.stringify(res.headers)}`);

    //aggiunta la sessione
    if (res.headers["set-cookie"]){

        var x = res.headers["set-cookie"].toString();
        var arr=x.split(';')
        var y=arr[0].split('=');
        
       // scriviSessione(__dirname+'/sessions/',sess, y[1]); 
       
       scriviSessione(__dirname+'/sessions/',sessionId, y[1]); 
      } 
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
     console.log(`BODY: ${chunk}`);
     data += chunk;
     let comandi=[];
     let c=JSON.parse(data);
      strOutput=c.output[0].output;
      strOutput=strOutput.replace(/(<\/p>|<p>|<b>|<\/b>|<br>|<\/br>|<strong>|<\/strong>|<div>|<\/div>|<ul>|<li>|<\/ul>|<\/li>|&nbsp;|)/gi, '');
      
      //con i comandi
      comandi=getComandi(c.output[0].commands);
      if (typeof comandi!=='undefined' && comandi.length>=1) {
        console.log('ho almeno un comando, quindi prosegui con l\' azione ' + comandi[0]);
       
        if(comandi[0]=='STOP'){

          //CHIUDO LA CONV ED ELIMINO IL FILE 
          if (agent.requestSource=="ACTIONS_ON_GOOGLE"){

            let conv = agent.conv();
  
            console.log(' ---- la conversazione PRIMA ----- ' + JSON.stringify(conv));
            conv.close(strOutput);
            console.log(' ---- la conversazione DOPO CHIUSURA ----- ' + JSON.stringify(conv));
            agent.add(conv);
           
            deleteSessione(__dirname+'/sessions/'+sessionId); 
            //altrimenti ritorna la strOutput
          } else{
            agent.add(strOutput);
           
            //lo faccio anche per altre piattaforme???
             deleteSessione(__dirname+'/sessions/'+sessionId); 
          }
         
        }
    
     
     } else {
      
        console.log('qui ho solo la strOutput ');
        agent.add(strOutput); 
       
     }
     resolve(agent);
     
    });
    res.on('end', () => {
      console.log('No more data in response.');
      options.path='/AVA/rest/searchService/search_2?searchText=';      
      console.log('valore di options.path FINE ' +  options.path);
 
    });
  });
   req.on('error', (e) => {
   console.error(`problem with request: ${e.message}`);
   strOutput="si è verificato errore " + e.message;

  });

   req.write(postData);
  req.end();
  });
 }
 /* fine modifica del 21/03/2019 */



app.listen(process.env.PORT || 3000, function() {
    console.log("App started on port " + process.env.PORT );
  });

