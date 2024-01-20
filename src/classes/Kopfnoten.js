import { ExcelReader } from "./ExcelReader";
import Fach from "./Fach";
import Schueler from "./Schueler";

export default class Kopfnoten{
  constructor(){
    this.schueler=null;
  }
  size(){
    return this.schueler.length;
  }
  parseFromExcel(excelSheet){
    this.klassen={};
    let reader=new ExcelReader(excelSheet.rows);
    let ok=reader.gotoCell("SLR_Nachname",true);
    if(!ok) throw "Keine SLR_Nachname-Spalte gefunden";
    reader.saveColum("nachname");
    reader.gotoLeft();
    ok=reader.gotoCell("SLR_Vorname",true);
    if(!ok) throw "Keine SLR_Vorname-Spalte gefunden";
    reader.saveColum("vorname");
    reader.gotoLeft();
    ok=reader.gotoCell("Klassenname",true);
    if(!ok) throw "Keine Klassenname-Spalte gefunden";
    reader.saveColum("klasse");
    reader.gotoLeft();
    ok=reader.gotoCell("Note_AV",true);
    if(!ok) throw "Keine Note_AV-Spalte gefunden";
    reader.saveColum("AV");
    reader.gotoLeft();
    ok=reader.gotoCell("Note_SV",true);
    if(!ok) throw "Keine Note_SV-Spalte gefunden";
    reader.saveColum("SV");

    reader.restore("klasse");
    data=reader.move(0,1);
    while(data!==null){
      if(data){
        let nachname=data;
        let vorname=reader.move(1,0);
        reader.gotoLeft();
        let klasse=reader.getCurrentCellContent();
        console.log(klasse,nachname,vorname);
      }
      data.reader.move(0,1);
    }
    
  }
}