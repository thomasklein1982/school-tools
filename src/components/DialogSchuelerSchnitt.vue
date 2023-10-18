<template>
  <Dialog modal maximizable v-if="schueler" v-model:visible="visible" :header="header">
    <template v-if="infos.anz>0">
      <pre style="white-space: wrap" v-for="(s,i) in herleitung" v-html="s"/>
    </template>
    <template v-else>
      Für diese*n Schüler*in konnte kein Durchschnitt berechnet werden, da keine Noten vorliegen.
    </template>
  </Dialog>
</template>

<script>

export default{
  components: {
   
  },
  props: {
    
  },
  computed: {
    herleitung(){
      let schritte=[];
      let faecher=[];
      for(let i=0;i<this.infos.faecher.length;i++){
        let f=this.infos.faecher[i];
        faecher.push(f.realNote+" ["+f.name+"]");
      }
      schritte.push("⌀ = ( "+faecher.join(' + ')+" ) / "+this.infos.anz);
      schritte.push("⌀ = "+this.infos.sum+"/"+this.infos.anz);
      schritte.push("⌀ &asymp; "+(this.infos.sum/this.infos.anz).toFixed(5)*1);
      return schritte;
    },
    infos(){
      if(this.schueler){
        return this.schueler.schnittInfos;
      }else{
        return null;
      }
    },
    header(){
      if(!this.schueler) return "";
      let s=this.schueler;
      return "Durchschnitt von "+s.nachname+", "+s.vorname+" ("+s.klasse.name+")";
    }
  },
  data(){
    return {
      schueler: null,
      visible: false
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