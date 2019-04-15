/* 29/12/2018
****************************
classe STUDENTE-> VIENE DAL LOGIN
****************************
id
username
password
firstname
lastname
grpDes
grpId
codFis
userId
stuId
matricola*/

function Studente(codFisc, firstname, lastname, grpDes, grpId, id, persId, userId, trattiCarriera) {
    this.codFisc=codFisc
    this.firstname = firstname;
    this.lastname = lastname;
    this.grpDes=grpDes;
    //interi
    this.grpId=grpId;
    this.id=id;
    //stringhe
    this.persId=persId;
    this.userId=userId;
    this.trattiCarriera = trattiCarriera;
    this.getTrattiCarriera=function() {
        var str='';
        if (this.trattiCarriera.length >0 ){
            console.log('********* valore di trattiCarriera ');
           for(var i=0; i<this.trattiCarriera.length; i++){

            str+='cdsDes ' + trattiCarriera[i].cdsDes + ', cdsId '
            +  this.trattiCarriera[i].cdsId + ', matId '+  this.trattiCarriera[i].matId +
             ', matricola '+ this.trattiCarriera[i].matricola + ', staStuDes '+ this.trattiCarriera[i].staStuDes + ' stuId ' 
             +  this.trattiCarriera[i].stuId;

           }

        } else{
           str= 'non ci sono tratti di carriera';
        }
        return str;

    }
    this.log = function() {
        if (process.env.DEBUG_MODE){
            console.log('sono in debug mode');


            console.log('CREATO OGGETTO STUDENTE: cod fisc=' + this.codFisc + ', nome ' + this.firstname + ', cognome  ' + this.lastname + ', gruppo descr' + this.grpDes + ', id gruppo ' 
                + this.grpId + ', id '+ this.id + ',  PersId '+ this.persId+ ', tratti carriera '+ this.getTrattiCarriera());
        } else {

            console.log('NEL LOG DI clsStudente: creato oggetto studente' + this.codFisc + ', nome ' + this.firstname + ', cognome  ' + this.lastname + ', gruppo descr' + this.grpDes + ', id gruppo ' + this.grpId + ', id '+ this.id + ',  PersId '+ this.persId);
        }
       
    };
    /*this.greeting = function() {
      alert('Hi! I\'m ' + this.name.first + '.');
    };*/
  }

 module.exports = Studente;
