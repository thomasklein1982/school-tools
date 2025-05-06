import { randomFrom, random, nachnamen, vornamen } from "../functions/helper";
import { ExcelReader } from "./ExcelReader";
import Fach from "./Fach";
import Schueler from "./Schueler";

export default class Klasse{
  constructor(name){
    this.name=name;
    this.klassenlehrkraft=null;
    this.schueler=null;
    this.oberstufe=false;
    this.faecher=null;
    this.lehrkraefte=null;
    this.arbeitsverhalten=null;
    this.sozialverhalten=null;
    this.schnitt=null;
    this.missesKopfnoten=true;
  }
  istOberstufe(){
    return this.oberstufe;
  }
  size(){
    return this.schueler.length;
  }
  getSchueler(index){
    return this.schueler[index];
  }
  getPflichtFaecher(includeKopfnoten){
    let liste=[];
    for(let i=0;i<this.faecher.length;i++){
      let f=this.faecher[i];
      if(f.istKopfnote()){
        if(includeKopfnoten){
          liste.push(f);
        }
      }else if(f.istPflichtfach()){
        liste.push(f);
      }
    }
    return liste;
  }
  getFachSchnitt(fachname){
    let fach=this.getFach(fachname);
    if(fach.length===0) return "-";
    for(let i=0;i<fach.length;i++){
      let f=fach[i];
      let s=f.getSchnitt();
      if(s!==null){
        return s;
      }
    }
    return null;
  }
  getFach(fachname){
    let fach=[];
    for(let i=0;i<this.faecher.length;i++){
      let f=this.faecher[i];
      if(f.name===fachname){
        fach.push(f);
      }
    }
    return fach;
  }
  assureKopfnotenInFaecher(fachname){
    if(this.istOberstufe()){
      this.missesKopfnoten=false;
      return;
    }
    if(!this.missesKopfnoten) return;
    if(!fachname){
      this.assureKopfnotenInFaecher("AV");
      this.assureKopfnotenInFaecher("SV");
      return;
    }
    for(let i=0;i<this.faecher.length;i++){
      let f=this.faecher[i];
      if(f.name===fachname){
        this.missesKopfnoten=false;
        return;
      }
    }
    let f=new Fach(fachname);
    this.faecher.push(f);
    for(let i=0;i<this.schueler.length;i++){
      let s=this.schueler[i];
      s.addFach(f);
    }
  }
  calculateData(){
    this.assureKopfnotenInFaecher();
    let sum=0;
    let anz=0;
    let faecherMitNoten={};
    for(let j=0;j<this.schueler.length;j++){
      let s=this.schueler[j];
      for(let i=0;i<s.faecher.length;i++){
        let fach=s.faecher[i];
        if(fach.hasNote()){
          faecherMitNoten[fach.name]=true;
        }
      }
      if(s.schnittInfos.anz>0){
        anz++;
        sum+=s.schnittInfos.sum/s.schnittInfos.anz;
      }
    }
    if(anz>0){
      this.schnitt=(sum/anz).toFixed(1);
    }else{
      this.schnitt="-";
    }
    for(let i=0;i<this.faecher.length;i++){
      let fach=this.faecher[i];
      fach.setSchnitt(0,0);
      if(faecherMitNoten[fach.name]){
        fach.setArt("P");
        anz=0;
        sum=0;
        for(let j=0;j<this.schueler.length;j++){
          let s=this.schueler[j];
          let note=s.getRealNote(fach.name);
          if(note>=0){
            sum+=note;
            anz++;
          }
        }
        fach.setSchnitt(sum,anz);
      }
    }
  }
  setKlassenlehrkraft(fullnameString){
    let s=fullnameString.split(",");
    let nach=s[0];
    let vor=s[1].trim().split(" ")[0];
    this.klassenlehrkraft=nach+", "+vor;
    this.klassenlehrkraftVollerName=fullnameString;
  }
  setKopfnoten(kopfnoten){
    if(!this.missesKopfnoten) return;
    let hinzuGefuegt=false;
    for(let i=0;i<this.schueler.length;i++){
      let s=this.schueler[i];
      if(s.setKopfnoten(kopfnoten)){
        hinzuGefuegt=true;
      }
    }
    if(hinzuGefuegt) this.missesKopfnoten=false;
    this.calculateData();
  }
  parseFromExcel(excelSheet){
    this.schueler=[];
    this.faecher=[];
    let reader=new ExcelReader(excelSheet.rows);
    let ok=reader.gotoCell("Klasse:");
    if(!ok) throw "Keine Klasse gefunden";
    let data=reader.getCurrentCellContent();
    let pos=data.indexOf(":");
    let pos2=data.indexOf("Klassenleitung:",pos);
    let pos3=data.indexOf("Vertretung:",pos2);
    if(pos2<0 || pos3<0) throw "Keine Klassenleitung gefunden";
    this.name=data.substring(pos+1,pos2-1).trim();
    this.setKlassenlehrkraft(data.substring(pos2+16,pos3-1).trim());
    this.oberstufe=this.name.startsWith("E")||this.name.startsWith("Q");
    data=reader.move(1,1);
    //Faecher lesen:
    while(data!==null){
      if(data.startsWith("Wdh")||this.istOberstufe() && data==="AV"){
        break;
      }else{
        let s=data.split("\n");
        let fach=new Fach(s[0]?.trim(),s[1]?.trim(),this.istOberstufe());
        this.faecher.push(fach);
      }
      data=reader.move(1,0);
    }
    //schueler lesen:
    reader.gotoLeft();
    data=reader.move(0,1);
    let schuelerID=0;
    while(data!==null){
      let schueler=new Schueler(schuelerID, this);
      schuelerID++;
      data=schueler.parseFromExcel(reader,this.faecher);
      this.schueler.push(schueler);
    }
    this.calculateData();
  }
  pseudonomize(klassen){
    //name tauschen:
    let k=randomFrom(klassen);
    let name=this.name;
    this.name=k.name;
    k.name=name;
    for(let i=0;i<this.faecher.length;i++){
      this.faecher[i].pseudonomize();
    }
    this.klassenlehrkraft=randomFrom(nachnamen)+", "+randomFrom(vornamen);
    //schueler tauschen:
    for(let i=0;i<this.schueler.length;i++){
      let s=this.schueler[i];
      s.pseudonomize();
    }
  }
  exchangeStudents(klassen){
    //schueler tauschen:
    for(let i=0;i<this.schueler.length;i++){
      let s=this.schueler[i];
      let k=randomFrom(klassen);
      let j=random(0,k.schueler.length-1);
      this.schueler[i]=k.schueler[j];
      k.schueler[j]=s;
    }
  }
  sortStudents(){
    this.schueler.sort((a,b)=>{
      if(a.anzeigeName<=b.anzeigeName){
        return -1;
      }else{
        return 1;
      }
    });
  }
  fromData(data){
    this.name=data.name;
    this.klassenlehrkraft=data.klassenlehrkraft;
    this.schueler=[];
    this.oberstufe=data.oberstufe;
    this.faecher=[];
    this.missesKopfnoten=data.missesKopfnoten;
    for(let i=0;i<data.faecher.length;i++){
      let f=data.faecher[i];
      let fach=new Fach(f.name,f.lehrkraft,f.oberstufe);
      fach.fromData(f);
    }
    for(let i=0;i<data.schueler.length;i++){
      let d=data.schueler[i];
      let s=new Schueler(d.id,this);
      s.fromData(d);
    }
  }
}