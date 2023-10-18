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
      version: "1.0",
      current: 'start'
    }
  },
  components: {
    Startscreen, ConferenceTool
  }
}
</script>