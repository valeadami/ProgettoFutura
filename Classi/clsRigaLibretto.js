function RigaLibretto(aaFreqId, adCod,adDes,adsceId,annoCorso,chiaveADContestualizzata,dataFreq,dataScadIscr,dataChiusura,
    esito,freqObbligFlg,freqUffFlg,gruppoGiudCod,gruppoGiudDes,gruppoVotoId,gruppoVotoLodeFlg,gruppoVotoMaxVoto,gruppoVotoMinVoto,itmId,
    matId,numAppelliPrenotabili,numPrenotazioni,ord,peso,pianoId,ragId,raggEsaTipo,ricId,sovranFlg,stato,statoDes,stuId,superataFlg,tipoEsaCod,tipoEsaDes,tipoInsCod,tipoInsDes){
//intero
    this.aaFreqId=aaFreqId; // anno di frequenza, valorizzato nel caso lo stato dell''attività sia F oppure S,
    //stringhe
    this.adCod=adCod; //004GI codice dell''attività didattica presente nel libretto. Il codice è copiato in ogni singolo libretto e, di norma, coincide con il codice previsto nell''offerta didattica alla quale l''attivit� didattica si riferisce  
    this.adDes=adDes; //DIRITTO COSTITUZIONALE  descrizione dell''attivit� didattica presente nel libretto, come il codice, la descrizione risulta copiata dall''offerta didattica, ma pu� essere modificato  
    //intero
    this.adsceId=adsceId; //  id univoco che consente di individuare una riga di libretto dello studente ,
    this.annoCorso=annoCorso; //anno di corso al quale � prevista l''attivit� didattica , ,
    //oggetto chiaveADContestualizzata
    this.chiaveADContestualizzata=chiaveADContestualizzata; //codice del corso di studio di iscrizione dello studente ,
   //stringhe
    this.dataFreq=dataFreq; //ata di acquisizione della frequenza, se valorizzata indica la data di riferimento dalla quale la frequenza risulta acquisita, il formato con cui deve essere definita la data � DD/MM/YYYY ,
    this.dataScadIscr=dataScadIscr; //data di scadenza dell'iscirzione, l''attivit� non pu� essere sostenuta dopo questa data, il formato con cui deve essere definita la data è DD/MM/YYYY ,
    //stringa (stringa vuota)
    this.dataChiusura=dataChiusura; //data chiusura della carriera
    //oggetto ESITO
    this.esito=esito; //data ingresso/immatricolazione in ateneo 
    //interi
    this.freqObbligFlg=freqObbligFlg; //flag frequenza obbligatoria,
    this.freqUffFlg=freqUffFlg; // flag  frequenza assegnata di ufficio  ,
    //stringhe
    this.gruppoGiudCod=gruppoGiudCod; // codice del gruppo di giudizi a cui appartiene il giudizio presente nell''esito ,
    this.gruppoGiudDes=gruppoGiudDes; //descrizione del gruppo di giudizi a cui appartiene il giudizio selezionato ,
    //integer
    this.gruppoVotoId=gruppoVotoId; //id della tipologia di voto utilizzata, indica quale range di voti � definito sull''attivit� didattica, il voto minimo positivo, il voto massimo e l''eventuale presenza della lode,
    this.gruppoVotoLodeFlg=gruppoVotoLodeFlg; //indica se la scala di voti selezionata prevede la lode
    this.gruppoVotoMaxVoto=gruppoVotoMaxVoto; //indica il massimo voto positivo per la scala di voti selezionata  ,
    this.gruppoVotoMinVoto=gruppoVotoMinVoto; //: indica il minimo voto positivo per la scala di voti selezionata 
    //chiave integer 
    this.itmId=itmId; //  id progressivo dell''attivit� del piano collegata con la riga di libretto ,,
    this.matId=matId; // id matricola
    //intero PRENOTAZIONE APPELLI
    this.numAppelliPrenotabili=numAppelliPrenotabili; // contiene il numero di appelli prenotabili alla data di sistema per la riga di libretto ,
    this.numPrenotazioni=numPrenotazioni; //contiene il numero di prenotazioni pendenti collegate alla riga di libretto
    //integer
    this.ord=ord; //progressivo di ordinamento delle attivit�, calcolato tenendo conto dei raggruppamenti e degli ordinamenti previsti a sistema ,
    //number
    this.peso=peso;// peso dell'attività didattica, calcolato come somma dei pesi dei segmenti, il peso prevede due decimali opzionali , 
    //integer
    this.pianoId=pianoId; // id progressivo del piano di studio collegato tramite attuazione al libretto
    this.ragId=ragId; // se l''attivit� appartiene ad un raggruppamento contiene l''adsceID del padre del raggruppamento ,
    //stringhe
    this.raggEsaTipo=raggEsaTipo; //ontiene la tipologia del tipo di raggruppamento, valorizzato solo sul padre del raggruppamento (cio� quando ragId=adsceId) = ['ESA', 'FREQ']
    this.ricId=ricId; //Presenza di un riconoscimento o convalida. 
    this.sovranFlg=sovranFlg; //attivit� sovrannumeraria
    //stringa
    this.stato=stato; // Stato dell\'attivit� didattica (codice) = ['P', 'F', 'S'],
    this.statoDes=statoDes; //descrizione dello stato dell\'attivit� didattica 
    //interi
    this.stuId=stuId; //studente id
    this.superataFlg=superataFlg; //attività superata, comprende anche il caso di prove verbalizzate ma non caricate in carriera per errori durante la procedura carica_prove ,
    //stringhe
    this.tipoEsaCod=tipoEsaCod; //codice del tipo di esame previsto per l''attivit� didattica ,
    this.tipoEsaDes=tipoEsaDes; //descrizione del tipo di esame previsto per l''attivit� didattica 
    this.tipoInsCod=tipoInsCod; //codice tipo di insegnamento previsto per l''attivit� didattica 
    this.tipoInsDes=tipoInsDes;//descrizione tipo di insegnamento previsto per l''attivit� didattica ,
   
    
    
    this.getchiaveADContestualizzata=function() {


        var str='';
        if (this.chiaveADContestualizzata.length >0 ){
            console.log('********* chiaveAdContestualizzata ');
           for(var i=0; i<this.chiaveADContestualizzata.length; i++){

            str+='AnnoOffertaId ' + chiaveADContestualizzata[i].aaOffId + ', codice ordinamento '
            +  this.chiaveADContestualizzata[i].aaOrdCod + ', descr ordinamento '+  this.chiaveADContestualizzata[i].aaOrdDes +
             ', aaOrdId '+ this.chiaveADContestualizzata[i].aaOrdId + ', codice attività didattica '+ this.chiaveADContestualizzata[i].adCod + ' descr att did ' 
             +  this.chiaveADContestualizzata[i].adDes + ', chiave attività didattica '+ this.chiaveADContestualizzata[i].adId + ', cdsCod ' +this.chiaveADContestualizzata[i].cdsCod
             + ', cdsDes ' + this.chiaveADContestualizzata[i].cdsDes + ', csdId '+this.chiaveADContestualizzata[i].cdsId + 'pdsCod '+ this.chiaveADContestualizzata[i].pdsCod + ',pdsDes '+
             this.chiaveADContestualizzata[i].pdsDes + ', pdsId '+ this.chiaveADContestualizzata[i].pdsId;

           }

        } else{
           str= 'manca la chiaveContestualizzata';
        }
        return str;

    
    };
    this.getEsito=function (){
        var str='';
        if (typeof this.esito!=='undefined' ){
            console.log('********* oggetto esito della riga libretto ');
          // for(var i=0; i<this.chiaveADContestualizzata.length; i++){

            str+='aaSupId ' + this.esito.aaSupId + ', dataEsame ' +  this.esito.dataEsa + ', lodeFlg '+  this.esito.lodeFlg +
             ', modValCod '+ this.esito.modValCod.value + ', voto '+ this.esito.voto;

          // }

        } else{
           str= 'manca esito';
        }
        return str;




    };
    this.log = function() {
        if (process.env.DEBUG_MODE){
            console.log('sono in debug mode');


            console.log('CREATO OGGETTO RIGA LIBRETTO: anno frequenza=' +this.aaFreqId+ ', adCod ' + this.adCod + ', adDes  ' + this.adDes + ', adId' + this.adId + ', id matricola ' + this.matId + ', matricola '+ this.matricola + ',  adsceId '+ this.adsceId + 'esito '+ this.getEsito());
        } else {

            console.log('creato oggetto riga libretto');
        }
       
    };
}
module.exports = RigaLibretto;


/*
29/12/2018 ATTIVITA' DIDATTICA
****************************

classe ESAME -> RAPPRESENTA UNA RIGA DEL LIBRETTO passo id matricola

https://units.esse3.pp.cineca.it/e3rest/api/libretto-service-v1/libretti/286879/righe/
****************************
[
  {
    "aaFreqId": 2017,
    "adCod": "004GI",
    "adDes": "DIRITTO COSTITUZIONALE",
    "adsceId": 5057980, //ID DELLA RIGA DEL LIBRETTO
    "annoCorso": 1,
    "chiaveADContestualizzata": {
      "aaOffId": 2017,
      "aaOrdCod": "GI01-17",
      "aaOrdDes": "GIURISPRUDENZA",
      "aaOrdId": 2017,
      "adCod": "004GI",
      "adDes": "DIRITTO COSTITUZIONALE",
      "adId": 111210,
      "afId": 236857,
      "cdsCod": "GI01",
      "cdsDes": "GIURISPRUDENZA",
      "cdsId": 10094,
      "pdsCod": "PDS0-2017",
      "pdsDes": "comune",
      "pdsId": 9999
    },
    "dataFreq": "",
    "dataScadIscr": "",
    "esito": {
      "aaSupId": 2017,
      "dataEsa": "15/06/2018 00:00:00",
      "lodeFlg": 0,
      "modValCod": {
        "value": "V"
      },
      "supEsaFlg": null,
      "tipoGiudCod": "",
      "tipoGiudDes": "",
      "voto": 30
    },
    "freqObbligFlg": null,
    "freqUffFlg": 1,
    "gruppoGiudCod": "",
    "gruppoGiudDes": "",
    "gruppoVotoId": 1,
    "gruppoVotoLodeFlg": 1,
    "gruppoVotoMaxVoto": 30,
    "gruppoVotoMinVoto": 18,
    "itmId": 3,
    "matId": 286879,
    "note": "",
    "numAppelliPrenotabili": 0,
    "numPrenotazioni": 0,
    "ord": 1,
    "peso": 12, //cfu
    "pianoId": 1,
    "ragId": null,
    "raggEsaTipo": null,
    "ricId": 0,
    "sovranFlg": 0,
    "stato": {
      "value": "S"
    },
    "statoDes": "Superata",
    "stuId": 236437,
    "superataFlg": null,
    "tipoEsaCod": "O",
    "tipoEsaDes": "Orale",
    "tipoInsCod": "OBB",
    "tipoInsDes": "Obbligatoria"
  },

---------------------------------

  {
    "aaFreqId": 2017,
    "adCod": "079GI",
    "adDes": "ECONOMIA AZIENDALE",
    "adsceId": 5057985, 
    "annoCorso": 1,
    "chiaveADContestualizzata": {
      "aaOffId": 2017,
      "aaOrdCod": "GI01-17",
      "aaOrdDes": "GIURISPRUDENZA",
      "aaOrdId": 2017,
      "adCod": "079GI",
      "adDes": "ECONOMIA AZIENDALE",
      "adId": 117741,
      "afId": 236852,
      "cdsCod": "GI01",
      "cdsDes": "GIURISPRUDENZA",
      "cdsId": 10094,
      "pdsCod": "PDS0-2017",
      "pdsDes": "comune",
      "pdsId": 9999
    },
    "dataFreq": "",
    "dataScadIscr": "",
    "esito": {
      "aaSupId": null,
      "dataEsa": "",
      "lodeFlg": 0,
      "modValCod": {
        "value": "V"
      },
      "supEsaFlg": null,
      "tipoGiudCod": "",
      "tipoGiudDes": "",
      "voto": null
    },
    "freqObbligFlg": null,
    "freqUffFlg": 1,
    "gruppoGiudCod": "",
    "gruppoGiudDes": "",
    "gruppoVotoId": 1,
    "gruppoVotoLodeFlg": 1,
    "gruppoVotoMaxVoto": 30,
    "gruppoVotoMinVoto": 18,
    "itmId": 5,
    "matId": 286879,
    "note": "",
    "numAppelliPrenotabili": 0,
    "numPrenotazioni": 0,
    "ord": 2,
    "peso": 9,
    "pianoId": 1,
    "ragId": null,
    "raggEsaTipo": null,
    "ricId": 0,
    "sovranFlg": 0,
    "stato": {
      "value": "F"
    },
    "statoDes": "Frequentata",
    "stuId": 236437,
    "superataFlg": null,
    "tipoEsaCod": "O",
    "tipoEsaDes": "Orale",
    "tipoInsCod": "OBB",
    "tipoInsDes": "Obbligatoria"
  },
  {
    "aaFreqId": 2017,
    "adCod": "015GI",
    "adDes": "FILOSOFIA DEL DIRITTO",
    "adsceId": 5057979,
    "annoCorso": 1,
    "chiaveADContestualizzata": {
      "aaOffId": 2017,
      "aaOrdCod": "GI01-17",
      "aaOrdDes": "GIURISPRUDENZA",
      "aaOrdId": 2017,
      "adCod": "015GI",
      "adDes": "FILOSOFIA DEL DIRITTO",
      "adId": 111211,
      "afId": 236856,
      "cdsCod": "GI01",
      "cdsDes": "GIURISPRUDENZA",
      "cdsId": 10094,
      "pdsCod": "PDS0-2017",
      "pdsDes": "comune",
      "pdsId": 9999
    },
    "dataFreq": "",
    "dataScadIscr": "",
    "esito": {
      "aaSupId": null,
      "dataEsa": "",
      "lodeFlg": 0,
      "modValCod": {
        "value": "V"
      },
      "supEsaFlg": null,
      "tipoGiudCod": "",
      "tipoGiudDes": "",
      "voto": null
    },
    "freqObbligFlg": null,
    "freqUffFlg": 1,
    "gruppoGiudCod": "",
    "gruppoGiudDes": "",
    "gruppoVotoId": 1,
    "gruppoVotoLodeFlg": 1,
    "gruppoVotoMaxVoto": 30,
    "gruppoVotoMinVoto": 18,
    "itmId": 2,
    "matId": 286879,
    "note": "",
    "numAppelliPrenotabili": 0,
    "numPrenotazioni": 0,
    "ord": 3,
    "peso": 9,
    "pianoId": 1,
    "ragId": null,
    "raggEsaTipo": null,
    "ricId": 0,
    "sovranFlg": 0,
    "stato": {
      "value": "F"
    },
    "statoDes": "Frequentata",
    "stuId": 236437,
    "superataFlg": null,
    "tipoEsaCod": "O",
    "tipoEsaDes": "Orale",
    "tipoInsCod": "OBB",
    "tipoInsDes": "Obbligatoria"
  },
  {
    "aaFreqId": 2017,
    "adCod": "017GI",
    "adDes": "INFORMATICA DI BASE",
    "adsceId": 5058007,
    "annoCorso": 1,
    "chiaveADContestualizzata": {
      "aaOffId": 2017,
      "aaOrdCod": "GI01-06",
      "aaOrdDes": "GIURISPRUDENZA",
      "aaOrdId": 2006,
      "adCod": "017GI",
      "adDes": "INFORMATICA DI BASE",
      "adId": 111217,
      "afId": 211788,
      "cdsCod": "GI01",
      "cdsDes": "GIURISPRUDENZA",
      "cdsId": 10094,
      "pdsCod": "PDS0-2006",
      "pdsDes": "comune",
      "pdsId": 9999
    },
    "dataFreq": "",
    "dataScadIscr": "",
    "esito": {
      "aaSupId": null,
      "dataEsa": "",
      "lodeFlg": 0,
      "modValCod": {
        "value": "G"
      },
      "supEsaFlg": null,
      "tipoGiudCod": "",
      "tipoGiudDes": "",
      "voto": null
    },
    "freqObbligFlg": null,
    "freqUffFlg": 1,
    "gruppoGiudCod": "2",
    "gruppoGiudDes": "superato/non superato",
    "gruppoVotoId": 1,
    "gruppoVotoLodeFlg": 1,
    "gruppoVotoMaxVoto": 30,
    "gruppoVotoMinVoto": 18,
    "itmId": null,
    "matId": 286879,
    "note": "",
    "numAppelliPrenotabili": 1,
    "numPrenotazioni": 0,
    "ord": 4,
    "peso": 3,
    "pianoId": null,
    "ragId": null,
    "raggEsaTipo": null,
    "ricId": 0,
    "sovranFlg": 0,
    "stato": {
      "value": "F"
    },
    "statoDes": "Frequentata",
    "stuId": 236437,
    "superataFlg": null,
    "tipoEsaCod": "S",
    "tipoEsaDes": "Scritto",
    "tipoInsCod": "OBB",
    "tipoInsDes": "Obbligatoria"
  },
  {
    "aaFreqId": 2017,
    "adCod": "018GI",
    "adDes": "ISTITUZIONI DI DIRITTO PRIVATO I",
    "adsceId": 5057983,
    "annoCorso": 1,
    "chiaveADContestualizzata": {
      "aaOffId": 2017,
      "aaOrdCod": "GI01-17",
      "aaOrdDes": "GIURISPRUDENZA",
      "aaOrdId": 2017,
      "adCod": "018GI",
      "adDes": "ISTITUZIONI DI DIRITTO PRIVATO I",
      "adId": 111218,
      "afId": 236855,
      "cdsCod": "GI01",
      "cdsDes": "GIURISPRUDENZA",
      "cdsId": 10094,
      "pdsCod": "PDS0-2017",
      "pdsDes": "comune",
      "pdsId": 9999
    },
    "dataFreq": "",
    "dataScadIscr": "",
    "esito": {
      "aaSupId": 2017,
      "dataEsa": "15/07/2018 00:00:00",
      "lodeFlg": 0,
      "modValCod": {
        "value": "V"
      },
      "supEsaFlg": null,
      "tipoGiudCod": "",
      "tipoGiudDes": "",
      "voto": 28
    },
    "freqObbligFlg": null,
    "freqUffFlg": 1,
    "gruppoGiudCod": "",
    "gruppoGiudDes": "",
    "gruppoVotoId": 1,
    "gruppoVotoLodeFlg": 1,
    "gruppoVotoMaxVoto": 30,
    "gruppoVotoMinVoto": 18,
    "itmId": 6,
    "matId": 286879,
    "note": "",
    "numAppelliPrenotabili": 0,
    "numPrenotazioni": 0,
    "ord": 5,
    "peso": 9,
    "pianoId": 1,
    "ragId": null,
    "raggEsaTipo": null,
    "ricId": 0,
    "sovranFlg": 0,
    "stato": {
      "value": "S"
    },
    "statoDes": "Superata",
    "stuId": 236437,
    "superataFlg": null,
    "tipoEsaCod": "SOC",
    "tipoEsaDes": "Scritto e Orale Congiunti",
    "tipoInsCod": "OBB",
    "tipoInsDes": "Obbligatoria"
  },
  {
    "aaFreqId": 2017,
    "adCod": "019GI",
    "adDes": "ISTITUZIONI DI DIRITTO ROMANO",
    "adsceId": 5057982,
    "annoCorso": 1,
    "chiaveADContestualizzata": {
      "aaOffId": 2017,
      "aaOrdCod": "GI01-17",
      "aaOrdDes": "GIURISPRUDENZA",
      "aaOrdId": 2017,
      "adCod": "019GI",
      "adDes": "ISTITUZIONI DI DIRITTO ROMANO",
      "adId": 111213,
      "afId": 236853,
      "cdsCod": "GI01",
      "cdsDes": "GIURISPRUDENZA",
      "cdsId": 10094,
      "pdsCod": "PDS0-2017",
      "pdsDes": "comune",
      "pdsId": 9999
    },
    "dataFreq": "",
    "dataScadIscr": "",
    "esito": {
      "aaSupId": null,
      "dataEsa": "",
      "lodeFlg": 0,
      "modValCod": {
        "value": "V"
      },
      "supEsaFlg": null,
      "tipoGiudCod": "",
      "tipoGiudDes": "",
      "voto": null
    },
    "freqObbligFlg": null,
    "freqUffFlg": 1,
    "gruppoGiudCod": "",
    "gruppoGiudDes": "",
    "gruppoVotoId": 1,
    "gruppoVotoLodeFlg": 1,
    "gruppoVotoMaxVoto": 30,
    "gruppoVotoMinVoto": 18,
    "itmId": 1,
    "matId": 286879,
    "note": "",
    "numAppelliPrenotabili": 1,
    "numPrenotazioni": 0,
    "ord": 6,
    "peso": 9,
    "pianoId": 1,
    "ragId": null,
    "raggEsaTipo": null,
    "ricId": 0,
    "sovranFlg": 0,
    "stato": {
      "value": "F"
    },
    "statoDes": "Frequentata",
    "stuId": 236437,
    "superataFlg": null,
    "tipoEsaCod": "O",
    "tipoEsaDes": "Orale",
    "tipoInsCod": "OBB",
    "tipoInsDes": "Obbligatoria"
  },
  {
    "aaFreqId": 2017,
    "adCod": "021GI",
    "adDes": "PROVA DI LINGUA INGLESE (LIV. B2)",
    "adsceId": 5057984,
    "annoCorso": 1,
    "chiaveADContestualizzata": {
      "aaOffId": 2017,
      "aaOrdCod": "GI01-17",
      "aaOrdDes": "GIURISPRUDENZA",
      "aaOrdId": 2017,
      "adCod": "021GI",
      "adDes": "PROVA DI LINGUA INGLESE (LIV. B2)",
      "adId": 111222,
      "afId": 236854,
      "cdsCod": "GI01",
      "cdsDes": "GIURISPRUDENZA",
      "cdsId": 10094,
      "pdsCod": "PDS0-2017",
      "pdsDes": "comune",
      "pdsId": 9999
    },
    "dataFreq": "",
    "dataScadIscr": "",
    "esito": {
      "aaSupId": null,
      "dataEsa": "",
      "lodeFlg": 0,
      "modValCod": {
        "value": "G"
      },
      "supEsaFlg": null,
      "tipoGiudCod": "",
      "tipoGiudDes": "",
      "voto": null
    },
    "freqObbligFlg": null,
    "freqUffFlg": 1,
    "gruppoGiudCod": "2",
    "gruppoGiudDes": "superato/non superato",
    "gruppoVotoId": 1,
    "gruppoVotoLodeFlg": 1,
    "gruppoVotoMaxVoto": 30,
    "gruppoVotoMinVoto": 18,
    "itmId": 7,
    "matId": 286879,
    "note": "",
    "numAppelliPrenotabili": 0,
    "numPrenotazioni": 0,
    "ord": 7,
    "peso": 5,
    "pianoId": 1,
    "ragId": null,
    "raggEsaTipo": null,
    "ricId": 0,
    "sovranFlg": 0,
    "stato": {
      "value": "F"
    },
    "statoDes": "Frequentata",
    "stuId": 236437,
    "superataFlg": null,
    "tipoEsaCod": "SOC",
    "tipoEsaDes": "Scritto e Orale Congiunti",
    "tipoInsCod": "OBB",
    "tipoInsDes": "Obbligatoria"
  },
  {
    "aaFreqId": 2017,
    "adCod": "078GI",
    "adDes": "STORIA DEL DIRITTO MEDIEVALE E MODERNO",
    "adsceId": 5057981,
    "annoCorso": 1,
    "chiaveADContestualizzata": {
      "aaOffId": 2017,
      "aaOrdCod": "GI01-17",
      "aaOrdDes": "GIURISPRUDENZA",
      "aaOrdId": 2017,
      "adCod": "078GI",
      "adDes": "STORIA DEL DIRITTO MEDIEVALE E MODERNO",
      "adId": 117740,
      "afId": 236851,
      "cdsCod": "GI01",
      "cdsDes": "GIURISPRUDENZA",
      "cdsId": 10094,
      "pdsCod": "PDS0-2017",
      "pdsDes": "comune",
      "pdsId": 9999
    },
    "dataFreq": "",
    "dataScadIscr": "",
    "esito": {
      "aaSupId": null,
      "dataEsa": "",
      "lodeFlg": 0,
      "modValCod": {
        "value": "V"
      },
      "supEsaFlg": null,
      "tipoGiudCod": "",
      "tipoGiudDes": "",
      "voto": null
    },
    "freqObbligFlg": null,
    "freqUffFlg": 1,
    "gruppoGiudCod": "",
    "gruppoGiudDes": "",
    "gruppoVotoId": 1,
    "gruppoVotoLodeFlg": 1,
    "gruppoVotoMaxVoto": 30,
    "gruppoVotoMinVoto": 18,
    "itmId": 4,
    "matId": 286879,
    "note": "",
    "numAppelliPrenotabili": 1,
    "numPrenotazioni": 0,
    "ord": 8,
    "peso": 9,
    "pianoId": 1,
    "ragId": null,
    "raggEsaTipo": null,
    "ricId": 0,
    "sovranFlg": 0,
    "stato": {
      "value": "F"
    },
    "statoDes": "Frequentata",
    "stuId": 236437,
    "superataFlg": null,
    "tipoEsaCod": "O",
    "tipoEsaDes": "Orale",
    "tipoInsCod": "OBB",
    "tipoInsDes": "Obbligatoria"
  }
]


*/