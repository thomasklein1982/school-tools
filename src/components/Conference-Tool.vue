<template>
  <div class="screen">
    <div class="content">
      <template v-if="klassen">
        <Klassenliste
          :klassen="klassen"
        />
      </template>
      <template v-else>
        Laden Sie bitte zunächst die exportierten Schüler-Daten (Excel) hoch:
        <div>
          <Button @click="upload" label="Hochladen" icon="pi pi-upload" :loading="uploadInProgress"/>
        </div>
        <div v-if="excelError" class="error">
          {{ excelError }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {uploadExcel} from '../functions/helper';
import Klasse from '../classes/Klasse';
import Klassenliste from './Klassenliste.vue';

  export default{
    components: {
      Klassenliste
    },
    data(){
      return {
        rawData: null,
        klassen: null,
        excelError: null,
        uploadInProgress: false
      };
    },
    methods: {
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
            let data=rawData[i];
            let klasse=new Klasse();
            klasse.parseFromExcel(data);
            this.klassen.push(klasse);
          }
        }catch(e){
          this.excelError=e;
        }
        this.uploadInProgress=false;
        
      }
    }
  };
</script>