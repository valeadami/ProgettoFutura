
function Carriera(aaId, aaImm1,aaImmSu,aaOrdId,aaRegId,cdsCod,cdsDes,cdsId,
    dataChiusura,dataImm,dataImm1,dataImmSu,matId,matricola,motStastuCod,motStastuDes,ordCod,ordDes,
    pdsCod,pdsDes,pdsId,tipoCorsoCod,tipoCorsoDes,tipoTititCod,tipoTititDes){
//interi
    this.aaId=aaId; //anno accademico di ingresso/immatricolazione in ateneo ,
    this.aaImm1=aaImm1; //anno accademico di inizio carriera 
    this.aaImmSu=aaImmSu; // anno accademico di prima immatricolazione al sistema universitario 
    this.aaOrdId=aaOrdId; // anno di ordinamento del corso di iscrizione dello studente ,
    this.aaRegId=aaRegId; // anno di coorte dello studente ,
    //stringhe
    this.cdsCod=cdsCod; //codice del corso di studio di iscrizione dello studente ,
    this.cdsDes=cdsDes; //descrizione del corso di iscrizione dello studente,
    //intero
    this.cdsId=cdsId; //CHIAVE del corso di studio di erogazione dell''attività didattica,
    //stringa (stringa vuota)
    this.dataChiusura=dataChiusura; //data chiusura della carriera
    //stringhe - data in formato 18/04/2018 00:00:00
    this.dataImm=dataImm; //data ingresso/immatricolazione in ateneo 
    this.dataImm1=dataImm1; //data inizio carriera ,
    this.dataImmSu=dataImmSu; // data prima immatricolazione nel sistema universitario ,
    //intero
    this.matId=matId; //id univoco che consente di individuare il tratto di carriera dello studente ,
   //STRINGA
    this.matricola=matricola; //matricola dello studente, è il numero assegnato dalle segreterie allo studente per identificarlo nel sistema, una matricola potrebbe non identificare univocamente un libretto collegato ad un tratto di carriera ,
    this.motStastuCod=motStastuCod; //codice del motivo dello stato dello studente ,
    this.motStastuDes=motStastuDes; //descrizione del motivo dello stato dello studente 
    this.ordCod=ordCod; //codice dell'ordinamento di studio di iscrizione dello studente ,
    this.ordDes=ordDes; //descrizione dell'ordinamento di iscrizione dello studente ,
    this.pdsCod=pdsCod; // codice del percorso di iscrizione dello studente ,
    this.pdsDes=pdsDes; // descrizione del percorso di iscrizione dello studente,
    //intero
    this.pdsId=pdsId; //CHIAVE del percorso di studio di erogazione dell''attività didattica ,
    this.tipoCorsoCod=tipoCorsoCod; //codice del tipo di corso di studio 
    this.tipoCorsoDes=tipoCorsoDes; //descrizione del tipo di corso di studio
    this.tipoTititCod=tipoTititCod;//codice del tipo di corso di studio 
    this.tipoTititDes=tipoTititDes; //descrizione del tipo di corso di studio 
    
    this.log = function() {
        if (process.env.DEBUG_MODE){
            console.log('sono in debug mode');


            console.log('CREATO OGGETTO CARRIERA: anno immatricolazione=' +this.aaId + ', cdsCod ' + this.cdsCod + ', cdsDes  ' + this.cdsDes + ', cdsId' + this.cdsId + ', id matricola ' + this.matId + ', matricola '+ this.matricola + ',  motStastuCod '+ this.motStastuCod+ ', ordCod  '+ 
                    this.ordCod +', ordDes '+ this.ordDes + ', pdsCod '+ this.pdsCod + ', pdsDes '+ this.pdsDes + ', pdsId '+ this.pdsId+
                    ', tipoCorsoCod ' + this.tipoCorsoCod + ', tipoCorsoDes '+ this.tipoCorsoDes);
        } else {

            console.log('creato oggetto carriera');
        }
       
    };
}
module.exports = Carriera;
/*
31/12/2018
****************************

classe CARRIERA -> VIENE DAL LOGIN
**************************** e DA 
https://units.esse3.pp.cineca.it/e3rest/api/anagrafica-service-v1/carriere/s260856/
[
  {
    "aaId": 2017,
    "aaImm1": 2017,
    "aaImmSu": 2017,
    "aaOrdId": 2017,
    "aaRegId": 2017,
    "cdsCod": "GI01",
    "cdsDes": "GIURISPRUDENZA",
    "cdsId": 10094,
    "dataChiusura": "",
    "dataImm": "18/04/2018 00:00:00",
    "dataImm1": "18/04/2018 00:00:00",
    "dataImmSu": "18/04/2018 00:00:00",
    "iso6392Cod": "ita",
    "linguaId": 15,
    "matId": 286879,
    "matricola": "GI0103598",
    "motStastuCod": "IMM",
    "motStastuDes": "Immatricolazione",
    "ordCod": "GI01-17",
    "ordDes": "GIURISPRUDENZA",
    "pdsCod": "PDS0-2017",
    "pdsDes": "comune",
    "pdsId": 9999,
    "persId": 260856,
    "staStuCod": "A",
    "staStuDes": "Attivo",
    "stuId": 236437,
    "tipoCorsoCod": "LM5",
    "tipoCorsoDes": "Laurea Magistrale Ciclo Unico 5 anni",
    "tipoTititCod": "LM",
    "tipoTititDes": "Laurea Magistrale",
    "userId": "s260856"
  }
]
*/
