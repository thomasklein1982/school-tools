<template>
  <div class="screen">
    <div class="content">
      <template v-if="klassen">
        <div class="flex-container-row" style="justify-content: flex-end; padding: 0.2rem;"><Zoom :style-node="$root.zoomStyle" css-selector=".zoom"/><Button @click="uploadKopfnoten()" icon="pi pi-upload" label="Kopfnoten hinzufügen" text rounded/><Button @click="klassen=null" icon="pi pi-trash" text rounded/></div>
        <Klassenliste
          :klassen="klassen"
        />
      </template>
      <template v-else>
        <div class="flex-container-row" style="justify-content: flex-end"><Button @click="$emit('close')" icon="pi pi-times" text rounded/></div>
        Laden Sie die Zeugniskonferenzliste (Excel) hoch:
        <div>
          <Button @click="upload" label="Zeugniskonferenzliste hochladen" icon="pi pi-upload" :loading="uploadInProgress"/>
          <Button @click="cancelUpload()" v-if="uploadInProgress" label="Hochladen abbrechen" icon="pi pi-cross"/>
        </div>
        <div v-if="excelError" class="error">
          {{ excelError }}
          <div>
            Versuchen Sie folgendes:
            <ol>
              <li>Excel-Datei in Excel öffnen</li>
              <li>Datei speichern</li>
              <li>Noch mal neue Datei hochladen</li>
            </ol>
          </div>
          
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {uploadExcel} from '../functions/helper';
import Klasse from '../classes/Klasse';
import Klassenliste from './Klassenliste.vue';
import {ExcelReader} from '../classes/ExcelReader';
import Zoom from './Zoom.vue';

  export default{
    components: {
      Klassenliste, Zoom
    },
    data(){
      return {
        rawData: null,
        klassen: null,
        kopfnoten: null,
        excelError: null,
        uploadInProgress: false
      };
    },
    methods: {
      cancelUpload(){
        this.uploadInProgress=false;
        this.klassen=null;
      },
      async uploadKopfnoten(){
        try{
          let rawData=await uploadExcel();
          if(rawData.error){
            alert("Fehler in Sheet "+rawData.name+": "+rawData.error+"\n\nVersuchen Sie folgendes:\nExcel-Datei in Excel öffnen\nDatei neu speichern");
          }
          let sheet=rawData[0];
          let reader=new ExcelReader(sheet.rows);
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

          
          let schueler={};
          reader.moveDown();
          while(reader.value!==null){
            if(reader.value){
              let klasse=reader.goto("klasse");
              let nachname=reader.goto("nachname")
              let vorname=reader.goto("vorname");
              if(klasse && nachname && vorname){
                let sv=reader.goto("SV");
                let av=reader.goto("AV");
                
                schueler[klasse+"$"+nachname+"$"+vorname]={
                  klasse, nachname, vorname, av, sv
                };
              }
            }
            reader.moveDown();
          }

          for(let i=0;i<this.klassen.length;i++){
            let k=this.klassen[i];
            k.setKopfnoten(schueler);
          }
        }catch(e){
          alert(e);
          throw e;
        }
      },
      async upload(){
        this.uploadInProgress=true;
        this.excelError=null;
        try{
          let rawData=await uploadExcel();
          if(rawData.error){
            throw "Fehler in Sheet "+rawData.name+": "+rawData.error;
          }
          this.klassen=[];
          for(let i=0;i<rawData.length;i++){
            if(!this.uploadInProgress){
              this.cancelUpload();
              return;
            }
            let data=rawData[i];
            let klasse=new Klasse();
            klasse.parseFromExcel(data);
            this.klassen.push(klasse);
          }
        }catch(e){
          this.excelError=e;
          this.klassen=null;
          throw e;
        }
        this.uploadInProgress=false;
        window.klassen=this.klassen;
      }
    }
  };
</script>