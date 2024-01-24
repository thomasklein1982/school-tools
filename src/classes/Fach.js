import { random, randomFrom } from "../functions/helper";

export default class Fach{
  constructor(name, lehrkraft, oberstufe){
    this.name=name;
    this.oberstufe=oberstufe;
    this.lehrkraft=lehrkraft;
    this.hauptfach=false;
    this.fehlzeiten=null;
    this.note=-1;
    this.realNote=-1;
    this.art=null;
    this.epochal=false;
    this.schnitt=null;
    this.istHauptfach=false;
  }
  istKopfnote(){
    return (this.name==="AV"||this.name==="SV");
  }
  getCopy(){
    return new Fach(this.name,this.lehrkraft,this.oberstufe);
  }
  istPflichtfach(){
    return this.art==="P";
  }
  hasNote(){
    return this.realNote>=0;
  }
  getRealNote(){
    if(this.hasNote()){
      return this.realNote;
    }
    return null;
  }
  getSchnitt(){
    if(this.schnitt!=="-"){
      return this.schnitt;
    }else{
      return null;
    }
  }
  setSchnitt(sum,anz){
    if(anz>0){
      this.schnitt=(sum/anz).toFixed(1);
    }else{
      this.schnitt="-";
    }
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
    if(this.oberstufe){
      this.istHauptfach=this.art==="L";
    }else{
      this.istHauptfach=this.art==="P" && (this.name==="D" || this.name==="E" || this.name==="M" || this.name==="F" || this.name==="L" || this.name==="SPA");
    }
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
      this.epochal=note.substring(pos+1,pos2)*1;
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
  pseudonomize(){
    let letters=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    let k="";
    let len=random(2,3);
    for(let i=0;i<len;i++){
      k+=randomFrom(letters);
    }
    this.lehrkraft=k;
  }
  fromData(data){
    for(let a in data){
      this[a]=data[a];
    }
  }
}