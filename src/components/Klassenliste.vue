<template>
  <div class="flex-container-row">
    <template v-for="(liste,i) in klassenlisten">
      <DataTable class="p-datatable-small flex" :value="liste" striped-rows selectionMode="single" dataKey="name" :metaKeySelection="false"
        @rowSelect="onRowSelect">
        <Column field="name" header="Klasse/Kurs"></Column>
        <Column field="klassenlehrkraft" header="Lehrkraft"></Column>
        <Column v-if="anzeigeSchnitt===0" field="schnitt" header="⌀" style="text-align: center"></Column>
        <Column v-else :header="anzeigeSchnitt" style="text-align: center">
          <template #body="klasse">
            {{ klasse.data.getFachSchnitt(anzeigeSchnitt) }}
          </template>
        </Column>
      </DataTable>
      <div v-if="i<klassenlisten.length-1" style="width: 0.5rem"></div>
    </template>
  </div>
  <div>
    <Dropdown v-model="anzeigeSchnitt" :options="optionsSchnitt" optionLabel="text" optionValue="value"/>
    <Dropdown v-model="columns" :options="[{text: '1 Spalte', value: 1}, {text: '2 Spalten', value: 2}, {text: '3 Spalten', value: 3}, {text: '4 Spalten', value: 4}]" optionLabel="text" optionValue="value"/>
  </div>
  <DialogKlasse @schueler="openDialogSchueler" ref="dialogKlasse"/>
  <DialogSchueler ref="dialogSchueler"/>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import DialogKlasse from "./DialogKlasse.vue";
import DialogSchueler from "./DialogSchueler.vue";
import { splitArrayEvenly } from "../functions/helper";

export default{
  components: {
    DataTable, Column, DialogKlasse, DialogSchueler
  },
  props: {
    klassen: Array
  },
  computed: {
    klassenlisten(){
      let listen=splitArrayEvenly(this.klassen,this.columns);
      return listen;
    },
    optionsSchnitt(){
      if(!this.klassen) return [];
      let faecherNamen={};
      for(let i=0;i<this.klassen.length;i++){
        let k=this.klassen[i];
        let pflicht=k.getPflichtFaecher(false);
        for(let j=0;j<pflicht.length;j++){
          let f=pflicht[j];
          faecherNamen[f.name]=true;
        }
      }
      let liste=[{
        text: "Gesamt",
        value: 0
      }];
      for(let a in faecherNamen){
        liste.push({
          text: a,
          value: a
        });
      }
      return liste;
    }
  },
  data(){
    return {
      columns: 2,
      anzeigeSchnitt: 0
    };
  },
  methods: {
    openDialogSchueler(schueler){
      this.$refs.dialogSchueler.open(schueler);
    },
    onRowSelect(event){
      console.log(event.data);
      this.$refs.dialogKlasse.open(event.data);
    }
  }
  
};
</script>