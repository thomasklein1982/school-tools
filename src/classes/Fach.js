export default class Fach{
  constructor(name, lehrkraft){
    this.name=name;
    this.lehrkraft=lehrkraft;
    this.istHauptfach=(name==="D" || name==="E" || name==="M" || name==="F" || name==="L" || name==="SPA");
    this.fehlzeiten=null;
    this.note=-1;
    this.art=null;
  }

  getCopy(){
    return new Fach(this.name,this.lehrkraft);
  }
  hasLehrkraft(){
    return this.lehrkraft!=null;
  }
  setArt(art){
    this.art=art;
  }
  setFehlzeiten(fehlzeiten){
    this.fehlzeiten=fehlzeiten;
  }
  setNote(note){
    this.note=note;
  }
  setLehrkraft(data){

  }
}