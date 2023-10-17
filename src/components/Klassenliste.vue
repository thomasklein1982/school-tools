<template>
  <DataTable :value="klassen" striped-rows selectionMode="single" dataKey="name" :metaKeySelection="false"
        @rowSelect="onRowSelect">
    <Column field="name" header="Klasse/Kurs"></Column>
    <Column field="klassenlehrkraft" header="Lehrkraft"></Column>
  </DataTable>
  <DialogKlasse ref="dialogKlasse"/>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import DialogKlasse from "./DialogKlasse.vue";

export default{
  components: {
    DataTable, Column, DialogKlasse
  },
  props: {
    klassen: Array
  },
  methods: {
    onRowSelect(event){
      console.log(event.data);
      this.$refs.dialogKlasse.open(event.data);
    }
  }
  
};
</script>