<template>
  <div class="screen">
    <div class="content">
      <template v-if="klassen">
        {{ klassen }}
      </template>
      <template v-else>
        Laden Sie bitte zunächst die exportierten Schüler-Daten (Excel) hoch:
        <div>
          <Button @click="upload" label="Hochladen" icon="pi pi-upload" :loading="uploadInProgress"/>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {uploadExcel} from '../functions/helper';
import Klasse from '../classes/Klasse';

  export default{
    data(){
      return {
        rawData: null,
        klassen: null,
        uploadInProgress: false
      };
    },
    methods: {
      async upload(){
        this.uploadInProgress=true;
        let rawData=await uploadExcel();
        this.klassen=[];
        for(let i=0;i<rawData.length;i++){
          let data=rawData[i];
          let klasse=new Klasse();
          klasse.parseFromExcel(data);
          this.klassen.push(klasse);
        }
        this.uploadInProgress=false;
        
      }
    }
  };
</script>