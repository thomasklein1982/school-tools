<template>
  <Dialog maximizable v-if="klasse" v-model:visible="visible" :header="klasse.name+' ('+klasse.klassenlehrkraft+')'">
    <div class="flex-container-row">
      <template v-for="(liste,i) in schuelerlisten">
        <DataTable class="flex p-datatable-small" :value="liste" striped-rows>
          <Column field="anzeigeName" header="Name"/>
          
        </DataTable>
      </template>
    </div>
    <div>
      <Dropdown v-model="anzeigeFaecher" :options="optionsFaecher" optionLabel="text" optionValue="value"/>
      <Dropdown v-model="columns" :options="[{text: '1 Spalte', value: 1}, {text: '2 Spalten', value: 2}, {text: '3 Spalten', value: 3}, {text: '4 Spalten', value: 4}]" optionLabel="text" optionValue="value"/>
    </div>
  </Dialog>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
export default{
  components: {
    DataTable, Column
  },
  props: {
    
  },
  computed: {
    schuelerlisten(){
      let listen=[];
      let anzahl=Math.ceil(this.klasse.size()/this.columns);
      let offset=0;
      for(let i=0;i<this.columns;i++){
        let liste=[];
        if(i===this.columns-1){
          anzahl=this.klasse.size()-(this.columns-1)*anzahl;
        }
        for(let j=0;j<anzahl;j++){
          liste.push(this.klasse.getSchueler(offset));
          offset++;
        }
        listen.push(liste);
      }
      return listen;
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
  methods: {
    open(klasse){
      this.klasse=klasse;
      while(this.optionsFaecher.length>0){
        this.optionsfaecher.pop();
      }
      this.optionsFaecher.push({
        text: "Keine Noten",
        value: 0
      });
      this.optionsFaecher.push({
        text: "Alle Noten",
        value: 1
      });
      this.visible=true;
    }
  }
}
</script>