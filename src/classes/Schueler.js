import { nachnamen, randomFrom, vornamen } from "../functions/helper";
import Fach from "./Fach";

export default class Schueler{
  constructor(id,klasse){
    this.id=id;
    this.klasse=klasse;
    this.fehlzeiten=null;
    this.vorname=null;
    this.nachname=null;
    this.wiederholung=null;
    this.arbeitsverhalten=null;
    this.sozialverhalten=null;
    this.noten=null;
    this.nichtAnwesend=false;
    this.schnitt=null;
    this.schnittInfos=null;
    this.zeigeWarnung=false;
    this.fehlzeitenDisplay="";
  }
  istOberstufe(){
    return this.klasse.istOberstufe();
  }
  static getSubFachData(data,index){
    if(data===null || data===undefined){
      return [""];
    }
    let split=data.split("-------");
    if(index===undefined){
      return split;
    }
    if(split.length>1){
      return split[index];
    }else{
      return split[0];
    }
  }
  getFach(fachname){
    let faecher=[];
    for(let i=0;i<this.faecher.length;i++){
      let f=this.faecher[i];
      if(f.name===fachname){
        faecher.push(f);
      }
    }
    return faecher;
  }
  getNote(fachname){
    let note=[];
    for(let i=0;i<this.faecher.length;i++){
      let f=this.faecher[i];
      if(f.name===fachname){
        note.push(f.note);
      }
    }
    return note;
  }
  getRealNote(fachname){
    for(let i=0;i<this.faecher.length;i++){
      let f=this.faecher[i];
      if(f.name===fachname && f.hasNote()){
        return f.getRealNote();
      }
    }
    return -1;
  }
  getBelegteFaecher(includeKopfnoten){
    let faecher=[];
    for(let i=0;i<this.faecher.length;i++){
      let f=this.faecher[i];
      if(f.istKopfnote()){
        if(includeKopfnoten){
          faecher.push(f);
        }
      }else if(f.hasLehrkraft()){
        faecher.push(f);
      }
    }
    return faecher;
  }
  calculateData(){
    this.anzeigeName=this.nachname+", "+this.vorname.split(" ")[0];
    this.anzeigeNameKurz=this.nachname.substring(0,2);
    if(this.nichtAnwesend){
      this.anzeigeName="("+this.anzeigeName+")";
    }
    let oberstufe=this.istOberstufe();
    //schnitt:
    let infos={
      faecher: [],
      sum: 0,
      anz: 0
    };
    for(let i=0;i<this.faecher.length;i++){
      let f=this.faecher[i];
      if(f.hasNote() && !f.istKopfnote()){
        if(f.zeigeWarnung(oberstufe)){
          this.zeigeWarnung=true;
        }
        infos.sum+=f.realNote;
        infos.anz++;
        infos.faecher.push(f);
      }
    }
    this.schnittInfos=infos;
    if(infos.anz>0){
      this.schnitt=(infos.sum/infos.anz).toFixed(1);
    }else{
      this.schnitt="-";
    }
    if(this.fehlzeiten){
      let fz=this.fehlzeiten.split(" ")[0];
      fz=fz.split("/");
      let tage=fz[0].split(":");
      let stunden=fz[1].split(":");
      if(tage[1]!=="0" && tage[1]!=="-"){
        tage=tage[0]+"("+tage[1]+")/";
      }else if(tage[0]==="-"){
        tage="";
      }else{
        tage=tage[0]+"/";
      }
      if(stunden[1]!=="0" && stunden[1]!=="-"){
        stunden=stunden[0]+"("+stunden[1]+")";
      }else{
        stunden=stunden[0];
      }
      this.fehlzeitenDisplay=tage+stunden;
    }
  }
  setKopfnoten(kopfnoten){
    let av,sv;
    av=this.getNote("AV")[0];
    if(av) return false;
    let key=this.klasse.name+"$"+this.nachname+"$"+this.vorname;
    let data=kopfnoten[key];
    if(data){
      av=this.getFach("AV")[0];
      av.setNote(data.av);
      sv=this.getFach("SV")[0];
      sv.setNote(data.sv);
      console.log("AV/SV hinzugefuegt bei "+key);
      return true;
    }
    return false;
  }
  addFach(fach){
    fach=fach.getCopy();
    fach.setNote("");
    this.faecher.push(fach);
  }
  parseFromExcel(reader,faecher){
    this.fehlzeiten=null;
    let data=reader.getCurrentCellContent();
    let pos=data.toLowerCase().indexOf("-fachlehr");
    let nichtAnwesend=false;
    if(pos<0){
      pos=data.toLowerCase().indexOf("-fehlzeiten");
      this.nichtAnwesend=true;
    }
    let name=data.substring(0,pos).split(",");
    this.vorname=name[1].trim();
    this.nachname=name[0].trim();
    //fehlzeiten:
    if(!this.nichtAnwesend){
      data=reader.move(0,1);
      reader.move(0,-1);
    }
    pos=data.toLowerCase().indexOf("-fehlzeiten");
    if(pos>0){
      data=data.split("\n");
      if(!data[1]){
        this.fehlzeiten="0:0/0:0 ja";
      }else{
        this.fehlzeiten=data[1].trim();
      }
    }
    this.faecher=[];
    if(!this.nichtAnwesend){
      for(let i=0;i<faecher.length;i++){
        let fach=faecher[i];
        //erst note:
        data=reader.move(1,3);
        //geteiltes Fach?
        let s=Schueler.getSubFachData(data);
        for(let j=0;j<s.length;j++){
          let subfach=fach.getCopy();
          subfach.setNote(s[j].trim());
          data=reader.move(0,-1);
          subfach.setArt(Schueler.getSubFachData(data,j));
          data=reader.move(0,-1);
          subfach.setFehlzeiten(Schueler.getSubFachData(data,j));
          data=reader.move(0,-1);
          if(!fach.hasLehrkraft()){
            subfach.setLehrkraft(Schueler.getSubFachData(data,j));
          }
          this.faecher.push(subfach);
          reader.move(0,3);
        }
        reader.move(0,-3);
      }
    }
    
    reader.gotoLeft();
    this.calculateData();
    if(this.nichtAnwesend){
      return reader.move(0,2);
    }else{
      return reader.move(0,5);
    }
  }
  pseudonomize(){
    this.vorname=randomFrom(vornamen);
    this.nachname=randomFrom(nachnamen);
    for(let i=0;i<this.faecher.length;i++){
      this.faecher[i].pseudonomize();
    }
    this.calculateData();
  }
  fromData(data){
    for(let a in data){
      this[a]=data[a];
    }
    this.faecher=[];
    for(let i=0;i<data.faecher.length;i++){
      let f=data.faecher[i];
      let fach=new Fach(f.name,f.lehrkraft,f.oberstufe);
      fach.fromData(f);
    }
  }
}