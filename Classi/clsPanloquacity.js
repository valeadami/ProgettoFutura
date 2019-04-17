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

const dirname='.' //metto qui la root, funge, prima era '/app'


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
 
  //modifica del 17/04/2019
  /*
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
*/
//aggiungo getComandi come da progetto Alexa, in modo da gestire il comando con STOP/GETLibretto/IMG=
//["IMG=https://www.ideegreen.it/wp-content/uploads/2018/03/paguro-bernardo-3.jpg"]
function getComandi(arComandi)
 {

   var comandi=arComandi;
   var temp;
   if (comandi.length>0){
       //prosegui con il parsing
       //caso 1: ho solo un comando, ad esempio lo stop->prosegui con il parsing
       switch (comandi.length){
         case 1:
         //07/01/2019: ora il comando può contenere immagine, quindi verifica se presente =
           
           //comandi=arComandi;
           temp=comandi[0].toString();
           console.log('sono in getComandi, caso (1), temp = '+temp);
           //è una stringa? Se si contiene il carattere "="
           var pos = temp.indexOf("=");
           if (pos >- 1) {

            //ho una stringa, quindi splitto per "="
            temp=temp.split("=");
            console.log('valore di temp[1]= ' +temp[1]);
            arComandi[0]=temp[1];
            console.log('arComandi[0]= '+arComandi[0]);
            comandi=arComandi;
           }
           break;

         case 2:
         //caso 2: ho due comandi, stop e img=path image, quindi devo scomporre comandi[1] 
            temp=arComandi[1].toString();
            console.log('sono in getComandi, caso (2), temp = '+temp);
           //temp=img=https.....
           //splitto temp in un array con due elementi divisi da uguale
           temp=temp.split("=");
           console.log('valore di temp[1]= ' +temp[1]);
           arComandi[1]=temp[1];
           comandi=arComandi;
           console.log('comandi0='+comandi[0]+', comandi1='+comandi[1]);
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

    /* modifica del 16/04/2019 */
    var bot='';
    if (agent.parameters.bot){

      bot=agent.parameters.bot;
      console.log('DENTRO CALLAVA IL BOT DAL PARAMS '+ bot);
    }
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
      /*  for (var i=0;i<comandi.length;i++)
        {
          console.log('sti cazzi de comandi '+ comandi[i] +'\n');
        }*/
        //modifica del 17/04/2019
        //distinguo il caso in cui ho 1 solo comando da quello in cui i comandi sono 2 o più
        if (typeof comandi !== 'undefined' && comandi.length== 1) { //tolto >, in origine  comandi.length >=1
            var cmd=comandi[0]; //cmd è una stringa che contiene ad esempio STOP, getInizializzazione, https://www.imag.jpeg
            console.log('ho  un comando, quindi prosegui con l\' azione ' + comandi[0]);
            //controllo del 17/04/2019 con comando multi, ho sia lo stop che immagine, quindi la risposta viene ripetuta 2 volte
            switch (cmd){
              case 'STOP':
                if (agent.requestSource == "ACTIONS_ON_GOOGLE") {
                  deleteSessione(dirname + '/sessions/', sessionId);
                  let conv = agent.conv();
                  console.log(' ---- la conversazione PRIMA ----- ' + JSON.stringify(conv));
                  conv.close(strOutput);
                  console.log(' ---- la conversazione DOPO CHIUSURA ----- ' + JSON.stringify(conv));
                  agent.add(conv);
              
                } else {
                  //canale chat e altro
                  agent.add(strOutput);
                  deleteSessione(dirname + '/sessions/', sessionId);
                }
              break;
  //questo non va perchè viene dall'intent dell'agente, non da PLQ
            /* case 'getInizializzazione':
                agent.add('sono in getInizializzazione');
              break;*/
              default:
                agent.add(strOutput);
                console.log('sono nel default quindi img')
              break;
            }
        /* //OLD prima del 17/04/2019
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

          
            }else{
              console.log('comando immagine o altro comando: torno solo output')
              agent.add(strOutput);
            }
            /*
            if (typeof comandi[1] !== 'undefined' && comandi[0]=="STOP"){
              console.log('+++++++++ stoppo la conversazione e mando link immagine')
              agent.add(strOutput);
            
            }*/

          } 
          //** provo  */
        else if (typeof comandi !== 'undefined' && comandi.length > 1){
          if (typeof comandi[1] !== 'undefined' && comandi[0]=="STOP"){
              console.log('+++++++++ stoppo la conversazione e mando link immagine')
              agent.add(strOutput);
            } 
        }else {
          //NON HO COMANDI
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

//exports.Panloquacity=Panloquacity;
//module.exports=Panloquacity;