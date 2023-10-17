export class ExcelReader{
  constructor(rows){
    this.rows=rows;
    this.currentRow=0;
    this.currentCol=0;
  }
  getCurrentCellContent(){
    if(this.currentRow>=this.rows.length) return null;
    let r=this.rows[this.currentRow];
    if(this.currentCol>=r.length) return null;
    let c=this.rows[this.currentRow][this.currentCol];
    if(!c){
      return "";
    }else{
      return c.trim();
    }
  }
  move(dx,dy){
    this.currentRow+=dy;
    this.currentCol+=dx;
    return this.getCurrentCellContent();
  }
  /**gehe ganz nach links an den Anfang der aktuellen Zeile */
  gotoLeft(){
    this.currentCol=0;
  }
  /** 
   * gehe ganz nach oben in der aktuellen Spalte */
  gotoTop(){
    this.currentRow=0;
  }
  /**
   * gehe nach ganz links oben (Zelle A1)
   */
  gotoTopLeft(){
    this.gotoLeft();
    this.gotoTop();
  }
  /**
   * Geht zur nächsten Zelle, die dem Suchwort entspricht. Bleibt an aktueller Position, falls nichts gefunden wird.
   * @param {String|RegExp} search String oder regulärer Ausdruck, nach dem gesucht wird
   * @param {Boolean|undefined} goRight Bei true: es wird in der aktuellen Zeile gesucht (nach rechts), sonst: in aktueller Spalte (nach unten)
   * @returns true: Zelle wurde gefunden, false: Zelle wurde nicht gefunden
   */
  gotoCell(search,goRight){
    let startRow=this.currentRow;
    let startCol=this.currentCol;
    if(!goRight) goRight=false;
    let useRegex=search.substring!==undefined;
    let searching=true;
    while(searching){
      if(goRight){
        this.currentCol++;
      }else{
        this.currentRow++;
      }
      let content=this.getCurrentCellContent();
      if(content===null){
        this.currentRow=startRow;
        this.currentCol=startCol;
        return false;
      }
      if(useRegex){
        if(content.match(search)){
          return true;
        }
      }else{
        if(content.startsWith(search)){
          return true;
        }
      }
    }
    this.currentRow=startRow;
    this.currentCol=startCol;
    return false;
  }

}