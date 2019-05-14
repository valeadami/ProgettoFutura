var http = require("https");
var studente=require('./clsStudente.js');
var carriera=require('./clsCarriera.js');
var rigaLibretto=require('./clsRigaLibretto.js');
var appello=require('./clsAppello.js');
var request = require("request");

//login
var strUrlLogin='https://units.esse3.pp.cineca.it/e3rest/api/login';
//logout
var strUrlLogout='https://units.esse3.pp.cineca.it/e3rest/api/logout'
//anagrafica utente homepage dopo login ->carriere(userId)
var strUrlAnagraficaHome='https://units.esse3.pp.cineca.it/e3rest/api/anagrafica-service-v1/carriere/'; //s260856/
//scelgo link libretto
var strUrlGetLibretto="https://units.esse3.pp.cineca.it/e3rest/api/libretto-service-v1/libretti/291783/righe/"; //?filter=adDes%3D%3D'DIRITTO%20COSTITUZIONALE'
//per recuperare esami prenotabili vado sul libretto
var strUrlGetSingoloEsame='https://units.esse3.pp.cineca.it/e3rest/api/libretto-service-v1/libretti/'; // 286879/5057980  matId=286879  adsceId=5057980
//var GetSingoloDettaglioEsame='https://units.esse3.pp.cineca.it/e3rest/api/libretto-service-v1/libretti'; // 286879/righe/5057980?fields=annoCorso';
//var strUrlAppelliPrenotabili='https://units.esse3.pp.cineca.it/e3rest/api/libretto-service-v1/libretti/' ;// 286879/righe/?filter=numAppelliPrenotabili%3D%3D1';
//qui recupero ultima data utile dell'appello collegato a una riga del libretto
var strUrlGetAppelloDaPrenotare='https://units.esse3.pp.cineca.it/e3rest/api/calesa-service-v1/appelli/'; //10094/117740/?stato=P'  appelli/10094/111218/215

var strUrlPostAppello='https://units.esse3.pp.cineca.it/e3rest/api/calesa-service-v1/appelli/'; //10094/117740/5/iscritti'
var strUrlDeleteAppello='https://units.esse3.pp.cineca.it/e3rest/api/calesa-service-v1/appelli/'; //10094/117740/5/iscritti/236437;'
//09/05/2019
var prenotazioniMatIdAppId='https://units.esse3.pp.cineca.it/e3rest/api/calesa-service-v1/prenotazioni/'; // + mattricola cioè /291783/
//var dettSingoloAppelloPrenotato='https://units.esse3.pp.cineca.it/e3rest/api/calesa-service-v1/appelli/10094/111218/215'
// PARTIZIONI-> PER NOME DOCENTE 'https://units.esse3.pp.cineca.it/e3rest/api/libretto-service-v1/libretti/286879/righe/5057982/partizioni; //
//segmenti -> per il tipo di corso LEZ https://units.esse3.pp.cineca.it/e3rest/api/lifbretto-service-v1/libretti/286879/righe/5057980/segmenti
// ESAMI SOSTENUTI NEL 2018 PERTINENTI AL 2017 https://units.esse3.pp.cineca.it/e3rest/api/libretto-service-v1/libretti/286879/righe/?filter=esito.aaSupId%3D%3D2017
// MEDIA ARITMETICA DEL LIBRETTO https://units.esse3.pp.cineca.it/e3rest/api/libretto-service-v1/libretti/286879/medie/CDSORD/A
//var strUrlGetAppelliPrenotati=strUrlGetSingoloEsame';
//qui ci vorrà user e pwd
function getEsseTreLogin(){
    return new Promise(function(resolve, reject) {
    var options = { 
        method: 'GET',
        url: strUrlLogin,
        headers: 
            { 
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
                'Authorization': 'Basic czI2MjUwMjpDR1ZZUDNURQ=='
            },
        json: true 
    }
   
    request(options, function (error, response, body) {
        if (error) {
            reject(error);
            console.log('errore in doLogin '+ error);
        } else {
            if (response.statusCode==200){
                console.log(body);
                resolve(body); //ritorna una oggetto json
            }  
        }

    });

});

}
function doLogin(){
    return new Promise(function(resolve, reject) {
    getEsseTreLogin().then((body)=>{
       var stud; //15/01/2019 non studente perchè è un riferimento al modulo 
        stud=new studente(body.user.codFis,body.user.firstName,body.user.lastName,body.user.grpDes,body.user.grpId,body.user.id, body.user.persId,body.user.userId,body.user.trattiCarriera);
        stud.log()
        resolve(stud);

    });
});
}
//riscrivo doLogin con le promise
function doLogout(){

    var blnLogout=false;

    var options = { 
        method: 'GET',
        url: strUrlLogout,
        headers: 
            { 
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
                'Authorization': 'Basic czI2MjUwMjpDR1ZZUDNURQ=='
            },
        json: true 
    }
   
    let rawData = '';
    request(options, function (error, response, body) {
    if (error) throw new Error(error);
        if (response.statusCode==200){
            blnLogout=true;
            console.log('\n USCITO DALLA SESSIONE DI ESSETRE');
            studente=undefined;
        }else {

            //LOGIN FAILED
            console.log('response.statusCode ' + response.statusCode);
            console.log('logout failed');
        }
        return blnLogout;
    });
}
//get carriere/userid-> anagrafica utente IN HOMEPAGE
//passo lo username dello studente s260856
function getCarrieraAnagraficaHome(userId){
return new Promise(function(resolve, reject) {
    var options = { 
        method: 'GET',
        url: strUrlAnagraficaHome +userId +'/', //passo userid dello studente loggato
        headers: 
            { 
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
                'Authorization': 'Basic czI2MjUwMjpDR1ZZUDNURQ=='
            },
        json: true 
    }
  
    request(options, function (error, response, body) {
        if (error) {
            reject(error);
            console.log('errore in getCarrieraAnagraficaHome '+ error);
        } else {
            if (response.statusCode==200){
                console.log(body);
                resolve(body); //ritorna una oggetto json
            }  
        }

    });
  });
}

//********LIBRETTO */
function getEsseTreLibretto(){
    return new Promise(function(resolve, reject) {
    var options = { 
        method: 'GET',
        url: strUrlGetLibretto,
        headers: 
            { 
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
                'Authorization': 'Basic czI2MjUwMjpDR1ZZUDNURQ=='
            },
        json: true 
    }
   
    request(options, function (error, response, body) {
        if (error) {
            reject(error);
            console.log('errore in doLogin '+ error);
        } else {
            if (response.statusCode==200){
                console.log(body);
                resolve(body); //ritorna una oggetto json
            }  
        }

    });

});

}
//getSingoloEsame(matID, adsceId)
function getSingoloEsame(matId, adsceId){ //matID, adsceId
    return new Promise(function(resolve, reject) {
        var options = { 
            method: 'GET',
            url: strUrlGetSingoloEsame  + matId +'/righe/' + adsceId,
            headers: 
                { 
                    'cache-control': 'no-cache',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic czI2MjUwMjpDR1ZZUDNURQ=='
                },
            json: true 
        }
        request(options, function (error, response, body) {
            console.log('url di singolo esame '+ options.url);
            if (error) {
                reject(error);
                console.log('errore in getSingoloEsame '+ error);
            } else {
                if (response.statusCode==200){
                 
                    resolve(body); 
                }  
            }
    
        });
    
    }); 
}

function getEsame(matId, adsceId){ //matId, adsceId
    return new Promise(function(resolve, reject) {
      
        var rawData='';
        getSingoloEsame(matId, adsceId).then((body)=>{ //matId, adsceId
            rawData=JSON.stringify(body);
            console.log('\n\nQUESTO IL BODY del SINGOLO ESAME ' +rawData);
          //modifica del 29/01/2018
          /* singoloEsame=new rigaLibretto(body.aaFreqId,body.adCod, 
                body.adDes,body.adsceId, body.annoCorso, body.chiaveADContestualizzata.adId, 
                body.dataFreq,body.dataScadIscr,body.esito.dataEsa);*/
            singoloEsame=new rigaLibretto(body.aaFreqId,body.adCod, 
                    body.adDes,body.adsceId, body.annoCorso, 
                    body.chiaveADContestualizzata,
                    body.dataFreq, body.dataScadIscr, body.dataChiusura, body.esito,
                    body.freqObbligFlg, body.freqUffFlg, body.gruppoGiudCod,  body.gruppoGiudDes,
                    body.gruppoVotoId, body.gruppoVotoLodeFlg, body.gruppoVotoMaxVoto,
                    body.gruppoVotoMinVoto, body.itmId, body.matId, body.numAppelliPrenotabili,
                    body.numPrenotazioni, body.ord, body.peso, body.pianoId, body.ragId,body.raggEsaTipo,
                    body.ricId, body.sovranFlg,body.stato, body.statoDes, body.stuId,body.superataFlg,
                    body.tipoEsaCod, body.tipoEsaDes, body.tipoInsCod, body.tipoInsDes);
            singoloEsame.log();
            resolve(singoloEsame);
          
        });
      
    });
}
//29/01/2019
function GetSingoloDettaglioEsame(matId,adsceId, param){ //matID, adsceId, param con param=annoCorso
    return new Promise(function(resolve, reject) {
        var options = { 
            method: 'GET',
            url: strUrlGetSingoloEsame  + matId +'/righe/' + adsceId+'?fields='+param,
            headers: 
                { 
                    'cache-control': 'no-cache',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic czI2MjUwMjpDR1ZZUDNURQ=='
                },
            json: true 
        }
        request(options, function (error, response, body) {
            console.log('url di singolo esame '+ options.url);
            if (error) {
                reject(error);
                console.log('errore in GetSingoloDettaglioEsame '+ error);
            } else {
                if (response.statusCode==200){
                 
                    resolve(body); 
                }  
            }
    
        });
    
    }); 
}
function GetDettaglioEsame(matId, adsceId,param){ //matId, adsceId
    return new Promise(function(resolve, reject) {
      //da verificare che il param sia corretto!!!
        var rawData='';
        var singoloEsame;
        GetSingoloDettaglioEsame(matId, adsceId, param).then((body)=>{ //matId, adsceId
            rawData=JSON.stringify(body);
            console.log('\n\nQUESTO IL BODY del DETTAGLIO CON PARAMETRO ' +rawData);
          //modifica del 29/01/2018
         switch (param){
            case 'annoCorso':
                singoloEsame=new rigaLibretto(undefined,undefined,undefined,adsceId, body.annoCorso);
                console.log('annoCorso di adsceId ' +adsceId +' con param '+param + ':' + body.annoCorso);
                resolve(singoloEsame);
            break;


            case 'aaFreqId':
                singoloEsame=new rigaLibretto(body.aaFreqId);
                console.log('aaFreqId di adsceId ' +adsceId +' con param '+param + ':' + body.aaFreqId);
                resolve(singoloEsame);
            break;

            case 'peso':
                singoloEsame=new rigaLibretto(undefined,undefined,undefined,adsceId,undefined,undefined,undefined, undefined,undefined,undefined,
                    undefined,undefined,undefined,undefined,
                    undefined,undefined,undefined,undefined,undefined,undefined,undefined,
                    undefined, undefined,
                    body.peso);
                console.log('peso di adsceId ' +adsceId +' con param '+param + ':' + body.peso);
                resolve(singoloEsame);
            break;

            case 'tipoEsaDes':
  
                    singoloEsame=new rigaLibretto(undefined,undefined, 
                        undefined,undefined, undefined, 
                        undefined,
                        undefined, undefined, undefined,undefined,
                        undefined, undefined, undefined,  undefined,
                        undefined, undefined, undefined,
                        undefined, undefined, undefined, undefined,
                        undefined,undefined, undefined, undefined, undefined,undefined,
                        undefined, undefined,undefined, undefined, undefined,undefined,
                        body.tipoEsaDes,body.tipoEsaDes);
               
                      
                console.log('tipoEsaDes di adsceId ' +adsceId +' con param '+param + ':' + body.tipoEsaDes );
                resolve(singoloEsame);
            break;
                        //esito esame
            case 'esito.dataEsa':
                        var esito={
                            "dataEsa":body.esito.dataEsa.substring(0,10)//substring(0,10)
                        }
                    singoloEsame=new rigaLibretto(undefined,undefined, 
                        undefined,adsceId, undefined, 
                        undefined,
                        undefined, undefined, undefined,esito);
               
                      
                console.log('esito.dataEsa di adsceId ' +adsceId +' con param '+param + ':' + body.esito.dataEsa + ' e singolo esame' +singoloEsame.esito.dataEsa);
                resolve(singoloEsame);
            break;
            //esito voto
            case 'esito.voto':
                    var esitoVoto={
                        "voto":body.esito.voto
                    }
                    singoloEsame=new rigaLibretto(undefined,undefined, 
                        undefined,adsceId, undefined, 
                        undefined,
                        undefined, undefined, undefined,esitoVoto);
            
                    
                console.log('esito.voto di adsceId ' +adsceId +' con param '+param + ':' + body.esito.voto + ' e singolo esame con voto' +singoloEsame.esito.voto);
                resolve(singoloEsame);
            break;
            default:
            singoloEsame=new rigaLibretto(body.aaFreqId,body.adCod, 
                body.adDes,body.adsceId, body.annoCorso, 
                body.chiaveADContestualizzata,
                body.dataFreq, body.dataScadIscr, body.dataChiusura, body.esito,
                body.freqObbligFlg, body.freqUffFlg, body.gruppoGiudCod,  body.gruppoGiudDes,
                body.gruppoVotoId, body.gruppoVotoLodeFlg, body.gruppoVotoMaxVoto,
                body.gruppoVotoMinVoto, body.itmId, body.matId, body.numAppelliPrenotabili,
                body.numPrenotazioni, body.ord, body.peso, body.pianoId, body.ragId,body.raggEsaTipo,
                body.ricId, body.sovranFlg,body.stato, body.statoDes, body.stuId,body.superataFlg,
                body.tipoEsaCod, body.tipoEsaDes, body.tipoInsCod, body.tipoInsDes);
       
                resolve(singoloEsame);
            break;
         }
            
          
        });
      
    });
}
//******* 30/01/2019 partizioni per aver nome e cognome del docente */
//'https://units.esse3.pp.cineca.it/e3rest/api/libretto-service-v1/libretti/286879/righe/5057982/partizioni

function GetDocenteEsame(matId,adsceId){ //matID, adsceId, param con param=annoCorso
    return new Promise(function(resolve, reject) {
        var options = { 
            method: 'GET',
            url: strUrlGetSingoloEsame  + matId +'/righe/' + adsceId+'/partizioni',
            headers: 
                { 
                    'cache-control': 'no-cache',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic czI2MjUwMjpDR1ZZUDNURQ=='
                },
            json: true 
        }
        request(options, function (error, response, body) {
            console.log('url di GetDocenteEsame-partizioni '+ options.url);
            if (error) {
                reject(error);
                console.log('errore in GetDocenteEsame '+ error);
            } else {
                if (response.statusCode==200){
                 
                    resolve(body); 
                }  
            }
    
        });
    
    }); 
}
function GetDocente(matId,adsceId){ //matID, adsceId, param con param=annoCorso
    return new Promise(function(resolve, reject) {
        GetDocenteEsame(matId, adsceId).then((body)=>{ 
            var strDocente='';
            rawData=JSON.stringify(body);
            console.log('\n\nQUESTO IL BODY del DOCENTE DA PARTIZIONI ' +rawData);
         if (Array.isArray(body)){
           
            strDocente=body[0].cognomeDocTit + ' ' + body[0].nomeDoctit;
            console.log('il nome del docente '+ strDocente)
            resolve(strDocente);

         }else{
            resolve(strDocente);
            console.log('il nome del docente manca');
         }
           
          
        });
    
    }); 
}

//https://units.esse3.pp.cineca.it/e3rest/api/libretto-service-v1/libretti/286879/righe/5057980/segmenti
//getSegmentoEsame
function getSegmentoEsame(matId,adsceId){ 
    return new Promise(function(resolve, reject) {
        var options = { 
            method: 'GET',
            url: strUrlGetSingoloEsame  + matId +'/righe/' + adsceId+'/segmenti',
            headers: 
                { 
                    'cache-control': 'no-cache',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic czI2MjUwMjpDR1ZZUDNURQ=='
                },
            json: true 
        }
        request(options, function (error, response, body) {
            console.log('url di getSegmentoEsame '+ options.url);
            if (error) {
                reject(error);
                console.log('errore in getSegmentoEsame '+ error);
            } else {
                if (response.statusCode==200){
                 
                    resolve(body); 
                }  
            }
    
        });
    
    }); 
}
//getSegmento
function getSegmento(matId,adsceId){ //matID, adsceId, param con param=annoCorso
    return new Promise(function(resolve, reject) {
        getSegmentoEsame(matId, adsceId).then((body)=>{ 
            var tipoCorso='';
            rawData=JSON.stringify(body);
            console.log('\n\nQUESTO IL BODY del tipoCorso ' +rawData);
         if (Array.isArray(body)){
            console.log('il tipo di corso ora = '+body[0].attributi.tipoCreCod);
           /* tipoCorso=body[0].attibuti.tipoCreCod.toString();
            
            console.log('il tipo del corso '+ tipoCorso);
            tipoCorso=body[0].attibuti.tipoCreCod.toString();*/
            resolve(body[0].attributi.tipoCreCod); //body[0].attributi.tipoCreCod 
            //perchè??? non ho ancora capito...

         }else{
            resolve(tipoCorso);
            console.log('il nome del tipoCorso manca');
         }
           
          
        });
    
    }); 
}
//30/01/2019
//ESAMI SOSTENUTI NEL 2018 PERTINENTI AL 2017 https://units.esse3.pp.cineca.it/e3rest/api/libretto-service-v1/libretti/286879/righe/?filter=esito.aaSupId%3D%3D2017
//getEsamiUltimoAnno(anno)
function getElencoEsamiUltimoAnno(matId,anno){ 
    return new Promise(function(resolve, reject) {
        var options = { 
            method: 'GET',
            url: strUrlGetSingoloEsame  + matId +'/righe/' + '?filter=esito.aaSupId%3D%3D' + anno,
            headers: 
                { 
                    'cache-control': 'no-cache',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic czI2MjUwMjpDR1ZZUDNURQ=='
                },
            json: true 
        }
        request(options, function (error, response, body) {
            console.log('url di getElencoEsamiUltimoAnno '+ options.url);
            if (error) {
                reject(error);
                console.log('errore in getElencoEsamiUltimoAnno '+ error);
            } else {
                if (response.statusCode==200){
                 
                    resolve(body); 
                }  else {

                    console.log('status code getElencoEsamiUltimoAnno = '+response.statusCode);
                    resolve(response.statusCode);
                }
            }
    
        });
    
    }); 
}
//getEsamiUltimoAnno
function getEsamiUltimoAnno(matId,anno){ //matID, adsceId, param con param=annoCorso
    return new Promise(function(resolve, reject) {
        getElencoEsamiUltimoAnno(matId, anno).then((body)=>{ 
            var rawData='';
            var libretto=[];
                    //controllo che body sia un array
            if (Array.isArray(body)){
                rawData=JSON.stringify(body);
                console.log('\n\nQUESTO IL BODY degli esami ultimo anno ' +rawData);
                //creo oggetto libretto
                for(var i=0; i<body.length; i++){

                    libretto[i]= new rigaLibretto(body[i].aaFreqId,body[i].adCod, 
                        body[i].adDes,body[i].adsceId, body[i].annoCorso, 
                        body[i].chiaveADContestualizzata,
                        body[i].dataFreq, body[i].dataScadIscr, body[i].dataChiusura, body[i].esito,
                        //aggiunti qua
                        body[i].freqObbligFlg, body[i].freqUffFlg, body[i].gruppoGiudCod,  body[i].gruppoGiudDes,
                        body[i].gruppoVotoId, body[i].gruppoVotoLodeFlg, body[i].gruppoVotoMaxVoto,
                        body[i].gruppoVotoMinVoto, body[i].itmId, body[i].matId, body[i].numAppelliPrenotabili,
                        body[i].numPrenotazioni, body[i].ord, body[i].peso, body[i].pianoId, body[i].ragId,body[i].raggEsaTipo,
                        body[i].ricId, body[i].sovranFlg,body[i].stato, body[i].statoDes, body[i].stuId,body[i].superataFlg,
                        body[i].tipoEsaCod, body[i].tipoEsaDes, body[i].tipoInsCod, body[i].tipoInsDes);
    
                }
                resolve(libretto);
            }else{
                console.log('in getEsamiUltimoAnno: non ho esami ');
                resolve(body.statusCode);

            }
          
        });
    
    }); 
}
//getMediaComplessiva
//https://units.esse3.pp.cineca.it/e3rest/api/libretto-service-v1/libretti/286879/medie/CDSORD/A
function getMediaLibrettoComplessiva(matId){ 
    return new Promise(function(resolve, reject) {
        var options = { 
            method: 'GET',
            url: strUrlGetSingoloEsame  + matId +'/medie/CDSORD/A',
            headers: 
                { 
                    'cache-control': 'no-cache',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic czI2MjUwMjpDR1ZZUDNURQ=='
                },
            json: true 
        }
        request(options, function (error, response, body) {
            console.log('url di getMediaLibrettoComplessiva '+ options.url);
            if (error) {
                reject(error);
                console.log('errore in getMediaLibrettoComplessiva '+ error);
            } else {
                if (response.statusCode==200){
                 
                    resolve(body); 
                }  
            }
    
        });
    
    }); 
}
//getMediaComplessiva
function getMediaComplessiva(matId){ 
    return new Promise(function(resolve, reject) {
        getMediaLibrettoComplessiva(matId).then((body)=>{ 
            var rawData='';
            var media='';
                    //controllo che body sia un array
            if (Array.isArray(body)){
                rawData=JSON.stringify(body);
                console.log('\n\nQUESTO IL BODY della media aritmetica ' +rawData);
                //creo oggetto libretto
                media=body[0].media;
                resolve(media);
            } else{
                console.log('manca la media');
                resolve(media);
            }
          
        });
    
    }); 
}
// FA IL LOGIN
function doLogin(){
    return new Promise(function(resolve, reject) {
    getEsseTreLogin().then((body)=>{
       var stud; //15/01/2019 non studente perchè è un riferimento al modulo 
        stud=new studente(body.user.codFis,body.user.firstName,body.user.lastName,body.user.grpDes,body.user.grpId,body.user.id, body.user.persId,body.user.userId,body.user.trattiCarriera);
        stud.log()
        resolve(stud);

    });
});
}

//CARRIERA 
function getCarriera(userid){
    return new Promise(function(resolve, reject) {
        var rawData='';
        var car;
        getCarrieraAnagraficaHome(userid).then((body)=>{
            car=new carriera(body[0].aaId, body[0].aaImm1, body[0].aaImmSu, body[0].aaOrdId, body[0].aaRegId,
                body[0].cdsCod, body[0].cdsDes, body[0].cdsId, body[0].dataChiusura,body[0].dataImm, body[0].dataImm1, body[0].dataImmSu,
                body[0].matId, body[0].matricola, body[0].motStastuCod, body[0].motStastuDes, body[0].ordCod, body[0].ordDes,body[0].pdsCod,
                body[0].pdsDes,body[0].pdsId, body[0].tipoCorsoCod,body[0].tipoCorsoDes, body[0].tipoTititCod, body[0].tipoTititDes);
           car.log();
            //per debug
            rawData=JSON.stringify(body);
            console.log('\n\nQUESTO IL BODY della carriera' +rawData);
            resolve(car);
        });
    });


}//FINE CARRIERA

//ottieni il libretto-> piano di studi
//modificata il 15/01/2019 tolto idMat
function getLibretto(){
    return new Promise(function(resolve, reject) {
    //array che contiene le righe del libretto
    var libretto=[];
    var rawData='';
    getEsseTreLibretto().then((body)=>{
            //controllo che body sia un array
            if (Array.isArray(body)){
                rawData=JSON.stringify(body);
                console.log('\n\nQUESTO IL BODY del libretto ' +rawData);
                //creo oggetto libretto
                for(var i=0; i<body.length; i++){

                    libretto[i]= new rigaLibretto(body[i].aaFreqId,body[i].adCod, 
                        body[i].adDes,body[i].adsceId, body[i].annoCorso, 
                        body[i].chiaveADContestualizzata,
                        body[i].dataFreq, body[i].dataScadIscr, body[i].dataChiusura, body[i].esito,
                        //aggiunti qua
                        body[i].freqObbligFlg, body[i].freqUffFlg, body[i].gruppoGiudCod,  body[i].gruppoGiudDes,
                        body[i].gruppoVotoId, body[i].gruppoVotoLodeFlg, body[i].gruppoVotoMaxVoto,
                        body[i].gruppoVotoMinVoto, body[i].itmId, body[i].matId, body[i].numAppelliPrenotabili,
                        body[i].numPrenotazioni, body[i].ord, body[i].peso, body[i].pianoId, body[i].ragId,body[i].raggEsaTipo,
                        body[i].ricId, body[i].sovranFlg,body[i].stato, body[i].statoDes, body[i].stuId,body[i].superataFlg,
                        body[i].tipoEsaCod, body[i].tipoEsaDes, body[i].tipoInsCod, body[i].tipoInsDes);
                     

                        libretto[i].log();

                }
                resolve(libretto);
            }
   });
});// fine getLibretto
}
//25/01/2019  286879/righe/?filter=numAppelliPrenotabili%3D%3D1'
function getAppelliPrenotabili(matId){
    return new Promise(function(resolve, reject) {
        var options = { 
            method: 'GET',
            url: strUrlGetSingoloEsame  + matId +'/righe/?filter=numAppelliPrenotabili%3D%3D1',
            headers: 
                { 
                    'cache-control': 'no-cache',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic czI2MjUwMjpDR1ZZUDNURQ=='
                },
            json: true 
        }
        request(options, function (error, response, body) {
            console.log('url di appelli prenotabili'+ options.url);
            if (error) {
                reject(error);
                console.log('errore in appelli prenotabili '+ error);
            } else {
                if (response.statusCode==200){
                 
                    resolve(body); 
                }  
            }
    
        });
    });

} //fine getAppelliPrenotabili
//function getPrenotazioni(matid)
function getPrenotazioni(matId){
    return new Promise(function(resolve, reject) {
    //array che contiene le righe del libretto
    var prenotazioni=[];
    var rawData='';
    getAppelliPrenotabili(matId).then((body)=>{
            //controllo che body sia un array
            if (Array.isArray(body)){
                rawData=JSON.stringify(body);
                //console.log('\n\nQUESTO IL BODY ESAMI PRENOTABILI ' +rawData);
                //creo oggetto libretto
                for(var i=0; i<body.length; i++){

                    prenotazioni[i]= new rigaLibretto(body[i].aaFreqId,body[i].adCod, 
                        body[i].adDes,body[i].adsceId, body[i].annoCorso, 
                        body[i].chiaveADContestualizzata,
                        body[i].dataFreq, body[i].dataScadIscr, body[i].dataChiusura, body[i].esito,
                        //aggiunti qua
                        body[i].freqObbligFlg, body[i].freqUffFlg, body[i].gruppoGiudCod,  body[i].gruppoGiudDes,
                        body[i].gruppoVotoId, body[i].gruppoVotoLodeFlg, body[i].gruppoVotoMaxVoto,
                        body[i].gruppoVotoMinVoto, body[i].itmId, body[i].matId, body[i].numAppelliPrenotabili,
                        body[i].numPrenotazioni, body[i].ord, body[i].peso, body[i].pianoId, body[i].ragId,body[i].raggEsaTipo,
                        body[i].ricId, body[i].sovranFlg,body[i].stato, body[i].statoDes, body[i].stuId,body[i].superataFlg,
                        body[i].tipoEsaCod, body[i].tipoEsaDes, body[i].tipoInsCod, body[i].tipoInsDes);

                        prenotazioni[i].log();

                }
                resolve(prenotazioni);
            }
   });
});
} 

// recupero la lista delle prenotazioni (appelli prenotati) -> LEGGO DAL LIBRETTO PER NUM_PRENOTAZIONI=1
function getAppelliPrenotati(matId){
    return new Promise(function(resolve, reject) {
        var options = { 
            method: 'GET',
            url: strUrlGetSingoloEsame  + matId +'/righe/?filter=numPrenotazioni%3D%3D1',
            headers: 
                { 
                    'cache-control': 'no-cache',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic czI2MjUwMjpDR1ZZUDNURQ=='
                },
            json: true 
        }
        request(options, function (error, response, body) {
            console.log('url di appelli prenotati'+ options.url);
            if (error) {
                reject(error);
                console.log('errore in appelli prenotati '+ error);
            } else {
                if (response.statusCode==200){
                 
                    resolve(body); 
                }  
            }
    
        });
    });

} //fine getAppelliPrenotaTI
function getPrenotati(matId){
    return new Promise(function(resolve, reject) {
    //array che contiene le righe del libretto
    var prenotazioni=[];
    var rawData='';
    getAppelliPrenotati(matId).then((body)=>{
            //controllo che body sia un array
            if (Array.isArray(body)){
                rawData=JSON.stringify(body);
                console.log('\n\nQUESTO IL BODY APPELLI PRENOTATI ' +rawData);
                //creo oggetto libretto
                for(var i=0; i<body.length; i++){

                    prenotazioni[i]= new rigaLibretto(body[i].aaFreqId,body[i].adCod, 
                        body[i].adDes,body[i].adsceId, body[i].annoCorso, 
                        body[i].chiaveADContestualizzata,
                        body[i].dataFreq, body[i].dataScadIscr, body[i].dataChiusura, body[i].esito,
                        body[i].freqObbligFlg, body[i].freqUffFlg, body[i].gruppoGiudCod,  body[i].gruppoGiudDes,
                        body[i].gruppoVotoId, body[i].gruppoVotoLodeFlg, body[i].gruppoVotoMaxVoto,
                        body[i].gruppoVotoMinVoto, body[i].itmId, body[i].matId, body[i].numAppelliPrenotabili,
                        body[i].numPrenotazioni, body[i].ord, body[i].peso, body[i].pianoId, body[i].ragId,body[i].raggEsaTipo,
                        body[i].ricId, body[i].sovranFlg,body[i].stato, body[i].statoDes, body[i].stuId,body[i].superataFlg,
                        body[i].tipoEsaCod, body[i].tipoEsaDes, body[i].tipoInsCod, body[i].tipoInsDes);

                        prenotazioni[i].log();

                }
                resolve(prenotazioni);
            }
   });
});
} 
//prenotazione: ottengo l'appello da prenotare 10094/117740/?stato=P'
//25/01/2019  
function getSingoloAppelloDaPrenotare(cdsId,adId){
    return new Promise(function(resolve, reject) {
        var options = { 
            method: 'GET',
            url: strUrlGetAppelloDaPrenotare  + cdsId +'/' + adId +  '/?stato=P', //', 
            headers: 
                { 
                    'cache-control': 'no-cache',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic czI2MjUwMjpDR1ZZUDNURQ=='
                },
            json: true 
        }
        request(options, function (error, response, body) {
            console.log('url di getSingoloAppelloDaPrenotare '+ options.url);
            if (error) {
                reject(error);
                console.log('errore in getSingoloAppelloDaPrenotare '+ error);
            } else {
                if (response.statusCode==200){
                 
                    resolve(body); 
                }  
            }
    
        });
    });

} 
//PRENOTAZIONE: FASE 1) DOPO AVER PRENOTATO UN APPELLO, PER AVERE TUTTI I DETTAGLI DEVO LEGGERE PRENOTAZIONI/MATID PER AVERE APPID
//09/05/2019
//per recuperare appId, url https://units.esse3.pp.cineca.it/e3rest/api/calesa-service-v1/prenotazioni/291783/
function getAppId(matId){
return new Promise(function(resolve, reject) {
    var options = { 
        method: 'GET',
        url: prenotazioniMatIdAppId  + matId +  '/',
        headers: 
            { 
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
                'Authorization': 'Basic czI2MjUwMjpDR1ZZUDNURQ=='
            },
        json: true 
    }
    request(options, function (error, response, body) {
        console.log('url di getAppId '+ options.url);
        if (error) {
            reject(error);
            console.log('errore in getAppId '+ error);
        } else {
            if (response.statusCode==200){
               // console.log('body di getAppId = '+body); //nel body ho appId cdsId adID
                resolve(body); 
            }  
        }

    });
});
}
//2)*************** 10/05/2019 ora che ho appId cdsId adID, query su appelli/cdsId/adId/appId https://units.esse3.pp.cineca.it/e3rest/api/calesa-service-v1/appelli/10094/111218/215
function getDettaglioSingoloAppelloPrenotato(cdsId,adId,appId){
    return new Promise(function(resolve, reject) {
        var options = { 
            method: 'GET',
            /************* TEST DEL 14/05/2019  IMPOSTO I CAMPI SINGOLI PER OTTIMIZZARE LA QUERY OCIO ALL'ORDINE DEI CAMPI
             * SEGUI ORDINE DEL COSTRUTTORE DELLA CLASSE APPELLO !!!!!!!
             */
            url: strUrlGetAppelloDaPrenotare  + cdsId +  '/' +adId+'/'+appId +'?fields=aaCalId%2CadCod%2CdesApp%2CpresidenteCognome%2CpresidenteNome%2Cturni.dataOraEsa',
            headers: 
                { 
                    'cache-control': 'no-cache',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic czI2MjUwMjpDR1ZZUDNURQ=='
                },
            json: true 
        }
        request(options, function (error, response, body) {
            console.log('url di getDettaglioSingoloAppelloPrenotato '+ options.url);
            if (error) {
                reject(error);
                console.log('errore in getDettaglioSingoloAppelloPrenotato '+ error);
            } else {
                if (response.statusCode==200){
                   // console.log('il dettaglio di appello prenotato = '+JSON.stringify(body));
                    resolve(body); 
                }  
            }
    
        });
    });
    }
    //09/05/2019 HO IL DETTAGLIO COMPLETO DELLA SCHERMATA DELL'APPELLO PRENOTATO
    //3) funzione che raccoglie 1) e 2) 
    function getSingoloAppelloPrenotato(matId){
        return new Promise(function(resolve, reject) {
        var appelliPrenotati=[];
        var rawData='';
        var idAdId=[]; //tengo traccia degli adId attività didattica
        var idAppId=[]; //tengo traccia degli appId 
        var idCdsId='';
        getAppId(matId).then((body)=>{
            //controllo che body sia un array
            if (Array.isArray(body)){
                rawData=JSON.stringify(body);
               // console.log('\n\nQUESTO IL BODY DI PRENOTAZIONI ' +rawData);
                //creo oggetto libretto
                for(var i=0; i<body.length; i++){
                    idAdId[i]=body[i].adId;
                    idAppId[i]=body[i].appId;
                    idCdsId=body[i].cdsId;
                    /*console.log('*********** idAdId ' +idAdId[i] );
                    console.log('************ idAppId ' +idAppId[i] );
                    console.log('************ cdsId ' +idCdsId );*/
                } 
            }
           
            //resolve(body); //commentato TEMPORANEAMENTE 
           
        }).then((body)=>{
            console.log('SONO NELLA PARTE 2 con idAd =' + idAdId[0] + ', appId='  +idAppId[0] +', cdsId=' +idCdsId);
            getDettaglioSingoloAppelloPrenotato(idCdsId, idAdId[0],idAppId[0]).then((body)=>{
                console.log('HO IL DETTAGLIO DI APPELLO con data inizio= ' + body.dataInizioApp);
               if (Array.isArray(body)){
                  //  console.log('body del dettaglio è un array'); 
                    for(var i=0; i<body.length; i++){
                        appelliPrenotati[i]= new appello(body[i].aaCalId,body[i].adCod, body[i].adDes, body[i].adId,body[i].appId, body[i].cdsCod,
                            body[i].cdsDes,body[i].cdsId,body[i].condId,body[i].dataFineIscr,body[i].dataInizioApp, body[i].dataInizioIscr, body[i].desApp,
                             //aggiunto qui
                             body[i].note,body[i].numIscritti,body[i].numPubblicazioni,body[i].numVerbaliCar,body[i].numVerbaliGen,
                             body[i].presidenteCognome,body[i].presidenteId,body[i].presidenteNome,body[i].riservatoFlg,body[i].stato,body[i].statoAperturaApp,body[i].statoDes,body[i].statoInsEsiti,body[i].statoLog,body[i].statoPubblEsiti,body[i].statoVerb,
                             body[i].tipoDefAppCod,body[i].tipoDefAppDes,body[i].tipoEsaCod,body[i].tipoSceltaTurno, body[i].turni);
                        
                    } 
                }else{
                  //  console.log('body del dettaglio è di tipo ' +typeof body); //object quindi una riga sola
                    appelliPrenotati[0]=new appello(body.aaCalId,body.adCod, body.adDes, body.adId,body.appId, body.cdsCod,
                        body.cdsDes,body.cdsId,body.condId,body.dataFineIscr,body.dataInizioApp, body.dataInizioIscr, body.desApp,
                        //aggiunto qui
                        body.note,body.numIscritti,body.numPubblicazioni,body.numVerbaliCar,body.numVerbaliGen,
                        body.presidenteCognome,body.presidenteId,body.presidenteNome,body.riservatoFlg,body.stato,body.statoAperturaApp,body.statoDes,body.statoInsEsiti,body.statoLog,body.statoPubblEsiti,body.statoVerb,
                        body.tipoDefAppCod,body.tipoDefAppDes,body.tipoEsaCod,body.tipoSceltaTurno,body.turni);
                        console.log('TEST di appelliPrenotati[0] TURNI '+ body.turni[0].dataOraEsa);
                }
                //resolve(body);
                resolve(appelliPrenotati);
                
            }); //fine  controller.getDettaglioSingoloAppelloPrenotato
            
       
        });
    });
    }
//******************** */10/05/2019 nuova versione di getSingoloAppelloPrenotatoNuovo
function getSingoloAppelloPrenotatoNuovo(matId){
    return new Promise(function(resolve, reject) {
    var appelliPrenotati=[];
    var rawData='';
    var idAdId=[]; //tengo traccia degli adId attività didattica
    var idAppId=[]; //tengo traccia degli appId 
    var idCdsId='';
    getAppId(matId).then((body)=>{
        //controllo che body sia un array
        if (Array.isArray(body)){
            rawData=JSON.stringify(body);
           // console.log('\n\nQUESTO IL BODY DI PRENOTAZIONI ' +rawData);
            //creo oggetto libretto
            for(var i=0; i<body.length; i++){
                idAdId[i]=body[i].adId;
                idAppId[i]=body[i].appId;
                idCdsId=body[i].cdsId;
               //faccio qui la chiamata al dettaglio
                 getDettaglioSingoloAppelloPrenotato(idCdsId, idAdId[i],idAppId[i]).then((body)=>{
                console.log('ClsController->getSingoloAppelloPrenotatoNuovo :HO IL DETTAGLIO DI APPELLO con data inizio= ' + body.dataInizioApp);
                    /*if (Array.isArray(body)){
                          console.log('body del dettaglio è un array'); 
                            for(var i=0; i<body.length; i++){
                                appelliPrenotati[i]= new appello(body[i].aaCalId,body[i].adCod, body[i].adDes, body[i].adId,body[i].appId, body[i].cdsCod,
                                    body[i].cdsDes,body[i].cdsId,body[i].condId,body[i].dataFineIscr,body[i].dataInizioApp, body[i].dataInizioIscr, body[i].desApp,
                                    //aggiunto qui
                                    body[i].note,body[i].numIscritti,body[i].numPubblicazioni,body[i].numVerbaliCar,body[i].numVerbaliGen,
                                    body[i].presidenteCognome,body[i].presidenteId,body[i].presidenteNome,body[i].riservatoFlg,body[i].stato,body[i].statoAperturaApp,body[i].statoDes,body[i].statoInsEsiti,body[i].statoLog,body[i].statoPubblEsiti,body[i].statoVerb,
                                    body[i].tipoDefAppCod,body[i].tipoDefAppDes,body[i].tipoEsaCod,body[i].tipoSceltaTurno,body[i].turni);
                                
                            } 
                        }else{*/
                           console.log('body del dettaglio è di tipo ' +typeof body +' valore di i '+i); //object quindi una riga sola
                           /* ORIGINALE MODIFICA DEL 14/05/2019
                                appelliPrenotati[0]=new appello(body.aaCalId,body.adCod, body.adDes, body.adId,body.appId, body.cdsCod,
                                body.cdsDes,body.cdsId,body.condId,body.dataFineIscr,body.dataInizioApp, body.dataInizioIscr, body.desApp,
                                //aggiunto qui
                                body.note,body.numIscritti,body.numPubblicazioni,body.numVerbaliCar,body.numVerbaliGen,
                                body.presidenteCognome,body.presidenteId,body.presidenteNome,body.riservatoFlg,body.stato,body.statoAperturaApp,body.statoDes,body.statoInsEsiti,body.statoLog,body.statoPubblEsiti,body.statoVerb,
                                body.tipoDefAppCod,body.tipoDefAppDes,body.tipoEsaCod,body.tipoSceltaTurno, body.turni);*/
                            // console.log('TEST di appelliPrenotati[0] anno '+ appelliPrenotati[0].aaCalId);
                            appelliPrenotati[1]=new appello(body.aaCalId,body.adCod,null, null,null, null,
                                null,null,null,null,null, null, body.desApp,
                                null,null,null,null,null,
                                body.presidenteCognome,null,body.presidenteNome,null,null,null,null,null,null, null,null,
                                null,null,null,null, body.turni);
                      //  }
            //resolve(body);
           
            
        });
          
            } // fine for 
            resolve(appelliPrenotati);
        }
       
    })
});
}
// getAppelloDaPrenotare(cdsId,adId)
function getAppelloDaPrenotare(cdsId,adId){
    return new Promise(function(resolve, reject) {
        var appelliDaPrenotare=[];
        var rawData='';

        getSingoloAppelloDaPrenotare(cdsId,adId).then((body)=>{
            //controllo che body sia un array
            if (Array.isArray(body)){
                rawData=JSON.stringify(body);
              //  console.log('\n\nQUESTO IL BODY ESAMI PRENOTABILI ' +rawData);
                //creo oggetto libretto
                for(var i=0; i<body.length; i++){

                    appelliDaPrenotare[i]= new appello(body[i].aaCalId,body[i].adCod, body[i].adDes, body[i].adId,body[i].appId, body[i].cdsCod,
                        body[i].cdsDes,body[i].cdsId,body[i].condId,body[i].dataFineIscr,body[i].dataInizioApp, body[i].dataInizioIscr, body[i].desApp);

                        appelliDaPrenotare[i].log();

                }
                resolve(appelliDaPrenotare);
            }
   });
 });

} 
//26/01/2019 POST DI UN APPELLO TORNA BODY VUOTO QUINDI VERIFICA MSG DI RITORNO 201
//'https://units.esse3.pp.cineca.it/e3rest/api/calesa-service-v1/appelli/10094/117740/5/iscritti'
//attenzione: nel body devo inviare adsceId 5057981 che è la riga dell'appello da web
function postSingoloAppelloDaPrenotare(cdsId,adId,appId,adsceId){ //csdId= 10094 adId=117740 appId=5  adsceId= 5057981
    return new Promise(function(resolve, reject) {
        var options = { 
            method: 'POST',
            url: strUrlPostAppello  + cdsId +'/' + adId +'/'+ appId +'/iscritti',
            headers: 
                { 
                    'cache-control': 'no-cache',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic czI2MjUwMjpDR1ZZUDNURQ=='
                },
                body:{
                    "adsceId": adsceId
                   
                  },
            json: true 
        }
        request.post(options, function (error, response, body) {
            console.log('url di postSingoloAppelloDaPrenotare'+ options.url);
            var res=false;
            if (error) {
                reject(error);
                console.log('errore in postSingoloAppelloDaPrenotare '+ error);
            } else {
                if (response.statusCode==201){
                 
                    console.log('************ 201 OK');
                    res= true;
                    
                }  else{
                    console.log('************ NOK IN POST PRENOTAZIONE APPELLO');
                    res= false;

                }
                resolve(res);
            }
    
        });
   
    });
} 

// var strUrlDeleteAppello='https://units.esse3.pp.cineca.it/e3rest/api/calesa-service-v1/appelli/'; //10094/117740/5/iscritti/236437;'
function deleteSingoloAppelloDaPrenotare(cdsId,adId,appId,studId){ //csdId= 10094 adId=117740 appId=5  studId= 236437
    return new Promise(function(resolve, reject) {
        var options = { 
            method: 'DELETE',
            url: strUrlDeleteAppello  + cdsId +'/' + adId +'/'+ appId +'/iscritti/'+ studId,
            headers: 
                { 
                    'cache-control': 'no-cache',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic czI2MjUwMjpDR1ZZUDNURQ=='
                },
               
            json: true 
        }
        request(options, function (error, response, body) {
            console.log('url di deleteSingoloAppelloDaPrenotare'+ options.url);
            var res=false;
            if (error) {
                reject(error);
                console.log('errore in deleteSingoloAppelloDaPrenotare '+ error);
            } else {
                if (response.statusCode==200){
                 
                    console.log('************ DELETE 200 OK');
                    res= true;
                    
                }  else{
                    console.log('************ NOK IN DELETE APPELLO');
                    res= false;

                }
                resolve(res);
            }
    
        });
   
    });
   
} 
function testCC(){
    return new Promise(function(resolve, reject) {
    var t='sono in testCC';
    console.log('sono in testCC');
    resolve(t);

});
}
exports.doLogin= doLogin;
exports.doLogout = doLogout;
exports.getCarrieraAnagraficaHome=getCarrieraAnagraficaHome;
exports.getLibretto=getLibretto;
exports.getCarriera=getCarriera;
exports.getEsame=getEsame;
exports.getPrenotazioni=getPrenotazioni;
exports.getAppelloDaPrenotare=getAppelloDaPrenotare;
exports.postSingoloAppelloDaPrenotare=postSingoloAppelloDaPrenotare;
exports.deleteSingoloAppelloDaPrenotare=deleteSingoloAppelloDaPrenotare;
exports.getPrenotati=getPrenotati;
exports.GetDettaglioEsame=GetDettaglioEsame;
exports.GetDocente=GetDocente;
exports.getSegmento=getSegmento;
exports.getEsamiUltimoAnno=getEsamiUltimoAnno;
exports.getMediaComplessiva=getMediaComplessiva;
exports.getAppId=getAppId;
exports.getSingoloAppelloPrenotato=getSingoloAppelloPrenotato;
exports.getDettaglioSingoloAppelloPrenotato=getDettaglioSingoloAppelloPrenotato;
exports.getSingoloAppelloPrenotatoNuovo=getSingoloAppelloPrenotatoNuovo;
exports.testCC=testCC;