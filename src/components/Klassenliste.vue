<template>
  <DataTable class="p-datatable-small" :value="klassen" striped-rows selectionMode="single" dataKey="name" :metaKeySelection="false"
        @rowSelect="onRowSelect">
    <Column field="name" header="Klasse/Kurs"></Column>
    <Column field="klassenlehrkraft" header="Lehrkraft"></Column>
  </DataTable>
  <DialogKlasse @schueler="openDialogSchueler" ref="dialogKlasse"/>
  <DialogSchueler ref="dialogSchueler"/>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import DialogKlasse from "./DialogKlasse.vue";
import DialogSchueler from "./DialogSchueler.vue";

export default{
  components: {
    DataTable, Column, DialogKlasse, DialogSchueler
  },
  props: {
    klassen: Array
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