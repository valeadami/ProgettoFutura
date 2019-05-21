/*
18/04/2019: gestione output immagini con comandi paguro e canguro, su G. Assistant e Telegram
16/04/2019
INIZIO A SCRIVERE LIBRERIA PER CONNETTERSI A PLQ:
PROPRIETA':
- OPTIONS: parametri del server indirizzo ip e porta + impostazioni ssl
- CALLAVA: funzione per consumare il web service, ottenere la risposta JSON: serve la strOutput e cmd (eventuale)-> 
NOTA BENE: CALLAVA è funzione "generale" serve a tt i bot. CALLAVANEW è specifica per il progetto Università-
-GESTIONE DELLA SESSIONE: leggi, scrivi ed elimina file fisico sul server dove risiede applicazione (Heroku)
-GETCOMANDI: funzione per ottenere i comandi da Plq, torna un array di stringhe composto da almeno un elemento, due per comando multimodale e/o immagine
*/
/** PROPRIETA */
const querystring = require('querystring');
const fs = require("fs");
const utf8=require('utf8');
const https = require('https');

const dirname='.' //metto qui la root, funge, prima era '/app'
var controller; // =require('./clsControllerS3.js'); sposto qua le dichirazioni al posto di index.js
//prova cul del 19/04/2019

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
//modifica del 24/04/2019: aggiungo gestione comando con QR ["QR=Question 1|how are you","QR= Question 2|Who are your creators"]
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
         //modifica del 24/04/2019 gestione comandi QR 
         //caso 2: ho due comandi, stop e img=path image, quindi devo scomporre comandi[1] 
         var temp1=[]; //array temporaneo per gestire QR
         var tmp=''; 
         //mi servono per QR
         //aggiunta del 24/04/2019: modificato rispetto al progetto PlqChat in quanto ora mi serve avere indicazione di QR=
         //0="QR=Question 1|how are you" , 1="QR=Question 2|p2"
        // for(var i=0;i<comandi.length;i++){
          if (comandi[0].startsWith('QR')) {
              tmp=comandi.toString();
              tmp=tmp.split(","); //
              console.log('tmp[0] = ' + tmp[0]+ ', tmp[1] ='+tmp[1]);
             /* tmp=tmp.toString();
              tmp=tmp.split("|");
              console.log('tmp ora =' + tmp);
              //recupero solo il titolo
              tmp=tmp[0].toString();
            */
           for(var i=0;i<tmp.length;i++){
            temp1.push(tmp[i]);   
            console.log('tmp[i] =' + tmp[i]);
           }
           //console.log('tmp finale =' + tmp);
                     
              
              
          }  else {
            //originale, poi con il 24/04/2019 caso else...
             temp=arComandi[1].toString();
              console.log('sono in getComandi, caso (2), temp = '+temp);
              //temp=img=https.....
              //splitto temp in un array con due elementi divisi da uguale
              temp=temp.split("=");
              console.log('valore di temp[1]= ' +temp[1]);
              arComandi[1]=temp[1];
              comandi=arComandi;
              console.log('comandi0='+comandi[0]+', comandi1='+comandi[1]);
              break;
              //scompongo arComandi[1]
            } 
            comandi=temp1; //qui ho i titoli dei due QR
            //console.log('qui i comandi sono '+comandi.toString());
      //}
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
                /* *********************** prova cul del 19/04/2019, test su FarmaInfoBot */
                console.log('sono nel default quindi img');
                const {Card} = require('dialogflow-fulfillment');
                agent.add(
                  new Card({
                  title: '\n',
                  imageUrl: cmd,//'https://www.ideegreen.it/wp-content/uploads/2018/03/paguro-bernardo-3.jpg',
                  accessibilityText:'image', //per testo alternativo
                  text: '',
                  buttonText: '+',
                  buttonUrl: cmd //'https://www.ideegreen.it/wp-content/uploads/2018/03/paguro-bernardo-3.jpg'
                })
              ); 
              //in alternativa prova con custom payload, esempio da https://github.com/dialogflow/dialogflow-fulfillment-nodejs/issues/10
              //ma non funge!!
             /* const {Payload} = require('dialogflow-fulfillment');
              agent.add(new Payload( agent.ACTIONS_ON_GOOGLE, {
                "google": {
                  "expectUserResponse": true,
                  "richResponse": {
                    "items": [
                      {
                        "simpleResponse": {
                          "textToSpeech": "This is a Basic Card:"
                        }
                      },
                      {
                        "basicCard": {
                          "title": "Card Title",
                          "image": {
                            "url": "https://www.ideegreen.it/wp-content/uploads/2018/03/paguro-bernardo-3.jpg",
                            "accessibilityText": "Google Logo"
                          },
                          "buttons": [
                            {
                              "title": "+",
                              "openUrlAction": {
                                "url": "https://www.ideegreen.it/wp-content/uploads/2018/03/paguro-bernardo-3.jpg"
                              }
                            }
                          ],
                          "imageDisplayOptions": "WHITE"
                        }
                      }
                    ]
                  }
                }
             })
              );*/
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
          //** provo  18/04/2019 */
        else if (typeof comandi !== 'undefined' && comandi.length > 1){
          if (typeof comandi[1] !== 'undefined' && comandi[0]=="STOP"){
              console.log('+++++++++ stoppo la conversazione e mando link immagine')
             // agent.add(strOutput); //lo commento in data 18/04/2019 se no viene ripetuto due volte
            
              //modifica del 18/04/2019 : comando MULTI/CANGURO stoppo la conversazione e visualizzo immagine
              if (agent.requestSource == "ACTIONS_ON_GOOGLE") {
                agent.add(strOutput); 
                const {Card} = require('dialogflow-fulfillment');
                agent.add(
                  new Card({
                  title: '\n',
                  imageUrl: comandi[1],//'https://upload.wikimedia.org/wikipedia/commons/a/ab/House_mouse.jpg',
                  accessibilityText:'image', //per testo alternativo
                  text: '',
                  buttonText: '+',
                  buttonUrl: comandi[1] //'https://upload.wikimedia.org/wikipedia/commons/a/ab/House_mouse.jpg'
                })
                ); 
                deleteSessione(dirname + '/sessions/', sessionId);
                let conv = agent.conv();
                console.log(' ---- comando MULTI la conversazione PRIMA ----- ' + JSON.stringify(conv));
                
                //sposto qua la chiusura dopo aver creato la card
               conv.close(strOutput);
               
                console.log(' ---- comando MULTI la conversazione DOPO CHIUSURA ----- ' + JSON.stringify(conv));
                agent.add(conv);
            
              } else {
                //canale web chat e altro, tipo telegram
                agent.add(strOutput);
                //MODIFICA DEL 18/04/2019 
                const {Card} = require('dialogflow-fulfillment');
                agent.add(
                  new Card({
                  title: '\n',
                  imageUrl: comandi[1],//'https://upload.wikimedia.org/wikipedia/commons/a/ab/House_mouse.jpg',
                  accessibilityText:'image', //per testo alternativo
                  text: '',
                  buttonText: '+',
                  buttonUrl: comandi[1] //'https://upload.wikimedia.org/wikipedia/commons/a/ab/House_mouse.jpg'
                })
                ); 
                deleteSessione(dirname + '/sessions/', sessionId);
              }
            //24/04/2019 gestione QR
            } else if(comandi[0].startsWith('QR')) {
              const {Suggestion} = require('dialogflow-fulfillment');
              agent.add(strOutput); 
              //recupero il titolo e creo i qr 
              for(var i=0;i<comandi.length;i++){
         
                tmp=comandi[i].toString();
                tmp=tmp.split("="); 
                console.log('tmp[0] = ' + tmp[0]+ ', tmp[1] ='+tmp[1]);
                tmp=tmp[1].toString();
                tmp=tmp.split("|");
                //recupero solo il titolo
                tmp=tmp[0].toString();
                console.log('tmp con titolo '+ tmp)
                agent.add(new Suggestion(tmp));
              }
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

 //modifica del 17/04/2019 callAVANEW mi serve per gestire il progetto HeadDemo, bot HEAD per EsseTre
 //i parametri vengono da DF!!!! PD
  //modifica del 17/04/2019
  function callAVANEW(agent) { 
    return new Promise((resolve, reject) => {
  
      /*  modifica del 18/04/2019: carico dinamicamente la classe controller per gestire Esse3 */
      if (agent.parameters.bot=='HEAD' || agent.parameters.bot=='HEADdemo'){
        console.log('carico dinamicamente clsControllerS3.js');
        controller=require('./clsControllerS3.js');
      }
    let strRicerca='';
   
    let sessionId = agent.sessionId /*.split('/').pop()*/;
    console.log('dentro call ava il mio session id '+sessionId);
  //questo lo tengo perchè mi serve per recuperare parametro comando proveniente dall'agente
  
    //var str= utf8.encode(agent.parameters.Command); 
    //se è presente il parametro Command proveniente da un intent di DF, ok, altrimenti prendi la 
    //queryText del FALLBACK
    var str=agent.parameters.Command?utf8.encode(agent.parameters.Command):agent.queryText;
    if (str) {
      strRicerca=querystring.escape(str); //lo tengo comunque
     // options.path+=strRicerca+'&user=&pwd=&ava='+bot;
    
      console.log('il comando da passare : '+ strRicerca);
    }  
    var strOutput=agent.fulfillmentText; //è la risposta statica da DF messa da Roberto
    console.log('strOutput agente prima di EsseTre :' + strOutput);
    //HO ESAME?? Risolvo la entity esame
    if(agent.parameters.esame){
  
      var paramEsame=agent.parameters.esame;
      console.log('in callAvanew ho esame '+ paramEsame);
    }
    //recupero la variabile legata al contesto
    //21/03/2019 rinominato da contesto in vardisessione e inserito anche nell'agente 
    //in welcome nav impostato a 1000
    var ctx=agent.context.get('vardisessione'); //per utente
    //var ctxLib=agent.context.get('contestolibretto');
    if (ctx){
      console.log('ho già il contesto quindi recupero id esame: lookup da params esami');
      console.log('LEGGO DAL CONTESTO UID '+ctx.parameters.userId);
    
      var userId=ctx.parameters.userId;
      var matId=ctx.parameters.matId;
      //MODIFICA DEL 17/05/2019 
      var stuId=ctx.parameters.stuId;
      console.log('LEGGO DAL CONTESTO matricola ID ='+matId + ' stuId '+stuId);
       //modifica del 25/03/2019
       var cdsId=ctx.parameters.cdsId;
       console.log('LEGGO DAL CONTESTO corso di studio id  ='+cdsId);
       /************************************************ */
      if (c.esami){
        var idEsame='';
        var idAppello='';
        for(var i =0;i<ctx.parameters.esami.length;i++){
          //ciclo nell'array dei nomi degli esami, se lo trovo, prendo il corrispondente id nel array ID
            if (ctx.parameters.esami[i]===paramEsame){
              console.log('******** TROVATO ESAME IN CTX ESAMI*******');
              idEsame=ctx.parameters.adsceId[i];
           
              //modifica del 25/03/2019 per prenotazione appelli
              idAppello=ctx.parameters.idAppelli[i];
              console.log('************ ID DI ESAME = '+idEsame + ' e con idAppello '+idAppello);
              break;
            }
          }
      }
  
      //25/03/2019 gestisco le prenotazioni, ho bisogno di sapere id degli appelli 
  
    }
  
    //IN BASE AL COMANDO ASSOCIATO ALL'INTENT ESEGUO AZIONE SU ESSETRE
      switch (strRicerca) {
        case 'getLibretto':
          console.log('sono nel getLibretto');
         
          controller.getLibretto().then((libretto)=> {
            var strTemp='';
           
            // strOutput='ecco gli esami ';
           
            if (Array.isArray(libretto)){
              
              for(var i=0; i<libretto.length; i++){
                
              
                strTemp+=  libretto[i].adDes+ ', frequentato  nell \'anno ' +libretto[i].aaFreqId +', anno di corso ' +
                libretto[i].annoCorso + '\n';
    
              }
              
            }
            //qui devo fare replace della @, che si trova in tmp[0]
            var str=strOutput;
            str=str.replace(/(@)/gi, strTemp);
            strOutput=str;
            agent.add(strOutput);
            console.log('strOutput con replace '+ strOutput);
            //provo qui  prova del 18/03/2019  FUNGE!!! commentato in data 20/03/2019 dopo getInizializzazione
           /* ctx=agent.context.get('contesto');
            ctx.parameters.id=arIDS;
            ctx.parameters.esami=arEsami;*/
            /********************************************************************************/ 
            resolve(agent);
          }).catch((error) => {
            console.log('Si è verificato errore : ' +error);
            
          
          });
          break;
          //28/01/2019
        case 'getInformazioni':
  
              //14/03/2109 il nuovo user è s262502 userId
              controller.getCarriera(userId).then((carriera)=> {
              var strTemp='';
              strTemp+='Ti sei immatricolato nell anno '+ carriera.aaId + ' , con numero matricola  '+ carriera.matricola + ', nel corso di laurea '+ carriera.cdsDes +', tipo di corso di laurea '+ carriera.tipoCorsoDes; + 'percorso '+carriera.pdsDes +', stato attuale :' +carriera.motStastuDes
              console.log('sono nella carriera ...');
              // console.log('ho lo studente '+studente.codFisc + 'matricola ID '+ studente.trattiCarriera[0].matId);
              // agent.setContext({ name: 'matricola', lifespan: 5, parameters: { matID: studente.trattiCarriera[0].matId }});
              
              var str=strOutput;
              str=str.replace(/(@)/gi, strTemp);
              strOutput=str;
              agent.add(strOutput);
              console.log('strOutput con replace '+ strOutput);
              resolve(agent);
              
              }).catch((error) => {
                console.log('Si è verificato errore : ' +error);
                
            
              });
              break;
        case 'getStudente':
        controller.getLibretto().then((libretto)=> {
          var strTemp='';
          // strOutput='ecco gli esami ';
          if (Array.isArray(libretto)){
            
          
              strTemp+='sei iscritto al ' +   libretto[0].annoCorso + ' anno di corso';
              console.log('comando getStudente->getLibretto: ' + strTemp);
          }
          //qui devo fare replace della @, che si trova in tmp[0]
          var str=strOutput;
          str=str.replace(/(@)/gi, strTemp);
          strOutput=str;
          agent.add(strOutput);
          console.log('strOutput con replace '+ strOutput);
          resolve(agent);
          }).catch((error) => {
          console.log('Si è verificato errore : ' +error);
          
        
        });
          break;
        //28/01/2019
        //19/03/2019 resta così per il momento
        case 'getNumeroMatricola':
          controller.getCarriera(userId).then((carriera)=> {
            var strTemp='';
            strTemp+='' + carriera.matricola;
          console.log('chiedo il numero di matricola ...');
          // console.log('ho lo studente '+studente.codFisc + 'matricola ID '+ studente.trattiCarriera[0].matId);
          // agent.setContext({ name: 'matricola', lifespan: 5, parameters: { matID: studente.trattiCarriera[0].matId }});
            
          var str=strOutput;
          str=str.replace(/(@)/gi, strTemp);
          strOutput=str;
          agent.add(strOutput);
          console.log('strOutput con replace '+ strOutput);
          resolve(agent);
            
          }).catch((error) => {
            
            var strError='Si è verificato errore : ' +error;
            console.log(strError);
            agent.add(strError);
            resolve(agent);
          });
          break;
          //28/01/2019
          case 'getAnnoImmatricolazione':
          controller.getCarriera(userId).then((carriera)=> {
            var strTemp='';
            var dt=carriera.dataImm; //elimino minuti e secondi
            strTemp+='' + dt.substring(0,10);
          console.log('chiedo la data immatricolazione...');
          // console.log('ho lo studente '+studente.codFisc + 'matricola ID '+ studente.trattiCarriera[0].matId);
          // agent.setContext({ name: 'matricola', lifespan: 5, parameters: { matID: studente.trattiCarriera[0].matId }});
            
          var str=strOutput;
          str=str.replace(/(@)/gi, strTemp);
          strOutput=str;
          agent.add(strOutput);
          console.log('strOutput con replace '+ strOutput);
          resolve(agent);
            
          }).catch((error) => {
            console.log('Si è verificato errore : ' +error);
            
          
          });
          break;
         
            /****************** NUOVO : GESTIONE DINAMICA ESAMI 15/03/2019 E 18/03/2019 **/
            
            //nuovo del 18/03/2019
  
          
  
          //  if (paramEsame===esameDC){   '5188667' matI
          case 'getInfoGenEsame':
              console.log('sono dentro getInfoGenEsame con esame '+paramEsame);
              controller.getEsame(matId,idEsame).then((esame) => { 
                var strTemp=''; 
                console.log( '**************** dati del singolo esame ******************');
        
                strTemp += ' anno di corso ' + esame.annoCorso +', codice '+ esame.adCod +', corso di ' + esame.adDes + ', crediti in  CFU' + esame.peso + ', attività didattica '
                + esame.statoDes +', frequentata nel '+  esame.aaFreqId;
                if (typeof esito !=='undefined' && esito.dataEsa!=='' && esito.voto!=null){
                
                //if (typeof esame.esito !=='undefined'){
                  var dt= esame.esito.dataEsa;
                  
                  strTemp +=', superata in data ' + dt.substring(0,10) + ' con voto di ' + esame.esito.voto + ' trentesimi'
                }
                var str=strOutput;
                str=str.replace(/(@)/gi, strTemp);
                strOutput=str;
                agent.add(strOutput);
                console.log('strOutput con replace in getInfoGenEsame'+ strOutput);
                resolve(agent);
  
            }).catch((error) => {
              console.log('Si è verificato errore in getInfoGenEsame: ' +error);
              
            
            });
            break;
         
          
          
            //******** DETTAGLIO DIRITTO COSTITUZIONALE  '5188667'*/
        
            //modifica del 18/03/2019
            //getAnnoEsame GENERICO -> DINAMICO
            case 'getAnnoEsame':
            controller.GetDettaglioEsame(matId,idEsame, 'annoCorso').then((esame) => { 
              var strTemp=''; 
              console.log( '**************** dati del ANNO getAnnoEsame= ' + esame.annoCorso);
      
              strTemp +=  esame.annoCorso; 
              var str=strOutput;
              str=str.replace(/(@)/gi, strTemp);
              strOutput=str;
              agent.add(strOutput);
              console.log('strOutput con replace in getAnnoEsame'+ strOutput);
              resolve(agent);
  
          }).catch((error) => {
            console.log('Si è verificato errore in getAnnoEsame: ' +error);
            
          
          });
            break;
            
        
            //18/03/2019 nuovo
            case 'getTipoEsame':
            controller.GetDettaglioEsame(matId,idEsame, 'tipoEsaDes').then((esame) => { 
              var strTemp=''; 
              console.log( '**************** dati del TIPO getTipoEsame ' +esame.tipoEsaDes);
      
              strTemp +=  esame.tipoEsaDes; 
              var str=strOutput;
              str=str.replace(/(@)/gi, strTemp);
              strOutput=str;
              agent.add(strOutput);
              console.log('strOutput con replace in getTipoEsame'+ strOutput);
              resolve(agent);
  
          }).catch((error) => {
            console.log('Si è verificato errore in getTipoEsame: ' +error);
            
          
          });
            break;
            //peso
            //19/03/2019 commentato diventa old
         
            //nuovo 19/03/2019
            case 'getCreditoFormativoEsame':
            controller.GetDettaglioEsame(matId,idEsame, 'peso').then((esame) => { 
              var strTemp=''; 
              console.log( '**************** dati del peso getCreditoFormativoEsame' +esame.peso);
      
              strTemp +=  esame.peso; 
              var str=strOutput;
              str=str.replace(/(@)/gi, strTemp);
              strOutput=str;
              agent.add(strOutput);
              console.log('strOutput con replace in getCreditoFormativoEsame'+ strOutput);
              resolve(agent);
  
          }).catch((error) => {
            console.log('Si è verificato errore in getCreditoFormativoEsame: ' +error);
            
          
          });
          break;
            //anno di frequenza diventato old in data 19/03/2019
           
            //nuovo del 19/03/2019
            case 'getAnnoFrequentatoEsame':
            controller.GetDettaglioEsame(matId,idEsame, 'aaFreqId').then((esame) => { 
              var strTemp=''; 
              console.log( '**************** dati del ANNO DI FREQUENZA getAnnoFrequentatoEsame' +esame.aaFreqId);
      
              strTemp +=  esame.aaFreqId;
              var str=strOutput;
              str=str.replace(/(@)/gi, strTemp);
              strOutput=str;
              agent.add(strOutput);
              console.log('strOutput con replace in getAnnoFrequentatoEsame'+ strOutput);
              resolve(agent);
  
          }).catch((error) => {
            console.log('Si è verificato errore in getAnnoFrequentatoEsame: ' +error);
            
          
          });
            break;
              
              //nuovo del 19/03/2019
              case 'getDataEsame':
              controller.GetDettaglioEsame(matId,idEsame, 'esito.dataEsa').then((esame) => { 
                console.log( '**************** dati del esito.dataEsa getDataEsame' +esame.esito.dataEsa);
                var strTemp=''; 
                var risposta=[];
                console.log('strOutput prima dello split '+ strOutput);
                risposta=strOutput.split("|");
                console.log('dopo lo split, risposta[0] ='+ risposta[0] + ", risposta[1] " + risposta[1]);
               
                //SE MANCA ESAME RIMPIAZZA IL TESTO 19/03/2019
                if (esame.esito.dataEsa==''){
                  // prova del 22/03/2018 originale sotto
                  //strOutput="Purtroppo non hai ancora sostenuto l'esame di "+paramEsame;
                  //ora la risposta proviene dall'agente 
                  strOutput=risposta[1];
              
                }else{
                  strTemp +=  esame.esito.dataEsa; 
                  //var str=strOutput; -> dopo modifica del 22/03/2019 devo scrivere come sotto
                  var str=risposta[0];
                  str=str.replace(/(@)/gi, strTemp);
                  strOutput=str;
                }
               
                
                agent.add(strOutput);
                console.log('strOutput con replace in getDataEsame'+ strOutput);
                resolve(agent);
  
            }).catch((error) => {
              console.log('Si è verificato errore in getDataEsame: ' +error);
              
            
            });
              break;
  
    
              case 'getVotoEsame':
              controller.GetDettaglioEsame(matId,idEsame, 'esito.voto').then((esame) => { 
                console.log( '**************** dati del  getVotoEsame esame.esito.voto ' +esame.esito.voto);
                var strTemp=''; 
                var risposta=[];
                console.log('strOutput prima dello split '+ strOutput);
                risposta=strOutput.split("|");
                console.log('dopo lo split, risposta[0] ='+ risposta[0] + ", risposta[1] " + risposta[1]);
               
                //19/03/2019
                if ( esame.esito.voto===null || esame.esito.voto==='' ){
                  //modifica del 22/03/2019 vedi anche GetDataEsame
                 // strOutput="Purtroppo non hai ancora sostenuto l'esame di "+paramEsame;
                 strOutput=risposta[1];
                }else{
                  strTemp +=  esame.esito.voto; 
                  //var str=strOutput; -> dopo modifica del 22/03/2019 devo scrivere come sotto
                  var str=risposta[0];
                  str=str.replace(/(@)/gi, strTemp);
                  strOutput=str;
                }
  
                
                agent.add(strOutput);
                console.log('strOutput con replace in getVotoEsame '+ strOutput);
                resolve(agent);
  
            }).catch((error) => {
              console.log('Si è verificato errore in getVotoEsame: ' +error);
              
            
            });
              break;
  
          
        //nuovo: 19/03/2019
        case 'getDocenteEsame':
        //controllo che idEsame rientri nell'elenco degli esami 
        //paramEsame
       // console.log('.......idEsame è stringa vuota ? '+idEsame);
        if (idEsame!=='')
        {
            controller.GetDocente(matId,idEsame).then((esame) => { 
              var strTemp=''; 
              console.log( '**************** dati del DOCENTE getDocenteEsame ');
      
              strTemp +=  esame; //ritorna una stringa con cognome e nome del docente
              var str=strOutput;
              str=str.replace(/(@)/gi, strTemp);
              strOutput=str;
              agent.add(strOutput);
              console.log('strOutput con replace in getDocenteEsame '+ strOutput);
              resolve(agent);
      
          }).catch((error) => {
            console.log('Si è verificato errore in getDocenteEsame: ' +error);
            
          
          });
      }else{
        console.log('esame '+ paramEsame +' non presente nel libretto');
        agent.add('esame '+ paramEsame +' non presente nel libretto');
        resolve(agent);
      }
      break;
      
        //nuovo del 18/03/2019
        case 'getTipoCorso':
          controller.getSegmento(matId,idEsame).then((esame) => { 
            var strTemp=''; 
            console.log( '**************** dati del TIPO CORSO getTipoCorso ');
    
            strTemp +=  esame; //ritorna una stringa con LEZ
            var str=strOutput;
            str=str.replace(/(@)/gi, strTemp);
            strOutput=str;
            agent.add(strOutput);
            console.log('strOutput con replace in getTipoCorso '+ strOutput);
            resolve(agent);
  
        }).catch((error) => {
          console.log('Si è verificato errore in getTipoCorso: ' +error);
          
        
        });
        break;
       
      //30/01/2019
      //getEsamiUltimoAnno ---> QUANTI ESAMI HO FATTO!!!
      case 'getEsamiUltimoAnno':
      controller.getEsamiUltimoAnno(matId,2018).then((libretto) => { 
        console.log('sono in getEsamiUltimoAnno')
        var strTemp='0'; 
        
        if (Array.isArray(libretto)){
          /*   
          for(var i=0; i<libretto.length; i++){
            
            strTemp+=  libretto[i].adDes+ ', frequentato  nell \'anno ' +libretto[i].aaFreqId +', anno di corso ' +
            libretto[i].annoCorso + '\n';
  
          }*/
          strTemp+=libretto.length;
          console.log('quanti esami ho fatto ='+ strTemp);
          
        } else {
            //caso in cui no ci sono esami
          strTemp="0"
        }
        //qui devo fare replace della @, che si trova in tmp[0]
        
  
        var str=strOutput;
        str=str.replace(/(@)/gi, strTemp);
        strOutput=str;
        agent.add(strOutput);
        
        console.log('strOutput con replace '+ strOutput);
        
        //agent.setContext({ name: 'libretto', lifespan: 5, parameters: { matID: studente.trattiCarriera[0].matId }});
        resolve(agent);
      }).catch((error) => {
        console.log('Si è verificato errore in getEsamiUltimoAnno: ' +error);
        //resolve('si è verificato errore '+error);
      
      });
        break;
        //getCreditiUltimoAnno-> dal 2017 al 2018 19/03/2019
        case 'getCreditiUltimoAnno':
        controller.getEsamiUltimoAnno(matId,2018).then((libretto) => { 
          console.log('sono in getCreditiUltimoAnno')
          var strTemp='0'; 
          var conteggioCFU=0;
          if (Array.isArray(libretto)){
              
            for(var i=0; i<libretto.length; i++){
              conteggioCFU+=libretto[i].peso;
              
  
            }
            console.log('conteggio di CFU per anno '+conteggioCFU);
            strTemp+=conteggioCFU;
            console.log(' ho totalizzato cfu ='+ strTemp);
            
          }
          //qui devo fare replace della @, che si trova in tmp[0]
          var str=strOutput;
          str=str.replace(/(@)/gi, strTemp);
          strOutput=str;
          agent.add(strOutput);
          
          console.log('strOutput con replace '+ strOutput);
          
          //agent.setContext({ name: 'libretto', lifespan: 5, parameters: { matID: studente.trattiCarriera[0].matId }});
          resolve(agent);
        }).catch((error) => {
          console.log('Si è verificato errore in getCreditiUltimoAnno : ' +error);
          
        
        });
          break;
          //MEDIA ARITMETICA
          //19/03/2019 resta inalterata per il momento
          case 'getMediaComplessiva':
          controller.getMediaComplessiva(matId).then((media) => { 
            console.log('sono in getMediaComplessiva');
            var strTemp='';
            //verifico che la media non sia null
            if (media===null){ 
              strTemp='0';
            } else{
              //strTemp=''; 
              strTemp+=media; 
            }
            
                
              console.log('la media in getMediaComplessiva= '+ strTemp);
              
                var str=strOutput;
                str=str.replace(/(@)/gi, strTemp);
                strOutput=str;
                agent.add(strOutput);
                
                console.log('strOutput con replace in getMediaComplessiva '+ strOutput);
            
                resolve(agent);
            }).catch((error) => {
              console.log('Si è verificato errore in getMediaComplessiva: ' +error);
              
          
            });
  
          break;
          //28/01/2019 AGGIUNTO ANCHE LO STOP
          case 'STOP':
          if (agent.requestSource=="ACTIONS_ON_GOOGLE"){
                  
          
  
            let conv = agent.conv();
  
            console.log(' ---- la conversazione PRIMA ----- ' + JSON.stringify(conv));
            
            conv.close(strOutput);
            console.log(' ---- la conversazione DOPO CHIUSURA ----- ' + JSON.stringify(conv));
            
            agent.add(conv);
            //altrimenti ritorna la strOutput
          } else{
            agent.add(strOutput);
          }
          resolve(agent);
          break;
          //20/03/2019
          //quando parte dialogo inizializzo applicazione con i dati dell'utente
          //che servono per effettuare le chiamate su EsseTre quindi 
          //id matricola, adsceId del libretto con i nomi esami
          //poi per le prenotazioni
          //Salvo tutto nel contesto
          /**** modificata in data 25/03/2019 per prenotazione: aggiunto cdsId 10094 giurisprudenza da login
           * e adId ossia attività didattica, campo della chiave Contestualizzata del libretto */
          case 'getInizializzazione':
              //faccio login con utente di test
              var uID=''; //userId
              var matricolaID=''; //matId
              var cdsId='';//10094 per giurisprundenza-> per la prenotazione
              var arAdId=[]; //array per adId per la prenotazione
              var arIDS=[]; //adsceId degli esami del libretto
              var arEsami=[]; //descrizioni degli esami del libretto
              //AGGIUNTA DEL 17/05/2019 PER ELIMINAZIONE PRENOTAZIONE APPELLO
              var stuId='';

              //ripristinato in data 03/05/2019
              controller.doLogin().then((stud) => { 
               console.log('sono in getInizializzazione doLogin');
               console.log('questo il valore di studente '+ JSON.stringify(stud));
               uID=stud.userId;
               console.log('uID = '+uID);
               matricolaID=stud.trattiCarriera[0].matId;
               stuId=stud.trattiCarriera[0].stuId;
               console.log('matricolaId ='+matricolaID + ' stuId '+stuId);
               //MODIFICA DEL 25/03/2019
               cdsId=stud.trattiCarriera[0].cdsId;
               console.log('CORSO DI STUDIO ID  ='+cdsId);
               //modifica del  20/03/2019   così ho in un contesto solo tutti i dati *******************
                  controller.getLibretto().then((libretto)=> {
                  
                    if (Array.isArray(libretto)){
                      console.log('sono in getInizializzazione getLibretto');
                      for(var i=0; i<libretto.length; i++){
                      
                        arIDS.push(libretto[i].adsceId);
                        console.log('->inserito in arIDS '+arIDS[i]);
                        arEsami.push(libretto[i].adDes);
                        console.log('->inserito in arEsami '+arEsami[i]);
                        //modifica del 25/03/2019
                        arAdId.push(libretto[i].chiaveADContestualizzata.adId);
                        console.log('-> inserito adId '+libretto[i].chiaveADContestualizzata.adId);
                      }
                      
                    //25/03/2019 AGGIUNTO cdsId E idAppelli PER LE PRENOTAZIONI APPELLI
                    //commentato in data 16/05/2019
                    agent.context.set({ name: 'vardisessione', lifespan: 1000, parameters: {  "userId": uID, "matId":matricolaID,"adsceId":arIDS, "esami":arEsami, "cdsId":cdsId,"idAppelli":arAdId,"stuId":stuId}});
                    agent.add(strOutput);
                    resolve(agent);
                  
                    }
                    }).catch((error) => {
                      console.log('Si è verificato errore in getInizializzazione -getLibretto: ' +error);
                    });
  
    
            }).catch((error) => {
                  console.log('Si è verificato errore in getInizializzazione -doLogin: ' +error);
                 
            });
           
           
            
          break;
          //************* P R E N O T A Z I O N E   A P P E L L O --------------------- 25/03/2019 -> MODIFICATO IN DATA 16/05/2019 MA LA QUERY DA S3 IMPIEG 30 SECONDI QUINDI TORNO AL LIBRETTO */
          case 'getPrenotazioneAppelli':
          case 'getAppelliEsame': // ********************  MODIFICA DEL 21/05/2019 FAKE
          var idAp=[]; 
          var strTemp='';

         
          //var appelliPrenotabiliPromises=[];
         
          controller.getPrenotazioni(matId).then((prenotazioni) => { //prenotazioni sono righe del libretto
             console.log('1) sono in getPrenotazioni '+new Date()); //+ JSON.stringify(prenotazioni)
             
             if (Array.isArray(prenotazioni)){
               console.log('sono in array prenotazioni '+new Date() + ' con adId '+prenotazioni[0].chiaveADContestualizzata.adId);
               for(var i=0; i<prenotazioni.length; i++){
                //nuovo del 16/05/2019
                //appelliPrenotabiliPromises.push(controller.getAppelloDaPrenotare(cdsId,'117741'))
                //originale commentato in data 16/05/2019  appelliDaPrenotare
                 idAp[i]= prenotazioni[i].chiaveADContestualizzata.adId;
                 console.log('**********idAp=========='+ idAp[i] + ' cdsId ' + cdsId);//prenotazioni[i].chiaveADContestualizzata.
                 /* **  MODIFICA DEL 21/05/2019 AGGIUNTA FAKE               *******/
                 strTemp+= 'Appello di ' + prenotazioni[i].adDes+ ' del 10 giugno 2019, appello di ' +  prenotazioni[i].adDes+' del 24 giugno 2019 \n';
                
                }
              
                //ri commentato di nuovo in data 16/05/2019 perchè la query impiega troppo tempo
                /*
                Promise.all(appelliPrenotabiliPromises).then((appelliDaPrenotare) => {
                  
                    if (Array.isArray(appelliDaPrenotare)){
                      console.log('2) sono dentro getAppelloDaPrenotare PROMISES con '+appelliDaPrenotare.length + ' appelli');
                      //var strTemp='';
                      for(var i=0; i<appelliDaPrenotare.length; i++){
        
                        strTemp+= 'Appello di ' + appelliDaPrenotare[i].adDes + ', in data '+ appelliDaPrenotare[i].dataInizioApp +', iscrizione aperta dal '+  
                                  appelliDaPrenotare[i].dataInizioIscr + ' fino al '+ appelliDaPrenotare[i].dataFineIscr +'\n';
                      
                       
                        }//fine for
                        console.log('Valore di strTemp '+ strTemp +new Date());
                        var str=strOutput;
                        str=str.replace(/(@)/gi, strTemp);
                        strOutput=str;
                        agent.add(strOutput);
                        console.log('strOutput con replace in  getPrenotazioni PROMISES ->  '+ strOutput +' ' +new Date());
                        resolve(agent);
                      } //fine if is array
                        
                    });
                */
                 //originale commentato in data 16/05/2019
               var str=strOutput;
                str=str.replace(/(@)/gi, strTemp);
                strOutput=str;
                agent.add(strOutput);
                console.log('strOutput con replace in  getPrenotazioneAppelli->  '+ strOutput);
                resolve(agent);
              }else{ //  16/05/2019 NON CI SONO APPELLI PRENOTABILI
                agent.add('Mi dispiace, non hai appelli prenotabili. Come posso aiutarti ora?');
                console.log('Mi dispiace, non hai effettuato prenotabili. Come posso aiutarti ora?');
                resolve(agent);
            }
            //commentato in data 08/05/2019 perchè la query impiega troppo tempo
          // agent.add('questo è appello che puoi prenotare '+idAp);
          //  resolve(agent);
            //return idAp; //111218
         /*}).then(function (idAp){
            controller.getAppelloDaPrenotare(cdsId,idAp).then((appelliDaPrenotare)=>{
              if (Array.isArray(appelliDaPrenotare)){
                console.log('2) sono dentro getAppelloDaPrenotare');
                var strTemp='';
                for(var i=0; i<appelliDaPrenotare.length; i++){
  
                  strTemp+= 'Appello di ' + appelliDaPrenotare[i].adDes + ', in data '+ appelliDaPrenotare[i].dataInizioApp +', iscrizione aperta dal '+  
                            appelliDaPrenotare[i].dataInizioIscr + ' fino al '+ appelliDaPrenotare[i].dataFineIscr +'\n';
                 
                  }
                }
                  console.log('Valore di strTemp '+ strTemp);
                  return strTemp;
              }).then(function (strTemp)  {
  
            
                var str=strOutput;
                str=str.replace(/(@)/gi, strTemp);
                strOutput=str;
                agent.add(strOutput);
                console.log('strOutput con replace in  getPrenotazioneAppelli-> getAppelloDaPrenotare '+ strOutput);
                resolve(agent);
             }).catch((error) => {
            console.log('Si è verificato errore in getPrenotazioneAppelli-> getAppelloDaPrenotare ' +error);
            agent.add('Si è verificato errore in getPrenotazioneAppelli> getAppelloDaPrenotare  ' +error);
            resolve(agent);
          });*/
  /* qua commentato di sera*/
        }).catch((error) => {
          console.log('Si è verificato errore in getPrenotazioneAppelli: ' +error);
          agent.add('Si è verificato errore in getPrenotazioneAppelli: ' +error);
          resolve(agent);
        }); 
  
              break;
        // ******** MODIFICA DEL 21/05/2019 PROSSIMI APPELLI DA INIZIARE LISTA COMPLETA FAKE *****************
        case "getListaAppelliCompleta":
            console.log('sono in getListaAppelliCompleta FAKE');
            var strTemp='';
            controller.getTuttiAppelliDaIniziareFake().then((risultato)=> {
              if (Array.isArray(risultato)){
                console.log('sono in array risultato FAKE');
                for(var i=0; i<risultato.length; i++){
                  strTemp+='\n appello di ' + risultato[i].desApp +  ', del giorno ' + risultato[i].turni.split(" ")[0] +'\n'; //+ ' alle ore ' + risultato[i].turni.split(" ")[1] +', esame dell\' anno '+  risultato[i].aaCalId +', con presidente ' +risultato[i].presidenteCognome + ' '+ risultato[i].presidenteNome 
                 }
                 var str=strOutput;
                 str=str.replace(/(@)/gi, strTemp);
                 strOutput=str;
                 agent.add(strOutput);
                 console.log('strOutput con replace in  getListaAppelliCompleta FAKE->  '+ strOutput);
                 resolve(agent);
              }

            }).catch((error) => {
              console.log('Si è verificato errore in getListaAppelliCompletaFake: ' +error);
              agent.add('Si è verificato errore in getListaAppelliCompletaFake: ' +error);
              resolve(agent);
            }); 

            break;
        //08/05/2019 getAppelliPrenotati: recupero la lista delle prenotazioni effettuate
        case 'getAppelliPrenotati':
          //console.log('sono in getApppelliPrenotati');
          /*** prova del 15/05/2019 ******* */
          var appelliPrenotatiPromises=[];
        
          var strTemp='';
         
          console.log('**** INIZIO TEST **** '+new Date());
          controller.getAppId(matId).then((risultato)=>{
            //verifica che CI SIANO LE PRENOTAZIONI!!!!
            if (Array.isArray(risultato)){
              console.log('HO LE PRENOTAZIONI \n' +JSON.stringify(risultato));
              for(var i=0; i<risultato.length; i++){
         
                  appelliPrenotatiPromises.push(controller.getDettaglioSingoloAppelloPrenotato(risultato[i].cdsId, risultato[i].adId,risultato[i].appId)); //);
              }  
              Promise.all(appelliPrenotatiPromises).then((result) => {
                  console.log('all resolved [**', JSON.stringify(result)+ '**] termine ' +new Date());
                  if (Array.isArray(result)){
                      for(var i=0; i<result.length; i++){
                     /* MODIFICA DEL 21/05/2019  formattazione della data e della ora esame*/
                     var dd=result[i].turni[0].dataOraEsa.split(" ");
                     //console.log('data ' + dd[0] + ' ora '+ dd[1].substring(0,5));
                        strTemp+='\n appello di ' + result[i].desApp + ', codice '+result[i].adCod + ', del giorno ' + dd[0] /*result[i].turni[0].dataOraEsa*/ + ' alle ore ' + dd[1].substring(0,5) +', esame dell\' anno '+  result[i].aaCalId +', con presidente ' +result[i].presidenteCognome + ' '+ result[i].presidenteNome +'\n';
                      } //fine for
                      var str=strOutput;
                      str=str.replace(/(@)/gi, strTemp);
                      strOutput=str;
                      agent.add(strOutput);
                      console.log('strOutput con replace in  getAppelliPrenotati FINE->  '+ strOutput+new Date());
                      resolve(agent);
                  } //fine if isArray(result
                });
              }else{ /*  15/05/2019 NON CI SONO PRENOTAZIONI */
                 agent.add('Mi dispiace, non hai effettuato prenotazioni. Come posso aiutarti ora?');
                 console.log('Mi dispiace, non hai effettuato prenotazioni. Come posso aiutarti ora?');
                 resolve(agent);
              }
              //fine if sArray(risultato)
          }).catch((error) => {
            console.log('Si è verificato errore in getAppelliPrenotati->getDettaglioSingoloAppelloPrenotato: ' +error);
            agent.add('Si è verificato errore in getAppelliPrenotati->getDettaglioSingoloAppelloPrenotato: ' +error);
            resolve(agent);
          });
        //intanto recupero dal libretto gli appelli prenotati DAL LIBRETTO
       /* controller.getPrenotati(matId).then((prenotazioni) => { 
          var adIdPrenotato='';
          var strTemp='';
          if (Array.isArray(prenotazioni)){
            console.log('ho gli appelli  già prenotati ');
            for(var i=0; i<prenotazioni.length; i++){
             
              adIdPrenotato=prenotazioni[i].chiaveADContestualizzata.adId;
              console.log('adId di appello prenotato '+ adIdPrenotato);
              strTemp+= 'Appello di ' + prenotazioni[i].adDes+ ', codice '+prenotazioni[i].adCod +', tipo esame '+prenotazioni[i].tipoEsaDes;

             }
             var str=strOutput;
             str=str.replace(/(@)/gi, strTemp);
             strOutput=str;
             agent.add(strOutput);
             console.log('strOutput con replace in  getAppelliPrenotati->  '+ strOutput);
             resolve(agent);
           
            }
          }).catch((error) => {
            console.log('Si è verificato errore in getAppelliPrenotati: ' +error);
            agent.add('Si è verificato errore in getAppelliPrenotati: ' +error);
            resolve(agent);
          }); */

        break;
        /*************** MODIFICA DEL 21/05/2019 PER FORMATTARE LE DATE IN CONFERMA DI PRENOTAZIONE ESAME  */
          case 'getInfoAppelloEsame':
              console.log('sono in getInfoAppelloEsame');
              var strTemp='';
              if (ctx.parameters.date){
                console.log('ho il parametro data');
                agent.add('ho il parametro date');
                resolve(agent);
              }else{  
                console.log('NON ho il parametro data');
              agent.add('NON ho il parametro date');
              resolve(agent);

              }
            

          break;



          /***************  FINE MODIFICA DEL 21/05/2019 PER FORMATTARE LE DATE IN CONFERMA DI PRENOTAZIONE ESAME  */

        /*  F A R E     U  N  A   P R E N O T A Z I O N E  ->  P O S T       17/05/2019    *********************/
          case 'getPrenotaEsame':
           console.log('sono in POST DI getPrenotaEsame');
           var strTemp='';
            controller.postSingoloAppelloDaPrenotare(cdsId,idAppello,'215',idEsame).then((res)=>{ //cdsId,adId,appId,adsceId
              if (res){
                console.log('faccio post di prenotazione con cdsId '+cdsId + 'adId '+ idAppello + 'appID lo metto io '+' adsceId '+idEsame+ ' nome di paramEsame '+paramEsame);
                 strTemp=paramEsame;
                 var str=strOutput;
                 str=str.replace(/(@)/gi, strTemp);
                 strOutput=str;
                 agent.add(strOutput);
                //console.log('nome di paramEsame '+paramEsame);
               // agent.add('faccio post di prenotazione con cdsId '+cdsId + 'adId '+ idAppello + 'appID lo metto io '+' adsceId '+idEsame + ' nome di paramEsame '+paramEsame);
                resolve(agent);
              }else{
                console.log('la prenotazione non è andata a buon fine');
                agent.add('la prenotazione non è andata a buon fine');
                resolve(agent);
              }
            });
            //
          break;
          //***************** 17/05/2019 E L I M I N A Z I O N E   P R E N O T A Z I O N E */
          case 'getCancellaPrenotazione':
              console.log('sono in DELETE DI getCancellaPrenotazione con stuId '+stuId);
              var strTemp=''; 
              controller.deleteSingoloAppelloDaPrenotare(cdsId,idAppello,'215',stuId).then((res)=>{ //cdsId,adId,appId,studId
                if (res){
                  console.log('faccio delete della prenotazione appello con cdsId '+cdsId + 'adId '+ idAppello + 'appID lo metto io '+' stuId '+stuId+ ' nome di paramEsame '+paramEsame);
                   strTemp=paramEsame;
                   var str=strOutput;
                   str=str.replace(/(@)/gi, strTemp);
                   strOutput=str;
                   agent.add(strOutput);
                  //console.log('nome di paramEsame '+paramEsame);
                 // agent.add('faccio post di prenotazione con cdsId '+cdsId + 'adId '+ idAppello + 'appID lo metto io '+' adsceId '+idEsame + ' nome di paramEsame '+paramEsame);
                  resolve(agent);
                }else{
                  console.log('la cancellazione non è andata a buon fine');
                  agent.add('la cancellazione non è andata a buon fine');
                  resolve(agent);
                }
              });
          break;
        default:
        
          console.log('nel default ossia risponde il fallback in callAVANEW ');
          callAVA(agent).then((agent)=>{
            resolve(agent);
          });
          //agent.add('sono nel default');
          //resolve(agent);
          break;
      } //fine switch
        
      /* agent.add('il comando è '+ tmp[0]);
       resolve(agent);*/
        
       }).catch((error) => {
      
         console.log('errore '+ error);
       
      });  
  // });
  
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
exports.callAVANEW=callAVANEW;
//exports.Panloquacity=Panloquacity;
//module.exports=Panloquacity;