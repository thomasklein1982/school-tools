export default class Schueler{
  constructor(){
    this.fehlzeiten=null;
    this.vorname=null;
    this.nachname=null;
    this.wiederholung=null;
    this.arbeitsverhalten=null;
    this.sozialverhalten=null;
    this.noten=null;
  }
  static getSubFachData(data,index){
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
  calculateData(){
    this.anzeigeName=this.nachname+", "+this.vorname.split(" ")[0];
  }
  parseFromExcel(reader,faecher){
    let data=reader.getCurrentCellContent();
    let pos=data.indexOf("-FachLehrer");
    let name=data.substring(0,pos).split(",");
    this.vorname=name[1].trim();
    this.nachname=name[0].trim();
    this.faecher=[];
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
    reader.gotoLeft();
    this.calculateData();
    return reader.move(0,5);
  }
}