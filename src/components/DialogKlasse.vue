<template>
  <Dialog modal maximizable v-if="klasse" v-model:visible="visible" :header="klasse.name+' ('+klasse.klassenlehrkraft+')'">
    <template #header>
      <div class="flex-container-row" style="align-items: center; width: 100%">
        <strong class="flex">{{ klasse.name }} ({{ klasse.klassenlehrkraft }})</strong> <Zoom :style-node="$root.zoomStyle" css-selector=".zoom"/>
      </div>
    </template>
    <div class="flex-container-row">
      <template v-for="(liste,i) in schuelerlisten">
        <DataTable show-gridlines selectionMode="single" dataKey="id" :metaKeySelection="false"
        @rowSelect="onRowSelect" class="klassentabelle flex p-datatable-small zoom" :value="liste" striped-rows>
          <Column header="Name">
            <template #body="schueler">
              <span :class="schueler.data.zeigeWarnung? 'warnung-note':''">{{ schueler.data.anzeigeName }}</span>
            </template>
          </Column>
          <Column v-for="(f,i) in angezeigteFaecher" :header="f.zeigeName? '':f" style="text-align: center">
            <template #body="schueler">
              <template v-if="f.zeigeName">
                {{ schueler.data.anzeigeNameKurz }}
              </template>
              <template v-else>
                {{ schueler.data.getNote(f).join("|") }}
              </template>
            </template>
          </Column>
          <Column v-if="zeigeFehlzeiten" field="fehlzeitenDisplay" style="text-align: center">
            <template #header><span class="pi pi-clock"/></template>
          </Column>
          <Column v-if="zeigeSchnitt" field="schnitt" header="⌀" style="text-align: center"/>
        </DataTable>
        <div v-if="i<schuelerlisten.length-1" style="width: 0.5rem"></div>
      </template>
    </div>
    <div>
      <MultiSelect v-model="anzeigeFaecher" display="chip" :options="optionsFaecher" optionLabel="text" optionValue="value"/>
      <Dropdown v-model="columns" :options="[{text: '1 Spalte', value: 1}, {text: '2 Spalten', value: 2}, {text: '3 Spalten', value: 3}, {text: '4 Spalten', value: 4}]" optionLabel="text" optionValue="value"/>
    </div>
    <div>
      {{ klasse.size() }} Schüler*innen
    </div>
  </Dialog>
  <DialogSchuelerSchnitt ref="dialogSchuelerSchnitt"/>
</template>

<script>
import DataTable from "primevue/datatable";
import MultiSelect from "primevue/multiselect";
import Column from "primevue/column";
import DialogSchuelerSchnitt from "./DialogSchuelerSchnitt.vue";
import { splitArrayEvenly } from "../functions/helper";
import Zoom from "./Zoom.vue";

export default{
  components: {
    DataTable, Column, DialogSchuelerSchnitt, MultiSelect, Zoom
  },
  props: {
    styleNode: Object
  },
  computed: {
    angezeigteFaecher(){
      let faecher=[];
      this.zeigeSchnitt=false;
      this.zeigeFehlzeiten=false;
      for (let i = 0; i < this.anzeigeFaecher.length; i++) {
        let f = this.anzeigeFaecher[i];
        if(f===0){
          this.zeigeSchnitt=true;
          continue;
        }
        if(f===2){
          this.zeigeFehlzeiten=true;
          continue;
        }
        if(f===1){
          faecher.push("AV","SV");
          continue;
        }
        if(f.faecher){
          faecher=faecher.concat(f.faecher);
        }else{
          faecher.push(f);
        }
      }
      // if(faecher.length>4){
      //   let m=Math.ceil(faecher.length/2);
      //   faecher.splice(m,0,{zeigeName: true});
      // }
      return faecher;
    },
    schuelerlisten(){
      let listen=splitArrayEvenly(this.klasse.schueler,this.columns);
      return listen;
    },
    notenHeader(){

    }
  },
  data(){
    return {
      klasse: null,
      visible: false,
      columns: 2,
      anzeigeFaecher: [],
      optionsFaecher: [],
      zeigeSchnitt: true,
      zeigeFehlzeiten: true
    }
  },
  emits: ["schueler"],
  methods: {
    onRowSelect(schueler){
      this.$emit("schueler",schueler.data);
    },
    open(klasse){
      this.klasse=klasse;
      while(this.optionsFaecher.length>0){
        this.optionsFaecher.pop();
      }
      this.optionsFaecher.push({
        text: "Schnitt",
        value: 0
      });
      if(!this.klasse.oberstufe){
        this.optionsFaecher.push({
          text: "Kopfnoten",
          value: 1
        });
      }
      this.optionsFaecher.push({
        text: "Fehlzeiten",
        value: 2
      });
      let faecher=this.klasse.getPflichtFaecher(false);
      let names={};
      for(let i=0;i<faecher.length;i++){
        let f=faecher[i];
        if(f.name in names) continue;
        names[f.name]=true;
        this.optionsFaecher.push({
          text: f.name,
          value: f.name
        });
      }
      this.visible=true;
      if(this.anzeigeFaecher.length===0){
        this.anzeigeFaecher.push(0);
        if(this.klasse.istOberstufe()){
          this.anzeigeFaecher.push(2);
        }else{
          this.anzeigeFaecher.push(1);
        }
      }
    }
  }
}
</script>