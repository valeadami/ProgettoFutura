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
        //console.log('carico dinamicamente clsControllerS3.js');
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
    //console.log('strOutput agente prima di EsseTre :' + strOutput);
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
      //console.log('ho già il contesto quindi recupero id esame: lookup da params esami');
      //console.log('LEGGO DAL CONTESTO UID '+ctx.parameters.userId);
    
      var userId=ctx.parameters.userId;
      var matId=ctx.parameters.matId;
      //MODIFICA DEL 17/05/2019 
      var stuId=ctx.parameters.stuId;
      console.log('LEGGO DAL CONTESTO matricola ID ='+matId + ' stuId '+stuId);
       //modifica del 25/03/2019
       var cdsId=ctx.parameters.cdsId;
       //console.log('LEGGO DAL CONTESTO corso di studio id  ='+cdsId);
       /************************************************ */
      if (ctx.parameters.esami){
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
          console.log('clsPanloquacity-> comando getLibretto');
         
          controller.getLibretto().then((libretto)=> {
            var strTemp='';
           
            // strOutput='ecco gli esami ';
           
            if (Array.isArray(libretto)){
              
              for(var i=0; i<libretto.length; i++){
                
              /****************   modifica del 22/05/2019 LASCIO SOLO IL NOME DELL'ESAME  *************/
                strTemp+=  libretto[i].adDes; /*+ ', frequentato  nell \'anno ' +libretto[i].aaFreqId +', anno di corso ' +
              libretto[i].annoCorso + '\n';*/
              /* */
              

                if (i<libretto.length-1)
                    strTemp+=',';
              }
              
            }
  
            //qui devo fare replace della @, che si trova in tmp[0]
            var str=strOutput;
            str=str.replace(/(@)/gi, strTemp);
            strOutput=str;
            agent.add(strOutput);
            console.log('strOutput con replace in getLibretto '+ strOutput);
            //provo qui  prova del 18/03/2019  FUNGE!!! commentato in data 20/03/2019 dopo getInizializzazione
           /* ctx=agent.context.get('contesto');
            ctx.parameters.id=arIDS;
            ctx.parameters.esami=arEsami;*/
            /********************************************************************************/ 
            resolve(agent);
          }).catch((error) => {
            console.log('Si è verificato errore : ' +error);
            agent.add('Mi dispiace, si è verificato un errore leggendo il libretto. Riprova più tardi.');
            resolve(agent);
          });
          break;
          //28/01/2019
        case 'getInformazioni':
              
              //14/03/2109 il nuovo user è s262502 userId
              controller.getCarriera(userId).then((carriera)=> {
                  //MODIFICA DEL 06/07/2019 DOPO CAMBIO DI API ANAGRAFICA
                if (carriera!==false){

                  var strTemp='';
                  strTemp+='La tua immatricolazione è dell\'anno '+ carriera.aaId + ' , con numero matricola  '+ carriera.matricola + ', nel corso di laurea '+ carriera.cdsDes +', tipo di corso di laurea '+ carriera.tipoCorsoDes + ', percorso '+carriera.pdsDes +', stato attuale ' +carriera.motStastuDes
                  console.log('clsPanloquacity->getCarriera');
                  // console.log('ho lo studente '+studente.codFisc + 'matricola ID '+ studente.trattiCarriera[0].matId);
                  // agent.setContext({ name: 'matricola', lifespan: 5, parameters: { matID: studente.trattiCarriera[0].matId }});
                  
                  var str=strOutput;
                  str=str.replace(/(@)/gi, strTemp);
                  strOutput=str;
                  agent.add(strOutput);
                  console.log('strOutput con replace  in getInformazioni: '+ strOutput);
                  resolve(agent);
                }else{
                  console.log('getCarriera torna false ');
                  agent.add('Mi dispiace, si è verificato un errore leggendo la tua carriera. Riprova più tardi.');
                  resolve(agent);
                }
              }).catch((error) => {
                console.log('Si è verificato errore in getInformazioni: ' +error);
                agent.add('Mi dispiace, si è verificato un errore leggendo la tua carriera. Riprova più tardi.');
                resolve(agent);
            
              });
              break;
        case 'getStudente':
        controller.getLibretto().then((libretto)=> {
          var strTemp='';
          if (Array.isArray(libretto)){
            console.log('clsPanloquacity->getLibretto');
          //MODIFICA DEL 01/07/2019 SOTTO ORIGINALE
              // strTemp+='sei iscritto all\' anno di corso ' +   libretto[0].annoCorso;
            //SONO SU GOOGLE HOME O DA ASSISTANT PER CELL
              if (agent.requestSource == "ACTIONS_ON_GOOGLE") {
                const { SimpleResponse} = require('actions-on-google');
                let conv = agent.conv();
                //SE OUTPUT SOLO VOCALE 
                if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
                  strTemp+='Sei iscritto al <say-as interpret-as="ordinal">' + libretto[0].annoCorso +'</say-as> anno di corso';
                  var str=strOutput;
                  str=str.replace(/(@)/gi, strTemp);
                 //var strGA=str; //stringa strGA contiene il solo testo per uscita su Google Assistant su cell
                  strOutput='<speak>'+str+'</speak>';
                  conv.ask(new SimpleResponse({
                    speech: strOutput
                  //  text:str
                      }));
                
                //ALTRIMENTI HO schermo supportato GA e/o Google Nest
                }else{ 
                  var strTemp2='Sei iscritto al ' + libretto[0].annoCorso +' anno di corso'; //questo viene in output
                  var strGA=strOutput; //prendo testo da DF ecco le informazioni universitarie ....
                  strGA=strGA.replace(/(@)/gi, strTemp2);
                  strTemp+='Sei iscritto al <say-as interpret-as="ordinal">' + libretto[0].annoCorso +'</say-as> anno di corso';
                  var str=strOutput;
                  str=str.replace(/(@)/gi, strTemp);
                 //var strGA=str; //stringa strGA contiene il solo testo per uscita su Google Assistant su cell
                  strOutput='<speak>'+str+'</speak>';
                  conv.ask(new SimpleResponse({
                    speech: strOutput,
                    text:strGA
                    }));

              }
               
          
              agent.add(conv);
              console.log('strOutput con replace in getStudente->getLibretto: '+ strOutput);
              resolve(agent);
              
              
              }//fine if ACTIONS_ON
              else{ //altre piattaforme
                var str=strOutput;
                str=str.replace(/(@)/gi, strTemp);
                strOutput=str;
                agent.add(strOutput);
                console.log('strOutput con replace in getStudente->getLibretto: '+ strOutput);
                resolve(agent);

              }
            
          }
          //QUI SOTTO ORIGINALE PRIMA DELLA MODIFICA DEL 01/07/2019
          //qui devo fare replace della @, che si trova in tmp[0]
          /*var str=strOutput;
          str=str.replace(/(@)/gi, strTemp);
          strOutput=str;
          agent.add(strOutput);
          console.log('strOutput con replace in getStudente->getLibretto: '+ strOutput);
          resolve(agent);*/
          }).catch((error) => {
          console.log('Si è verificato errore getStudente->getLibretto: ' +error);
          agent.add('Mi dispiace, si è verificato un errore leggendo i tuoi dati dal libretto. Riprova più tardi.');
          resolve(agent);
        
        });
          break;
        //28/01/2019
        //19/03/2019 resta così per il momento
        //MODIFICA DEL 06/07/2019 DOPO CAMBIO DI API ANAGRAFICA
        case 'getNumeroMatricola':
          controller.getCarriera(userId).then((carriera)=> {
            if (carriera !==false){
              console.log('clsPanloquacity->getNumeroMatricola->getCarriera');
              var strTemp='';
              strTemp+='' + carriera.matricola;
              //console.log('chiedo il numero di matricola ...');
              // console.log('ho lo studente '+studente.codFisc + 'matricola ID '+ studente.trattiCarriera[0].matId);
              // agent.setContext({ name: 'matricola', lifespan: 5, parameters: { matID: studente.trattiCarriera[0].matId }});
                
              var str=strOutput;
              str=str.replace(/(@)/gi, strTemp);
              strOutput=str;
              agent.add(strOutput);
              console.log('strOutput con replace in getNumeroMatricola '+ strOutput);
              resolve(agent);
            }else{
              console.log('getCarriera torna false');
           
              agent.add('Mi dispiace, si è verificato un errore leggendo il tuo numero di matricola. Riprova più tardi.');
              resolve(agent);
            }
           
            
          }).catch((error) => {
            
            console.log('Si è verificato errore in getNumeroMatricola->getCarriera: ' +error);
           
            agent.add('Mi dispiace, si è verificato un errore leggendo il tuo numero di matricola. Riprova più tardi.');
            resolve(agent);
          });
          break;
          //28/01/2019
            //MODIFICA DEL 06/07/2019 DOPO CAMBIO DI API ANAGRAFICA
          case 'getAnnoImmatricolazione':
          controller.getCarriera(userId).then((carriera)=> {
            if (carriera!==false){

              var strTemp='';
              var dt=carriera.dataImm; //elimino minuti e secondi
              strTemp+='' + dt.substring(0,10);
              //console.log('chiedo la data immatricolazione...');
              // console.log('ho lo studente '+studente.codFisc + 'matricola ID '+ studente.trattiCarriera[0].matId);
              // agent.setContext({ name: 'matricola', lifespan: 5, parameters: { matID: studente.trattiCarriera[0].matId }});
                
              var str=strOutput;
              str=str.replace(/(@)/gi, strTemp);
              strOutput=str;
              agent.add(strOutput);
              console.log('strOutput con replace in getAnnoImmatricolazione->getCarriera '+ strOutput);
              resolve(agent);
            }else{
              console.log('getCarriera torna false ');
              agent.add('Mi dispiace, si è verificato un errore leggendo il tuo anno di immatricolazione. Riprova più tardi.');
              resolve(agent);
            }
            
          }).catch((error) => {
            console.log('Si è verificato errore in getAnnoImmatricolazione->getCarriera : ' +error);
            agent.add('Mi dispiace, si è verificato un errore leggendo il tuo anno di immatricolazione. Riprova più tardi.');
            resolve(agent);
          
          });
          break;
         
            /****************** NUOVO : GESTIONE DINAMICA ESAMI 15/03/2019 E 18/03/2019 **/
            
            //nuovo del 18/03/2019
  
          
  
          //  if (paramEsame===esameDC){   '5188667' matI
          case 'getInfoGenEsame':
              console.log('clsPanloquacity->getInfoGenEsame->getEsame con esame '+paramEsame + ' e idEsame '+ idEsame);
              controller.getEsame(matId,idEsame).then((esame) => { //5188673  idEsame
                var strTemp=''; 
               // console.log( '**************** dati del singolo esame ******************');
        
                strTemp += ' anno di corso ' + esame.annoCorso +', codice '+ esame.adCod +', corso di ' + esame.adDes + ', crediti in  CFU' + esame.peso + ', attività didattica '
                + esame.statoDes +' nel '+  esame.aaFreqId; //, frequentata
                if (typeof esito !=='undefined' && esito.dataEsa!=='' && esito.voto!=null){
                
                //if (typeof esame.esito !=='undefined'){
                  var dt= esame.esito.dataEsa;
                  
                  strTemp +=', superata in data ' + dt.substring(0,10) + ' con voto di ' + esame.esito.voto + ' trentesimi'
                }
                var str=strOutput;
                str=str.replace(/(@)/gi, strTemp);
                strOutput=str;
                agent.add(strOutput);
                console.log('strOutput con replace in getInfoGenEsame->getEsame '+ strOutput);
                resolve(agent);
  
            }).catch((error) => {
              console.log('Si è verificato errore in getInfoGenEsame->getEsame: ' +error);
              agent.add('Mi dispiace, si è verificato un errore leggendo le informazioni sui tuoi esami. Riprova più tardi.');
              resolve(agent);
            
            });
            break;
         
          
          
            //******** DETTAGLIO DIRITTO COSTITUZIONALE  '5188667'*/
        
            //modifica del 18/03/2019
            //getAnnoEsame GENERICO -> DINAMICO
            case 'getAnnoEsame':
            console.log('clsPanloquacity->getAnnoEsame->GetDettaglioEsame ');
            controller.GetDettaglioEsame(matId,idEsame, 'annoCorso').then((esame) => { 
              var strTemp=''; 
              //console.log( '**************** dati del ANNO getAnnoEsame= ' + esame.annoCorso);
              /* MODIFICA DEL 02/07/2019 PER GESTIRE NUMERO ORDINALE
              strTemp +=  esame.annoCorso; 
              var str=strOutput;
              str=str.replace(/(@)/gi, strTemp);
              strOutput=str;
              agent.add(strOutput);
              console.log('strOutput con replace in getAnnoEsame'+ strOutput);
              resolve(agent);
            */
           if (agent.requestSource == "ACTIONS_ON_GOOGLE") {
            const { SimpleResponse} = require('actions-on-google');
            let conv = agent.conv();
            //SE OUTPUT SOLO VOCALE 
            if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
              strTemp+='<say-as interpret-as="ordinal">' + esame.annoCorso +'</say-as>';
              var str=strOutput;
              str=str.replace(/(@)/gi, strTemp);
           
              strOutput='<speak>'+str+'</speak>';
              conv.ask(new SimpleResponse({
                speech: strOutput
             
                  }));
            
            //ALTRIMENTI HO schermo supportato GA e/o Google Nest
            }else{ 
              var strTemp2= esame.annoCorso; //questo viene in output
              var strGA=strOutput; //prendo testo da DF $esame è un corso del @ anno
              strGA=strGA.replace(/(@)/gi, strTemp2);
              strTemp+='<say-as interpret-as="ordinal">' + esame.annoCorso +'</say-as>';
              var str=strOutput;
              str=str.replace(/(@)/gi, strTemp);
              strOutput='<speak>'+str+'</speak>';
              conv.ask(new SimpleResponse({
                speech: strOutput,
                text:strGA
                }));

          }
           
      
          agent.add(conv);
          console.log('strOutput con replace in getAnnoEsame->GetDettaglioEsame '+ strOutput);
          resolve(agent);
          
          
          }//fine if ACTIONS_ON
          else{ //altre piattaforme
              strTemp +=  esame.annoCorso; 
              var str=strOutput;
              str=str.replace(/(@)/gi, strTemp);
              strOutput=str;
              agent.add(strOutput);
              console.log('strOutput con replace in getAnnoEsame->GetDettaglioEsame '+ strOutput);
              resolve(agent);

          }

          }).catch((error) => {
            console.log('Si è verificato errore in getAnnoEsame->GetDettaglioEsame: ' +error);
            agent.add('Mi dispiace, si è verificato un errore leggendo le informazioni sui tuoi esami. Riprova più tardi.');
            resolve(agent);
          
          });
            break;
            
        
            //18/03/2019 nuovo
            case 'getTipoEsame':
            console.log('clsPanloquacity->getTipoEsame->GetDettaglioEsame ');
            controller.GetDettaglioEsame(matId,idEsame, 'tipoEsaDes').then((esame) => { 
              var strTemp=''; 
              //console.log( '**************** dati del TIPO getTipoEsame ' +esame.tipoEsaDes);
      
              strTemp +=  esame.tipoEsaDes; 
              var str=strOutput;
              str=str.replace(/(@)/gi, strTemp.toLowerCase()); //modifica del 01/07/2019
              strOutput=str;
              agent.add(strOutput);
              console.log('strOutput con replace in getTipoEsame->GetDettaglioEsame '+ strOutput);
              resolve(agent);
  
          }).catch((error) => {
            console.log('Si è verificato errore in getTipoEsame->GetDettaglioEsame: ' +error);
            agent.add('Mi dispiace, si è verificato un errore leggendo le informazioni sui tuoi esami. Riprova più tardi.');
            resolve(agent);
          
          });
            break;
            //peso
            //19/03/2019 commentato diventa old
         
            //nuovo 19/03/2019
            case 'getCreditoFormativoEsame':
              console.log('clsPanloquacity->getCreditoFormativoEsame->GetDettaglioEsame ');
              controller.GetDettaglioEsame(matId,idEsame, 'peso').then((esame) => { 
                var strTemp=''; 
                //console.log( '**************** dati del peso getCreditoFormativoEsame' +esame.peso);
        
              strTemp +=  esame.peso; 
              var str=strOutput;
              str=str.replace(/(@)/gi, strTemp);
              strOutput=str;
              agent.add(strOutput);
              console.log('strOutput con replace in getCreditoFormativoEsame->GetDettaglioEsame '+ strOutput);
              resolve(agent);
  
          }).catch((error) => {
            console.log('Si è verificato errore in getCreditoFormativoEsame->GetDettaglioEsame: ' +error);
            agent.add('Mi dispiace, si è verificato un errore leggendo le informazioni sui tuoi esami. Riprova più tardi.');
            resolve(agent);
          
          });
          break;
            //anno di frequenza diventato old in data 19/03/2019
           
            //nuovo del 19/03/2019
            case 'getAnnoFrequentatoEsame':
              console.log('clsPanloquacity->getAnnoFrequentatoEsame->GetDettaglioEsame ');
              controller.GetDettaglioEsame(matId,idEsame, 'aaFreqId').then((esame) => { 
                var strTemp=''; 
                //console.log( '**************** dati del ANNO DI FREQUENZA getAnnoFrequentatoEsame' +esame.aaFreqId);
      
              strTemp +=  esame.aaFreqId;
              var str=strOutput;
              str=str.replace(/(@)/gi, strTemp);
              strOutput=str;
              agent.add(strOutput);
              console.log('strOutput con replace in getAnnoFrequentatoEsame>GetDettaglioEsame  '+ strOutput);
              resolve(agent);
  
          }).catch((error) => {
            console.log('Si è verificato errore in getAnnoFrequentatoEsame>GetDettaglioEsame : ' +error);
            agent.add('Mi dispiace, si è verificato un errore leggendo le informazioni sui tuoi esami. Riprova più tardi.');
            resolve(agent);
          
          });
            break;
              
              //nuovo del 19/03/2019
              case 'getDataEsame':
                console.log('clsPanloquacity->getDataEsame->GetDettaglioEsame ');
                controller.GetDettaglioEsame(matId,idEsame, 'esito.dataEsa').then((esame) => { 
                // console.log( '**************** dati del esito.dataEsa getDataEsame' +esame.esito.dataEsa);
                var strTemp=''; 
                var risposta=[];
                //console.log('strOutput prima dello split '+ strOutput);
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
                console.log('strOutput con replace in getDataEsame->GetDettaglioEsame '+ strOutput);
                resolve(agent);
  
            }).catch((error) => {
              console.log('Si è verificato errore in getDataEsame->GetDettaglioEsame: ' +error);
              agent.add('Mi dispiace, si è verificato un errore leggendo le informazioni sui tuoi esami. Riprova più tardi.');
              resolve(agent);
            
            });
              break;
  
    
              case 'getVotoEsame':
                console.log('clsPanloquacity->getVotoEsame->GetDettaglioEsame ');
                controller.GetDettaglioEsame(matId,idEsame, 'esito.voto').then((esame) => { 
                  //console.log( '**************** dati del  getVotoEsame esame.esito.voto ' +esame.esito.voto);
                var strTemp=''; 
                var risposta=[];
                //console.log('strOutput prima dello split '+ strOutput);
                risposta=strOutput.split("|");
               // console.log('dopo lo split, risposta[0] ='+ risposta[0] + ", risposta[1] " + risposta[1]);
               
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
                console.log('strOutput con replace in getVotoEsame->GetDettaglioEsame  '+ strOutput);
                resolve(agent);
  
            }).catch((error) => {
              console.log('Si è verificato errore in getVotoEsame->GetDettaglioEsame : ' +error);
              agent.add('Mi dispiace, si è verificato un errore leggendo le informazioni sui tuoi esami. Riprova più tardi.');
              resolve(agent);
            
            });
              break;
  
          
        //nuovo: 19/03/2019
        case 'getDocenteEsame':
        //controllo che idEsame rientri nell'elenco degli esami 
        //paramEsame
       // console.log('.......idEsame è stringa vuota ? '+idEsame);
        console.log('clsPanloquacity->getDocenteEsame->GetDocente ');
        if (idEsame!=='')
        {
            controller.GetDocente(matId,idEsame).then((esame) => { 
              var strTemp=''; 
              //console.log( '**************** dati del DOCENTE getDocenteEsame ');
      
              strTemp +=  esame; //ritorna una stringa con cognome e nome del docente
              var str=strOutput;
              str=str.replace(/(@)/gi, strTemp);
              strOutput=str;
              agent.add(strOutput);
              console.log('strOutput con replace in getDocenteEsame->GetDocente'+ strOutput);
              resolve(agent);
      
          }).catch((error) => {
            console.log('Si è verificato errore in getDocenteEsame->GetDocente: ' +error);
            agent.add('Mi dispiace, si è verificato un errore leggendo le informazioni sui tuoi esami. Riprova più tardi.');
            resolve(agent);
          
          });
      }else{
        console.log('esame '+ paramEsame +' non presente nel libretto');
        agent.add('esame '+ paramEsame +' non presente nel libretto');
        resolve(agent);
      }
      break;
      
        //nuovo del 18/03/2019
        case 'getTipoCorso':
            console.log('clsPanloquacity->getTipoCorso->getSegmento ');
            controller.getSegmento(matId,idEsame).then((esame) => { 
            var strTemp=''; 
            //console.log( '**************** dati del TIPO CORSO getTipoCorso ');
    
            strTemp +=  esame; //ritorna una stringa con LEZ
            var str=strOutput;
            str=str.replace(/(@)/gi, strTemp);
            strOutput=str;
            agent.add(strOutput);
            console.log('strOutput con replace in getTipoCorso '+ strOutput);
            resolve(agent);
  
        }).catch((error) => {
          console.log('Si è verificato errore in getTipoCorso: ' +error);
          agent.add('Mi dispiace, si è verificato un errore leggendo le informazioni sul tuo corso di studi. Riprova più tardi.');
          resolve(agent);
        
        });
        break;
       
      //30/01/2019
      //getEsamiUltimoAnno ---> QUANTI ESAMI HO FATTO!!!
      case 'getEsamiUltimoAnno':
      controller.getEsamiUltimoAnno(matId,2018).then((libretto) => { 
        console.log('clsPanloquacity->getEsamiUltimoAnno->getEsamiUltimoAnno ');
        //console.log('sono in getEsamiUltimoAnno')
        var strTemp=''; //modifica del 01/07/2019
        
        if (Array.isArray(libretto)){
          /*   
          for(var i=0; i<libretto.length; i++){
            
            strTemp+=  libretto[i].adDes+ ', frequentato  nell \'anno ' +libretto[i].aaFreqId +', anno di corso ' +
            libretto[i].annoCorso + '\n';
  
          }*/
          strTemp+=libretto.length;
          //console.log('quanti esami ho fatto ='+ strTemp);
          
        } else {
            //caso in cui no ci sono esami
          strTemp="0"
        }
        //qui devo fare replace della @, che si trova in tmp[0]
        
  
        var str=strOutput;
        str=str.replace(/(@)/gi, strTemp);
        strOutput=str;
        agent.add(strOutput);
        
        console.log('strOutput con replace getEsamiUltimoAnno->getEsamiUltimoAnno '+ strOutput);
        
        //agent.setContext({ name: 'libretto', lifespan: 5, parameters: { matID: studente.trattiCarriera[0].matId }});
        resolve(agent);
      }).catch((error) => {
        console.log('Si è verificato errore in getEsamiUltimoAnno->getEsamiUltimoAnno: ' +error);
        //resolve('si è verificato errore '+error);
        agent.add('Mi dispiace, si è verificato un errore leggendo le informazioni sui tuoi esami. Riprova più tardi.');
        resolve(agent);
      });
        break;
        //getCreditiUltimoAnno-> dal 2017 al 2018 19/03/2019
        case 'getCreditiUltimoAnno':
          console.log('clsPanloquacity->getCreditiUltimoAnno->getEsamiUltimoAnno ');
          controller.getEsamiUltimoAnno(matId,2018).then((libretto) => { 
          //console.log('sono in getCreditiUltimoAnno')
          var strTemp=''; //modifica del 01/07/2019 -> 00 crediti 
          var conteggioCFU=0;
          if (Array.isArray(libretto)){
              
            for(var i=0; i<libretto.length; i++){
              conteggioCFU+=libretto[i].peso;
              
  
            }
            //console.log('conteggio di CFU per anno '+conteggioCFU);
            strTemp+=conteggioCFU;
            //console.log(' ho totalizzato cfu ='+ strTemp);
            
          }
          //qui devo fare replace della @, che si trova in tmp[0]
          var str=strOutput;
          str=str.replace(/(@)/gi, strTemp);
          strOutput=str;
          agent.add(strOutput);
          
          console.log('strOutput con replace getCreditiUltimoAnno->getEsamiUltimoAnno '+ strOutput);
          
          //agent.setContext({ name: 'libretto', lifespan: 5, parameters: { matID: studente.trattiCarriera[0].matId }});
          resolve(agent);
        }).catch((error) => {
          console.log('Si è verificato errore in ggetCreditiUltimoAnno->getEsamiUltimoAnno : ' +error);
          agent.add('Mi dispiace, si è verificato un errore leggendo le informazioni sui tuoi crediti universitari. Riprova più tardi.');
          resolve(agent);
        
        });
          break;
          //MEDIA ARITMETICA
          //19/03/2019 resta inalterata per il momento
          case 'getMediaComplessiva':
           console.log('clsPanloquacity->getMediaComplessiva->getMediaComplessiva ');

            controller.getMediaComplessiva(matId).then((media) => { 
           // console.log('sono in getMediaComplessiva');
            var strTemp='';
            //verifico che la media non sia null
            if (media===null){ 
              strTemp='0';
            } else{
              //strTemp=''; 
              strTemp+=media; 
            }
            
                
              //console.log('la media in getMediaComplessiva= '+ strTemp);
              
                var str=strOutput;
                str=str.replace(/(@)/gi, strTemp);
                strOutput=str;
                agent.add(strOutput);
                
                console.log('strOutput con replace in getMediaComplessiva->getMediaComplessiva '+ strOutput);
            
                resolve(agent);
            }).catch((error) => {
              console.log('Si è verificato errore in getMediaComplessiva->getMediaComplessiva: ' +error);
              agent.add('Mi dispiace, si è verificato un errore leggendo le informazioni sulla tua media. Riprova più tardi.');
              resolve(agent);
          
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
              console.log('claPanloquacity->getInizializzazione->doLogin '); //con valore di stud + JSON.stringify(stud)
               
               // ************************ MODIFICA DEL 02/07/2019 ***
               //se login va a buon fine, cioè torna il body dello studente, allora sistema ok
               if (stud!==false){
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
                    //in questo caso, login con codice 401 - modifica del 02/07/2019
               }else{


                agent.add("Mi dispiace, il sistema di EsseTre è in manutenzione. Riprova più tardi.");
                resolve(agent);
               }
               
               
  
    
            }).catch((error) => {
                  console.log('Si è verificato errore in getInizializzazione -doLogin: ' +error);
                 
            });
           
           
            
          break;
          //************* P R E N O T A Z I O N E   A P P E L L O --------------------- 25/03/2019 -> MODIFICATO IN DATA 16/05/2019 MA LA QUERY DA S3 IMPIEG 30 SECONDI QUINDI TORNO AL LIBRETTO */
          case 'getPrenotazioneAppelli':
          case 'getAppelliEsame': // ********************  MODIFICA DEL 21/05/2019 FAKE
            var idAp=[]; 
            var strTemp='';
              
            console.log('clsPanloquacity->getPrenotazioneAppelli-getAppelliEsame->getPrenotazioni');
            //var appelliPrenotabiliPromises=[];
          
            controller.getPrenotazioni(matId).then((prenotazioni) => { //prenotazioni sono righe del libretto
             //console.log('1) sono in getPrenotazioni '+new Date()); //+ JSON.stringify(prenotazioni)
             //MODIFICA DEL 25/06/2019 VERIFICARE CHE ARRAY DI PRENOTAZIONI ABBIA ALMENO UN ELEMENTO
             if (Array.isArray(prenotazioni) && (prenotazioni.length>=1)){
               console.log('sono in array prenotazioni '+new Date() + ' con adId '+prenotazioni[0].chiaveADContestualizzata.adId);
               for(var i=0; i<prenotazioni.length; i++){
                //nuovo del 16/05/2019
                //appelliPrenotabiliPromises.push(controller.getAppelloDaPrenotare(cdsId,'117741'))
                //originale commentato in data 16/05/2019  appelliDaPrenotare
                 idAp[i]= prenotazioni[i].chiaveADContestualizzata.adId;
                 //console.log('**********idAp=========='+ idAp[i] + ' cdsId ' + cdsId);//prenotazioni[i].chiaveADContestualizzata.
                 /* **  MODIFICA DEL 21/05/2019 AGGIUNTA FAKE   e del 01/07/2019 E DEL 02/07/2019    *******/
                // strTemp+=  prenotazioni[i].adDes+ ' del 8 luglio 2019';
                //modificato il 02/07/2019 dopo richiesta a M. Salata di inserire nuovi appelli
                //**********  modifica del 05/07/2019 su richiesta di Sergio: solo le date se c'è un solo appello ****************
                //test di replace della stringa DIRITO PRIVATO I IN 1
               // prenotazioni[i].adDes=prenotazioni[i].adDes.replace(/( I)/gi, " uno");
                strTemp+= prenotazioni[i].adDes+ ' in data 16 luglio 2019, 7 agosto 2019.'; //Quale data vuoi scegliere?
                
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
                console.log('strOutput con replace in  getPrenotazioneAppelli-getAppelliEsame->getPrenotazioni  '+ strOutput);
                resolve(agent);
              }else{ //  16/05/2019 NON CI SONO APPELLI PRENOTABILI
                agent.add('Mi dispiace, non hai appelli prenotabili. Come posso aiutarti ora?');
                console.log('Mi dispiace, non hai appelli prenotabili. Come posso aiutarti ora?');
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
  /* modifica del 25/06/2019 cambiato messaggio di errore in output */
        }).catch((error) => {
          console.log('Si è verificato errore in getPrenotazioneAppelli-getAppelliEsame->getPrenotazioni: ' +error);
          agent.add('Mi dispiace, si è verificato errore durante l\' accesso  agli appelli. Riprova più tardi.');
          resolve(agent);
        }); 
  
              break;
        // ******** MODIFICA DEL 21/05/2019 PROSSIMI APPELLI DA INIZIARE LISTA COMPLETA FAKE *****************
        case "getListaAppelliCompleta":
            
            console.log('clsPanloquacity->getListaAppelliCompleta->getTuttiAppelliDaIniziareFake');
           
            controller.getTuttiAppelliDaIniziareFake().then((risultato)=> {
              if (Array.isArray(risultato)){
                //MODIFICA DEL 05/07/2019 ORA ABBIAMO UN SOLO APPELLO DIRITTO PRIVATO 1
                var strTemp='\n appello di ' + risultato[0].desApp; 
                //console.log('sono in array risultato FAKE');
                for(var i=0; i<risultato.length; i++){
                  strTemp+='  del giorno ' + risultato[i].turni.split(" ")[0] +'\n'; //+ ' alle ore ' + risultato[i].turni.split(" ")[1] +', esame dell\' anno '+  risultato[i].aaCalId +', con presidente ' +risultato[i].presidenteCognome + ' '+ risultato[i].presidenteNome 
                 }
                 var str=strOutput;
                 str=str.replace(/(@)/gi, strTemp);
                 strOutput=str;
                 agent.add(strOutput);
                 console.log('strOutput con replace in  getListaAppelliCompleta->getTuttiAppelliDaIniziareFake  '+ strOutput);
                 resolve(agent);
              }

            }).catch((error) => {
              console.log('Si è verificato errore in getListaAppelliCompleta->getTuttiAppelliDaIniziareFake: ' +error);
              agent.add('Mi dispiace, si è verificato errore durante la lettura degli appelli. Riprova più tardi.');
              resolve(agent);
            }); 

            break;
        //08/05/2019 getAppelliPrenotati: recupero la lista delle prenotazioni effettuate
        case 'getAppelliPrenotati':
          console.log('clsPanloquacity->getAppelliPrenotati->getAppId->getDettaglioSingoloAppelloPrenotato');;
          /*** modifica del 15/05/2019 *******  modifica del 22/05/2019   gestione output da console DF con risposta diversa in caso no appelli */
          var appelliPrenotatiPromises=[];
        
          var strTemp='';
          var risposta=[]; //22/05/2019 in caso di appelli non prenotati risposta predefinita da console
          risposta=strOutput.split("|");
          //console.log('dopo lo split, risposta[0] ='+ risposta[0] + ", risposta[1] " + risposta[1]);
          //console.log('**** INIZIO TEST **** '+new Date());
          controller.getAppId(matId).then((risultato)=>{
            //verifica che CI SIANO LE PRENOTAZIONI!!!!
            if (Array.isArray(risultato)){
              //dò la prima risposta ossia elenco prenotazioni
             // console.log('HO LE PRENOTAZIONI \n' +JSON.stringify(risultato));
              
              for(var i=0; i<risultato.length; i++){
         
                  appelliPrenotatiPromises.push(controller.getDettaglioSingoloAppelloPrenotato(risultato[i].cdsId, risultato[i].adId,risultato[i].appId)); //);
              }  
              Promise.all(appelliPrenotatiPromises).then((result) => {
                 console.log('all resolved [**', JSON.stringify(result)+ '**] termine ' +new Date());
                  if (Array.isArray(result)){
                    //MODIFICA DEL 06/07/2019 
                    var nomeAppello=result[0].desApp; //BONIFICO LA STRINGA
                    nomeAppello=nomeAppello.replace(/( I)/gi, "UNO");
                    strTemp+='Appello di ' + result[0].desApp +' in data '; //MODIFICA DEL 06/07/2019 
                      for(var i=0; i<result.length; i++){
                     /* MODIFICA DEL 21/05/2019  formattazione della data e della ora esame*/
                     var dd=result[i].turni[0].dataOraEsa.split(" ");
                     //console.log('data ' + dd[0] + ' ora '+ dd[1].substring(0,5));
                     //MODIFICA DEL 06/07/2019 RIDUCO LA LUNGHEZZA DELLA RISPOSTA E NN RIPETO IL NOME DELL'APPELLO
                       // strTemp+='\n appello di ' + result[i].desApp + ', codice '+result[i].adCod + ', del giorno ' + dd[0] /*result[i].turni[0].dataOraEsa*/ + ' alle ore ' + dd[1].substring(0,5) +', esame dell\' anno '+  result[i].aaCalId +', con presidente ' +result[i].presidenteCognome + ' '+ result[i].presidenteNome +'\n';
                       strTemp+= dd[0] /*result[i].turni[0].dataOraEsa*/ + ' alle ore ' + dd[1].substring(0,5) +','; // +', esame dell\' anno '+  result[i].aaCalId +', con presidente ' +result[i].presidenteCognome + ' '+ result[i].presidenteNome +'\n';
                      } //fine for
                      var str= risposta[0];// 22/05/2019--> strOutput;
                      str=str.replace(/(@)/gi, strTemp);
                      strOutput=str;
                      agent.add(strOutput);
                      console.log('strOutput con replace in  getAppelliPrenotati FINE->  '+ strOutput+ ' ' + new Date());
                      resolve(agent);
                  } //fine if isArray(result
                });
              }else{ /*  15/05/2019 NON CI SONO PRENOTAZIONI */
                 agent.add(risposta[1]); //--> 22/05/2019 'Mi dispiace, non hai effettuato prenotazioni. Come posso aiutarti ora?'
                 console.log('Mi dispiace, non hai effettuato prenotazioni. Come posso aiutarti ora?');
                 resolve(agent);
              }
              //fine if sArray(risultato)
          }).catch((error) => {
            console.log('Si è verificato errore in getAppelliPrenotati->getDettaglioSingoloAppelloPrenotato: ' +error);
            agent.add('Mi dispiace, ei è verificato errore durante la lettura degli appelli che hai prenotato. Riprova più tardi. ' +error);
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
              console.log('clsPanloquacity->getInfoAppelloEsame');
             
              var strTemp;
              if (ctx.parameters.date){
                
                var vv=ctx.parameters.date.split('T')[0]; //2019-06-10
                console.log('ho il parametro date con valore: ' + vv);
                //modifica del 03/07/2019 controllo che le date siano valide 
                  if  ( (vv==='2019-07-08') || ( vv==='2019-07-16') || ( vv==='2019-08-07') ){
                    strTemp=vv.split('-');

                    var str=strOutput;
                    str=str.replace(/(@)/gi, strTemp[2]+'/'+strTemp[1]+'/'+strTemp[0]);
                    strOutput=str;
                    agent.add(strOutput);
                    resolve(agent);

                  }else{
                    console.log('la data non è valida ...')
                    agent.add('Mi dispiace, non ci sono appelli in questa data. Le date disponibili sono  16 luglio 2019 e 7 agosto 2019.');
                    resolve(agent);  
                  }
                
                /* originale
                strTemp=vv.split('-');

                 var str=strOutput;
                 str=str.replace(/(@)/gi, strTemp[2]+'/'+strTemp[1]+'/'+strTemp[0]);
                 strOutput=str;
                 agent.add(strOutput);
                resolve(agent);*/
              }else{  
                console.log('NON ho il parametro data');
              agent.add('Scusami ma mi manca la data, non posso procedere. Ripeti per favore la data dell\'appello');
              resolve(agent);

              }
            

          break;

            //getInfoAppelloPrenotato intent cancella appello prenotato #esse3 #appelli #cancellazione
            case 'getInfoAppelloPrenotato':
              console.log('sono in getInfoAppelloPrenotato cancellazione prenotazione');
             
              var strTemp;
              if (ctx.parameters.date){
                //console.log('ho il parametro data');
                var vv=ctx.parameters.date.split('T')[0]; //2019-06-10
                strTemp=vv.split('-');

                 var str=strOutput;
                 str=str.replace(/(@)/gi, strTemp[2]+'/'+strTemp[1]+'/'+strTemp[0]);
                 strOutput=str;
                 agent.add(strOutput);
                resolve(agent);
              }else{  
                console.log('NON ho il parametro data');
              agent.add('Non ho il parametro date');
              resolve(agent);

              }
            

          break;

          /***************  FINE MODIFICA DEL 21/05/2019 PER FORMATTARE LE DATE IN CONFERMA DI PRENOTAZIONE ESAME  */

        /*  F A R E     U  N  A   P R E N O T A Z I O N E  ->  P O S T       17/05/2019    *********************/
          /* modificato in data 11/06/2019 esame da 215 a 216 appello del 24 giugno */
           /* modificato in data 01/07/2019 esame da 216 a 217 appello del 8 luglio */
           /* MODIFICA DEL 02/07/2019 per gestire i nuovi appelli caricati da M. Salata */
        case 'getPrenotaEsame':
           console.log('sono in POST DI clsPanloquacity->getPrenotaEsame');
           if (ctx.parameters.date){
            //console.log('ho il parametro data');
            var appId=ctx.parameters.date.split('T')[0]; //2019-06-10
            console.log('******* sono in getPrenotaEsame e ho il param date con valore '+ appId); //2019-07-08
            switch(appId){
              case '2019-07-08':
                appId='217';
              break;
              case '2019-07-16':
                  appId='218';
              break;
              case '2019-08-07':
                  appId='219';
              break;
              default:
                  appId='217';
              break;
             
            }
           
           }
           var strTemp='';
            controller.postSingoloAppelloDaPrenotare(cdsId,idAppello,appId,idEsame).then((res)=>{ //cdsId,adId,appId,adsceId
              if (res){
                console.log('faccio post di prenotazione con cdsId '+cdsId + ', adId '+ idAppello + ', appID' +appId + ', adsceId '+idEsame+ ', nome di paramEsame '+paramEsame);
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
                agent.add('Mi dispiace, la prenotazione non è andata a buon fine. Riprova più tardi.');
                resolve(agent);
              }
            });
            //
          break;
          //***************** 17/05/2019 E L I M I N A Z I O N E   P R E N O T A Z I O N E */
           /* modificato in data 11/06/2019 esame da 215 a 216 appello del 24 giugno */
            /* modificato in data 01/07/2019 esame 216 a 217 appello del 08 luglio */
          case 'getCancellaPrenotazione':
              console.log('sono in DELETE DI getCancellaPrenotazione');
              var strTemp=''; 
              if (ctx.parameters.date){
                //console.log('ho il parametro data');
                var appId=ctx.parameters.date.split('T')[0]; //2019-06-10
                console.log('******* sono in getCancellaPrenotazione e ho il param date con valore '+ appId); //2019-07-08
                switch(appId){
                  case '2019-07-08':
                    appId='217';
                  break;
                  case '2019-07-16':
                      appId='218';
                  break;
                  case '2019-08-07':
                      appId='219';
                  break;
                  default:
                      appId='217';
                  break;
                }
               }
              controller.deleteSingoloAppelloDaPrenotare(cdsId,idAppello,appId,stuId).then((res)=>{ //cdsId,adId,appId,studId
                if (res){
                  console.log('faccio delete della prenotazione appello con cdsId '+cdsId + ', adId '+ idAppello + ', appID  '+appId +', stuId '+stuId+ ', nome di paramEsame '+paramEsame);
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
                  agent.add('Mi dispiace, la cancellazione dell\'iscrizione all\'appello non è andata a buon fine. Riprova più tardi.');
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
         agent.add('Mi dispiace, si è verificato un errore. Riprova più tardi.');
         resolve(agent);
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