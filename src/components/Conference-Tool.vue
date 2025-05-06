<template>
  <div class="screen">
    <div class="content">
      <h1>Konferenztool v{{ $root.version }}</h1>
      <p>von Thomas Klein (<a href="https://mathe-info.com" target="_blank">mathe-info.com</a>)</p>
      <Message severity="info">Alle Daten werden ausschließlich auf ihrem Gerät verarbeitet. Es findet keinerlei Kommunikation mit einem Server statt!</Message>
      <template v-if="klassen">
        <div class="flex-container-row" style="justify-content: flex-end; padding: 0.2rem;"><Zoom :style-node="$root.zoomStyle" css-selector=".zoom"/><Button @click="uploadKopfnoten()" icon="pi pi-upload" label="Kopfnoten hinzufügen" text rounded/><Button @click="klassen=null" icon="pi pi-trash" text rounded/></div>
        <Klassenliste
          :klassen="klassen"
        />
      </template>
      <template v-else>
        <h2>Upload Zeugniskonferenzliste</h2>
        <!-- <div class="flex-container-row" style="justify-content: flex-end"><Button @click="$emit('close')" icon="pi pi-times" text rounded/></div> -->
        Laden Sie die Zeugniskonferenzliste (Excel) hoch:
        <div style="margin-top: 0.5rem">
          <Button @click="upload" label="Zeugniskonferenzliste öffnen" icon="pi pi-upload" :loading="uploadInProgress"/>
          <Button @click="cancelUpload()" v-if="uploadInProgress" label="Hochladen abbrechen" icon="pi pi-cross"/>
        </div>
        <div>
          <h2>Beispiel-Dateien</h2>
          Die folgenden Beispieldateien sind zufällig erzeugt worden, enthalten also keine echten Schüler- oder Lehrerdaten. Zufällige Namensgleichheiten sind ebendas: zufällig. Sie können diese Dateien herunterladen und dann über den obigen Button hochladen.
          <ul>
            <li><a download href="https://thomaskl.uber.space/Apps/resources/conference-tool/Beispiel-Sek-1.xlsx" target="_blank">Beispiel Sek 1</a></li>
            <li><a download href="https://thomaskl.uber.space/Apps/resources/conference-tool/Beispiel-Sek-2.xlsx" target="_blank">Beispiel Sek 2</a></li>
          </ul>
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
import Message from 'primevue/message';

  export default{
    components: {
      Klassenliste, Zoom, Message
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
      exportData(){
        let kuerzel={};
        let klassen={};
        for(let i=0;i<this.klassen.length;i++){
          let k=this.klassen[i];
          let klasse={
            nachnamen: [],
            vornamen: []
          };
          klassen[k.name]=klasse;
          for(let j=0;j<k.schueler.length;j++){
            let s=k.schueler[j];
            klasse.nachnamen.push(s.nachname);
            klasse.vornamen.push(s.vorname);
            for(let i1=0;i1<s.faecher.length;i1++){
              let f=s.faecher[i1];
              if(f.lehrkraft) kuerzel[f.lehrkraft]=true;
            }
          }
          for(let j=0;j<k.faecher.length;j++){
            let f=k.faecher[j];
            if(f.lehrkraft) kuerzel[f.lehrkraft]=true;
          }
          let kl=k.klassenlehrkraftVollerName.split(",");
          klasse.nachnamen.push(kl[0].trim());
          klasse.vornamen.push(kl[1].trim());
        }
        let realKuerzel=[];
        for(let a in kuerzel){
          realKuerzel.push(a);
        }
        let code="let klassenNamen="+JSON.stringify(klassen)+";\nlet kuerzel="+JSON.stringify(realKuerzel)+";";
        console.log(code);
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