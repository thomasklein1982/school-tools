<template>
  <Dialog modal maximizable v-if="schueler" v-model:visible="visible" :header="header">
    <template #header>
      <div class="flex-container-row" style="align-items: center; width: 100%">
        <strong class="flex zoom">{{ header }}</strong> <Zoom :style-node="$root.zoomStyle" css-selector=".zoom"/>
      </div>
    </template>
    <div class="flex-container-row">
      <template v-for="(liste,i) in fachlisten">
        <DataTable showGridlines class="flex p-datatable-small zoom" :value="liste" striped-rows>
          <Column field="name" header="Fach"/>
          <Column field="lehrkraft" header="Kürzel" style="text-align: center"/>
          <Column field="note" header="Note" style="text-align: center">
            <template #body="fach">
              <span :class="fach.data.zeigeWarnung(schueler.istOberstufe())? 'warnung-note':''">{{ fach.data.note }}</span>
            </template>
          </Column>
        </DataTable>
        <div v-if="i<fachlisten.length-1" style="width: 0.5rem"></div>
      </template>
    </div>
    <div class="statistics">
      <Button class="zoom" @click="$refs.dialogSchuelerSchnitt.open(schueler)" link style="padding: 0" :label="'⌀ = '+schueler.schnitt"/>
      <Button class="zoom" link style="padding: 0" :label="'Fehlzeiten (T/S) = '+schueler.fehlzeiten"/>
    </div>
  </Dialog>
  <DialogSchuelerSchnitt ref="dialogSchuelerSchnitt"/>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { splitArrayEvenly } from "../functions/helper";
import DialogSchuelerSchnitt from "./DialogSchuelerSchnitt.vue";
import Zoom from "./Zoom.vue";

export default{
  components: {
    DataTable, Column, DialogSchuelerSchnitt, Zoom
  },
  props: {
    
  },
  computed: {
    header(){
      if(!this.schueler) return "";
      let s=this.schueler;
      return s.nachname+", "+s.vorname+" ("+s.klasse.name+")";
    },
    fachlisten(){
      let listen=splitArrayEvenly(this.schueler.getBelegteFaecher(true),this.columns);
      return listen;
    }
  },
  data(){
    return {
      schueler: null,
      visible: false,
      columns: 2
    }
  },
  methods: {
    
    open(schueler){
      this.schueler=schueler;
      this.visible=true;
    }
  }
}
</script>

<style scoped>
  .statistics{
    display: flex;
    justify-content: space-between;
  }
</style>