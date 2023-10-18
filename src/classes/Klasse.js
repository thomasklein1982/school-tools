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
  calculateData(){
    let faecherMitNoten={};
    for(let j=0;j<this.schueler.length;j++){
      let s=this.schueler[j];
      for(let i=0;i<s.faecher.length;i++){
        let fach=s.faecher[i];
        if(fach.hasNote()){
          faecherMitNoten[fach.name]=true;
        }
      }
    }
    for(let i=0;i<this.faecher.length;i++){
      let fach=this.faecher[i];
      if(faecherMitNoten[fach.name]){
        fach.setArt("P");
      }
    }
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
    this.klassenlehrkraft=data.substring(pos2+16,pos3-1).trim();
    this.oberstufe=this.name.startsWith("E")||this.name.startsWith("Q");
    data=reader.move(1,1);
    //Faecher lesen:
    while(data!==null){
      if(data.startsWith("Wdh")){
        break;
      }else{
        let s=data.split("\n");
        let fach=new Fach(s[0]?.trim(),s[1]?.trim());
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
}