

function Appello(aaCalId, adCod,adDes,adId,appId,cdsCod,cdsDes,cdsId,
    condId,dataFineIscr,dataInizioApp,dataInizioIscr,desApp,note,numIscritti,numPubblicazioni,numVerbaliCar,numVerbaliGen,
    presidenteCognome,presidenteId,presidenteNome,riservatoFlg,stato,statoAperturaApp,statoDes,statoInsEsiti,statoLog,statoPubblEsiti,statoVerb,
    tipoDefAppCod,tipoDefAppDes,tipoEsaCod,tipoSceltaTurno){
//interi
    this.aaCalId=aaCalId; // 2017 integer, optional): anno di calendario dell'appello, viene utilizzato per agganciare una eventuale definizione di esame comune ,
    //stringhe
    this.adCod=adCod; //"078GI",
    this.adDes=adDes; // STORIA DEL DIRITTO MEDIEVALE E MODERNO",
    //interi
    this.adId=adId; // 117740 integer ******** chiave 
    this.appId=appId; //5 integer  ******** chiave
    //stringhe
    this.cdsCod=cdsCod; //GI01"
    this.cdsDes=cdsDes; //"GIURISPRUDENZA",
    //intero
    this.cdsId=cdsId; //10094 ******* chiave
    //intero (null)
    this.condId=condId; //(integer, optional): id della condizione SQL associata all'appello ,
    //stringhe - data in formato 18/04/2018 00:00:00
    this.dataFineIscr=dataFineIscr; //"30/03/2019 00:00:00"
    this.dataInizioApp=dataInizioApp; // "31/03/2019 00:00:00",
    this.dataInizioIscr=dataInizioIscr; // "09/11/2018 00:00:00",
    this.desApp=desApp; //toria del Diritto
    this.note=note; //note 
    //intero
    this.numIscritti=numIscritti; //(integer, optional): numero di studenti iscritti all'appello ,
    this.numPubblicazioni=numPubblicazioni; // numero di pubblicazion effettuate ,
    this.numVerbaliCar=numVerbaliCar; // numero di verbali caricati
    this.numVerbaliGen=numVerbaliGen; //numero di verbali generati non ancora caricati in carriera ,
   //stringhe 
    this.presidenteCognome=presidenteCognome; // ROSSI cognome presidente
    //intero
    this.presidenteId=presidenteId; // 13440,
    //stringa
    this.presidenteNome=presidenteNome; //"DAVIDE"
    this.riservatoFlg=riservatoFlg; //appello riservato invisible agli studenti ,
    this.stato=stato; // "P" (string, optional): Stato dell'appello, i valori dipendono dallo stato dei sottoProcessi di inserimento esiti, pubblicazione e verbalizzazione. Per lo stato dei singoli sottoprocessi consultare i relativi stati ,
    this.statoAperturaApp=statoAperturaApp;// "C", (string, optional): stato di apertura dell'appello. I relaviti Valori sono (C=da iniziare, A=in fase di svolgimento, F= concluso) ,
    this.statoDes=statoDes; //descrizione del tipo di corso di studio 
    this.statoInsEsiti=statoInsEsiti; //(string, optional): stato del processo di inserimento esiti. I relaviti Valori sono (C=da iniziare, A=in fase di svolgimento, F= concluso) = ['C', 'A', 'F'],
    this.statoLog=statoLog; //"C"
    this.statoPubblEsiti=statoPubblEsiti; //"C" (string, optional): stato del processo di pubblicazione esiti. I relaviti Valori sono (C=da iniziare, A=in fase di svolgimento, F= concluso) = ['C', 'A', 'F'],
    this.statoVerb=statoVerb;//  "C"
    this.tipoDefAppCod=tipoDefAppCod;//STD
    this.tipoDefAppDes=tipoDefAppDes; //Appello On-Line semplificato con firma digitale",
    this.tipoEsaCod=tipoEsaCod; //"O" (string, optional): modalità dell'esame definita nell'appello (valorizzata se il par_conf=CONTR_TIPO_ESA_APP=0), i possibili valori sono ( Scritto=S, Orale=O, Scritto e Orale Congiunto=SOC, Scritto e Orale Separato=SOS). = ['S', 'O', 'SOC', 'SOS'],
    //intero
    this.tipoSceltaTurno=tipoSceltaTurno; //(integer, optional): tipo di scelta turno, i possibili valori sono i seguenti (0 - Calcolato dal sistema, viene associato il primo turno disponibile; 1 - Selezionabile dall'utente tra i turni compatibili liberi; 2 - Selezionato dall'utente prendendo un turno libero (anche non compatibile) ,
    
    
    
    
    this.log = function() {
        if (process.env.DEBUG_MODE){
            console.log('sono in debug mode');


            console.log('CREATO OGGETTO APPELLO: anno calendario =' +this.aaCalId + ', adCod ' + this.adCod +', adDes '+ this.adDes + cdsCod + ', adID ' + this.adId + ', appId  ' + this.appId + ', cdsDes' + this.cdsDes + ', csdId ' + this.csdId + ', data fine iscrizione '+ this.dataFineIscr + ',  data Inizio appelo '+ this.dataInizioApp+ ', dataInizioIscr  '+ 
                    this.dataInizioIscr +', desApp '+ this.desApp);
        } else {

            console.log('creato oggetto appello');
        }
       
    };
}
module.exports = Appello;


/*

[
    {
      "aaCalId": 2017,
      "adCod": "078GI",
      "adDes": "STORIA DEL DIRITTO MEDIEVALE E MODERNO",
      "adId": 117740,
      "appId": 5,
      "cdsCod": "GI01",
      "cdsDes": "GIURISPRUDENZA",
      "cdsId": 10094,
      "condId": null,
      "dataFineIscr": "30/03/2019 00:00:00",
      "dataInizioApp": "31/03/2019 00:00:00",
      "dataInizioIscr": "09/11/2018 00:00:00",
      "desApp": "Storia del Diritto",
      "note": "",
      "numIscritti": 0,
      "numPubblicazioni": 0,
      "numVerbaliCar": 0,
      "numVerbaliGen": 0,

      "presidenteCognome": "ROSSI",
      "presidenteId": 13440,
      "presidenteNome": "DAVIDE",
      "riservatoFlg": 0,
      "stato": "P",
      "statoAperturaApp": "C",
      "statoDes": "Prenotazioni Aperte",
      "statoInsEsiti": {
        "value": "C"
      },
      "statoLog": "C",
      "statoPubblEsiti": {
        "value": "C"
      },
      "statoVerb": {
        "value": "C"
      },
      "tipoDefAppCod": "STD",
      "tipoDefAppDes": "Parametri Standard",
      "tipoEsaCod": {
        "value": "O"
      },
      "tipoGestAppCod": "WSF",
      "tipoGestAppDes": "Appello On-Line semplificato con firma digitale",
      "tipoGestPrenCod": "STD",
      "tipoGestPrenDes": "Prenotazione Standard",
      "tipoIscrCod": {
        "value": "O"
      },
      "tipoSceltaTurno": 0
    }
  ]
{
    datacalId (integer, optional): id della data di pianificazione utilizzata per la generazione dell'appello (NB: il campo è relativo ad una gestione particolare utilizzata solo da alcuni atenei) ,
    capostipiteId (integer, optional): id del codice guida che ha generato l'appello. (NB: il campo è relativo ad una gestione particolare utilizzata solo da alcuni atenei) ,
    commPianId (integer, optional): id della commissione della pianicazione collegata all'appello. (NB: il campo è relativo ad una gestione particolare utilizzata solo da alcuni atenei) ,
    indexId (integer, optional): id dell'index relativo al gestore collegato all'appello. (NB: il campo è relativo ad una gestione particolare utilizzata solo da alcuni atenei) ,
    periodoId (integer, optional): id del periodo collegato all'appello (NB: il campo è relativo ad una gestione particolare utilizzata solo da alcuni atenei) ,
    numVerbaliGen (integer, optional): numero di verbali generati non ancora caricati in carriera ,
    numVerbaliCar (integer, optional): numero di verbali caricati ,
    numPubblicazioni (integer, optional): numero di pubblicazion effettuate ,
    numIscritti (integer, optional): numero di studenti iscritti all'appello ,
    statoLog (string, optional): stato di avanzamento del processo di definizione della logista dell'appello. I relaviti valori sono (G=generato, C=Consolidato, I=Inviato, R=Ritornato, A=Attivato) enum: . G
    C
    I
    R
    A
    ,
    statoAperturaApp (string, optional): stato di apertura dell'appello. I relaviti Valori sono (C=da iniziare, A=in fase di svolgimento, F= concluso) ,
    statoVerb (string, optional): stato del processo di verbalizzazione degli esiti. I relaviti Valori sono (C=da iniziare, A=in fase di svolgimento, F= concluso) = ['C', 'A', 'F'],
    statoPubblEsiti (string, optional): stato del processo di pubblicazione esiti. I relaviti Valori sono (C=da iniziare, A=in fase di svolgimento, F= concluso) = ['C', 'A', 'F'],
    statoInsEsiti (string, optional): stato del processo di inserimento esiti. I relaviti Valori sono (C=da iniziare, A=in fase di svolgimento, F= concluso) = ['C', 'A', 'F'],
    statoDes (string, optional): descrizione dello stato dell'appello, indica con una descrizione lo stato dei vari sottoprocessi ,
    stato (string, optional): Stato dell'appello, i valori dipendono dallo stato dei sottoProcessi di inserimento esiti, pubblicazione e verbalizzazione. Per lo stato dei singoli sottoprocessi consultare i relativi stati ,
    presidenteNome (string, optional): nome del docente presidente della commissione dell'appello ,
    presidenteCognome (string, optional): cognome del docente presidente della commissione dell'appello ,
    presidenteId (integer, optional): id del docente presidente nella commissione dell'appello ,
    tipoGestPrenDes (string, optional): descrizione modalità di prenotazione dell'appello ,
    tipoGestAppDes (string, optional): descrizione modalità di verbalizzazione dell'appello ,
    tipoDefAppDes (string, optional): descrizione modalità di definizione dell'appello ,
    adDes (string, optional): codice dell'attività didattica di erogazione dell'appello ,
    adCod (string, optional): codice dell'attività didattica di erogazione dell'appello ,
    cdsDes (string, optional): codice del corso di studio di erogazione dell'appello ,
    cdsCod (string, optional): codice del corso di studio di erogazione dell'appello ,
    appId (integer, optional): id progressivo dell'appello rispetto alla coppia cds_id,ad_id ,
    aaCalId (integer, optional): anno di calendario dell'appello, viene utilizzato per agganciare una eventuale definizione di esame comune ,
    noteSistLog (string, optional): note da inviare al sistema di logistica esterno ,
    note (string, optional): note associate all'appello ,
    tagTemplId (integer, optional): id del grupop di tag associati all'appello. Se presente, viene richiesta la selezione del tag in fase di prenotazione (NB: il campo è relativo ad una gestione particolare utilizzata solo da alcuni atenei) ,
    sedeId (integer, optional): id della sede associata all'appello. Se valorizzata viene controllato durante la prenotazione che la sede coincida con quella dello studente nell'anno di sessione (NB: il campo è relativo ad una gestione particolare utilizzata solo da alcuni atenei) ,
    gruppoVotoId (integer, optional): Id del gruppo voto nel caso gli ordinamenti collegati ai cds dell'appello abbiano gruppi voto differenti (NB: il campo è relativo ad una gestione particolare utilizzata solo da alcuni atenei) ,
    condId (integer, optional): id della condizione SQL associata all'appello ,
    tipoSceltaTurno (integer, optional): tipo di scelta turno, i possibili valori sono i seguenti (0 - Calcolato dal sistema, viene associato il primo turno disponibile; 1 - Selezionabile dall'utente tra i turni compatibili liberi; 2 - Selezionato dall'utente prendendo un turno libero (anche non compatibile) ,
    riservatoFlg (integer, optional): appello riservato invisible agli studenti ,
    dataInizioApp (string, optional): data inizio appello (DD/MM/YYYY) ,
    dataFineIscr (string, optional): data fine iscrizioni (DD/MM/YYYY) ,
    dataInizioIscr (string, optional): data inizio iscrizioni (DD/MM/YYYY) ,
    tipoEsaCod (string, optional): modalità dell'esame definita nell'appello (valorizzata se il par_conf=CONTR_TIPO_ESA_APP=0), i possibili valori sono ( Scritto=S, Orale=O, Scritto e Orale Congiunto=SOC, Scritto e Orale Separato=SOS). = ['S', 'O', 'SOC', 'SOS'],
    tipoIscrCod (string, optional): modalità di iscrizione definita nell'appello, i possibili valori sono ( Scritto=S, Orale=O, Scritto e Orale=SO). = ['S', 'O', 'SO'],
    tipoGestPrenCod (string, optional): codice modalità di prenotazione dell'appello ,
    tipoGestAppCod (string, optional): codice modalità di verbalizzazione dell'appello ,
    tipoDefAppCod (string, optional): codice modalità di definizione dell'appello ,
    desApp (string, optional): descrizione libera dell'appello ,
    adId (integer, optional): id dell'attività didattica di erogazione dell'appello ,
    cdsId (integer, optional): id del corso di studio di erogazione dell'appello
    }*/
