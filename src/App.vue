<template>
  <Card class="screen">
    <template #content>
      <Startscreen
        v-if="current==='start'"
        :version="version"
        @conference="current='conference'"
        @mahnliste="current='mahnliste'"
      />
      <ConferenceTool 
        v-if="current==='conference'"
        @close="current='start'"
      />
    </template>
  </Card>
</template>

<script>
import Startscreen from './components/startscreen.vue';
import ConferenceTool from './components/Conference-Tool.vue';

export default {
  data(){
    return {
      version: "1.6",
      current: 'start',
      zoomStyle: document.createElement("style")
    }
  },
  mounted(){
    this.zoomStyle.size=1;
    document.getElementsByTagName("head")[0].appendChild( this.zoomStyle );
  },
  components: {
    Startscreen, ConferenceTool
  }
}
</script>