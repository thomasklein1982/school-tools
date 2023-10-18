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
  }
  istOberstufe(){
    return this.klasse.istOberstufe();
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
  }
  parseFromExcel(reader,faecher){
    this.fehlzeiten=null;
    let data=reader.getCurrentCellContent();
    let pos=data.indexOf("-FachLehrer");
    let nichtAnwesend=false;
    if(pos<0){
      pos=data.indexOf("-Fehlzeiten");
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
    pos=data.indexOf("-Fehlzeiten");
    if(pos>0){
      data=data.split("\n");
      this.fehlzeiten=data[1].trim();
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
}