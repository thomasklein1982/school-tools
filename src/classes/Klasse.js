export default class Klasse{
  constructor(name){
    this.name=name;
    this.schueler=[];
  }
  parseFromExcel(excelSheet){
    this.name=excelSheet.name;
  }
}