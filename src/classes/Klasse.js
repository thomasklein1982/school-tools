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
  }
  size(){
    return this.schueler.length;
  }
  getSchueler(index){
    return this.schueler[index];
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

      }else if(data!=="AV" && data!=="SV"){
        let s=data.split("\n");
        let fach=new Fach(s[0]?.trim(),s[1]?.trim());
        this.faecher.push(fach);
      }
      data=reader.move(1,0);
    }
    //schueler lesen:
    reader.gotoLeft();
    data=reader.move(0,1);
    while(data!==null){
      let schueler=new Schueler();
      data=schueler.parseFromExcel(reader,this.faecher);
      this.schueler.push(schueler);
    }
  }
}