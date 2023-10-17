<template>
  <Startscreen
    v-if="current==='start'"
    :version="version"
    @conference="current='conference'"
    @mahnliste="current='mahnliste'"
  />
  <ConferenceTool 
    v-if="current==='conference'"
    
  />
</template>

<script>
import Startscreen from './components/startscreen.vue';
import ConferenceTool from './components/Conference-Tool.vue';

export default {
  data(){
    return {
      version: "0.1",
      current: 'start'
    }
  },
  components: {
    Startscreen, ConferenceTool
  }
}
</script>