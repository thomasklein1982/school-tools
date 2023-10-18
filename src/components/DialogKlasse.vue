<template>
  <Dialog modal maximizable v-if="klasse" v-model:visible="visible" :header="klasse.name+' ('+klasse.klassenlehrkraft+')'">
    <div class="flex-container-row">
      <template v-for="(liste,i) in schuelerlisten">
        <DataTable show-gridlines selectionMode="single" dataKey="id" :metaKeySelection="false"
        @rowSelect="onRowSelect" class="flex p-datatable-small" :value="liste" striped-rows>
          <Column header="Name">
            <template #body="schueler">
              <span :class="schueler.data.zeigeWarnung? 'warnung-note':''">{{ schueler.data.anzeigeName }}</span>
            </template>
          </Column>
          <Column v-for="(f,i) in angezeigteFaecher" :header="f" style="text-align: center">
            <template #body="schueler">
              {{ schueler.data.getNote(f).join("|") }}
            </template>
          </Column>
          <Column v-if="zeigeSchnitt" field="schnitt" header="⌀"/>
        </DataTable>
        <div v-if="i<schuelerlisten.length-1" style="width: 0.5rem"></div>
      </template>
    </div>
    <div>
      <Dropdown v-model="anzeigeFaecher" :options="optionsFaecher" optionLabel="text" optionValue="value"/>
      <Dropdown v-model="columns" :options="[{text: '1 Spalte', value: 1}, {text: '2 Spalten', value: 2}, {text: '3 Spalten', value: 3}, {text: '4 Spalten', value: 4}]" optionLabel="text" optionValue="value"/>
    </div>
  </Dialog>
  <DialogSchuelerSchnitt ref="dialogSchuelerSchnitt"/>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import DialogSchuelerSchnitt from "./DialogSchuelerSchnitt.vue";
import { splitArrayEvenly } from "../functions/helper";
export default{
  components: {
    DataTable, Column, DialogSchuelerSchnitt
  },
  props: {
    
  },
  computed: {
    zeigeSchnitt(){
      return this.anzeigeFaecher===0;
    },
    angezeigteFaecher(){
      if(this.anzeigeFaecher===0){
        return [];
      }
      if(this.anzeigeFaecher===1){
        return ["AV","SV"];
      }
      if(this.anzeigeFaecher===2){
        let faecher=this.klasse.getPflichtFaecher(false);
        for(let i=0;i<faecher.length;i++){
          faecher[i]=faecher[i].name;
        }
        return faecher;
      }
      return [this.anzeigeFaecher];
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
      anzeigeFaecher: 0,
      optionsFaecher: []
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
        text: "Durchschnitt",
        value: 0
      });
      if(!this.klasse.oberstufe){
        this.optionsFaecher.push({
          text: "Kopfnoten",
          value: 1
        });
        this.optionsFaecher.push({
          text: "Alle Noten",
          value: 2
        });
      }
      let faecher=this.klasse.getPflichtFaecher(false);
      for(let i=0;i<faecher.length;i++){
        this.optionsFaecher.push({
          text: faecher[i].name,
          value: faecher[i].name
        });
      }
      this.visible=true;
    }
  }
}
</script>