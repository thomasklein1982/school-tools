export default class Fach{
  constructor(name, lehrkraft){
    this.name=name;
    this.lehrkraft=lehrkraft;
    this.istHauptfach=(name==="D" || name==="E" || name==="M" || name==="F" || name==="L" || name==="SPA");
    this.fehlzeiten=null;
    this.note=-1;
    this.realNote=-1;
    this.art=null;
    this.epochal=false;
  }
  istKopfnote(){
    return (this.name==="AV"||this.name==="SV");
  }
  getCopy(){
    return new Fach(this.name,this.lehrkraft);
  }
  istPflichtfach(){
    return this.art==="P";
  }
  hasNote(){
    return this.realNote>=0;
  }
  hasLehrkraft(){
    return this.lehrkraft!=null;
  }
  zeigeWarnung(oberstufe){
    if(oberstufe){
      return (this.realNote>=0 && this.realNote<5);
    }else{
      return this.realNote>4;
    }
  }
  setArt(art){
    this.art=art;
  }
  setFehlzeiten(fehlzeiten){
    this.fehlzeiten=fehlzeiten;
  }
  setNote(note){
    this.note=note;
    this.realNote=-1;
    if(note.length===0) return;
    this.epochal=false;
    let pos=note.indexOf("(");
    let pos2=note.indexOf(")",pos);
    if(pos>0 && pos2>0){
      this.epochal=note.substring(pos+1,pos2-1);
      note=note.substring(0,pos);
    }
    if(!isNaN(+note)){
      this.realNote=+note;
    }
  }
  setLehrkraft(data){
    data=data.trim();
    this.lehrkraft=data? data:null;
  }
}