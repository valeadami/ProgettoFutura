/*
16/04/2019
INIZIO A SCRIVERE LIBRERIA PER CONNETTERSI A PLQ:
PROPRIETA':
- OPTIONS: parametri del server indirizzo ip e porta + impostazioni ssl
- CALLAVA: funzione per consumare il web service, ottenere la risposta JSON: serve la strOutput e cmd (eventuale)-> 
-RESPONSEFROMPLQ (vedi sopra)
-GESTIONE DELLA SESSIONE: leggi, scrivi ed elimina file fisico sul server dove risiede applicazione (Heroku)
-GETCOMANDI: funzione per ottenere i comandi da Plq, torna un array di stringhe composto da almeno un elemento, due per comando multimodale e/o immagine
*/
/** PROPRIETA */
const querystring = require('querystring');
const fs = require("fs");
const utf8=require('utf8');
const https = require('https');
var bot='ChitChat';
const dirname='/app' //metto qui il nome della cartella di Heroku
//costruttore
function Panloquacity(bot){

  this.bot=bot;
}
/*************** */
const nomeClasse='clsPanloquacity';


function LogPD(){

  console.log('sono nella classe Plq  ');
}
const options = {
  //modifica del 12/11/2018 : cambiato porta per supportare HTTPS
  
 hostname: '86.107.98.69', 
 port: 8443,
 rejectUnauthorized: false, 
 path: '/AVA/rest/searchService/search_2?searchText=', 
 method: 'POST', 
 headers: {
   'Content-Type': 'application/json', 
   'Cookie':'' 
 }
};
var responseFromPlq={
    'strOutput':'',
    'cmd':[]
  }
 
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

postData = querystring.stringify({
  'searchText': 'ciao',
  'user':'',
  'pwd':'',
  'ava':'FarmaInfoBot'
  
});
//callAva di index.js del progetto Futura
function callAVA(agent) {
 
  return new Promise((resolve, reject) => {

    let strRicerca = '';
    let sessionId = agent.sessionId;
    console.log('dentro call ava il mio session id ' + sessionId);

    if (agent.queryText) {
      //strRicerca=agent.queryText;
      strRicerca = utf8.encode(agent.queryText);
      console.log('FALLBACK in CAllAva valore di strRicerca ' + strRicerca);
    }
    if (agent.parameters.searchText) {
      strRicerca = utf8.encode(agent.parameters.searchText);
      console.log('***** in CAllAva valore di strRicerca ' + strRicerca);
    }


    //var str= utf8.encode(strRicerca); 
    if (strRicerca) {
      strRicerca = querystring.escape(strRicerca);
      options.path += strRicerca + '&user=&pwd=&ava=' + bot;
      console.log(' valore di options.path INIZIO = ' + options.path);
    }

    let data = '';
    let strOutput = '';
    //aggiunta la sessione
    var ss = leggiSessione(dirname + '/sessions/', sessionId);
    if (ss === '') {
      options.headers.Cookie = 'JSESSIONID=';
      console.log('DENTRO CALL AVA: SESSIONE VUOTA');
    } else {
      options.headers.Cookie = 'JSESSIONID=' + ss;
      console.log('DENTRO CALL AVA:  HO LA SESSIONE + JSESSIONID');
    }
    const req = https.request(options, (res) => {
      console.log(`STATUS DELLA RISPOSTA: ${res.statusCode}`);
      console.log(`HEADERS DELLA RISPOSTA: ${JSON.stringify(res.headers)}`);

      //aggiunta la sessione
      if (res.headers["set-cookie"]) {

        var x = res.headers["set-cookie"].toString();
        var arr = x.split(';')
        var y = arr[0].split('=');

        // scriviSessione(__dirname+'/sessions/',sess, y[1]); 

        scriviSessione(dirname + '/sessions/', sessionId, y[1]);
      }
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
        data += chunk;
        let comandi = [];
        let c = JSON.parse(data);
        strOutput = c.output[0].output;
        strOutput = strOutput.replace(/(<\/p>|<p>|<b>|<\/b>|<br>|<\/br>|<strong>|<\/strong>|<div>|<\/div>|<ul>|<li>|<\/ul>|<\/li>|&nbsp;|)/gi, '');

        //con i comandi
        comandi = getComandi(c.output[0].commands);
        if (typeof comandi !== 'undefined' && comandi.length >= 1) {
          console.log('ho almeno un comando, quindi prosegui con l\' azione ' + comandi[0]);

          if (comandi[0] == 'STOP') {


            //per test
          

            //CHIUDO LA CONV ED ELIMINO IL FILE 
            if (agent.requestSource == "ACTIONS_ON_GOOGLE") {
              deleteSessione(dirname + '/sessions/', sessionId);
              let conv = agent.conv();

              console.log(' ---- la conversazione PRIMA ----- ' + JSON.stringify(conv));
              conv.close(strOutput);
              console.log(' ---- la conversazione DOPO CHIUSURA ----- ' + JSON.stringify(conv));
              agent.add(conv);
           
            } else {
              agent.add(strOutput);

            
              deleteSessione(dirname + '/sessions/', sessionId);
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
        options.path = '/AVA/rest/searchService/search_2?searchText=';
        console.log('valore di options.path FINE ' + options.path);

      });
    });
    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
      strOutput = "si è verificato errore " + e.message;

    });

    req.write(postData);
    req.end();
  });
 }

/**** FUNZIONI A SUPPORTO per gestire la sessione*/

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
//eliminare file
function deleteSessione(path, strSessione){
  fs.unlink(path+ strSessione, (err) => {
    if (err) throw err;
    console.log('in deleteSessione: eliminato il file: ' + path + strSessione);
  });

}
//exports.callAVA= callAVA;
exports.callAVA=callAVA;
exports.nomeClasse=nomeClasse;
exports.LogPD=LogPD;
//exports.Panloquacity=Panloquacity;
//module.exports=Panloquacity;