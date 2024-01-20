<template>
  <span class="p-buttonset" style="padding-right:0.1rem;padding-left:0.1rem;"><Button text rounded @click="zoom(-1)" icon="pi pi-minus"/><Button text rounded @click="zoom(1)" icon="pi pi-plus"/></span>
</template>

<script>
export default{
  props: {
    styleNode: Object,
    min: {
      type: Number,
      default: 0.5
    },
    max: {
      type: Number,
      default: 10
    },
    step: {
      type: Number,
      default: 0.1
    },
    cssSelector: String,
    unit: {
      type: String,
      default: "rem"
    }
  },
  data(){
    return {
       
    };
  },
  methods: {
    zoom(dir){
      let size=this.styleNode.size
      size+=dir*0.1;
      if(size<this.min){
        size=this.min;
      }
      if(size>this.max){
        size=this.max;
      }
      this.styleNode.size=size;
      let f=size+"rem";
      
      this.styleNode.innerText=this.cssSelector+"{font-size: "+f+"}";
      console.log("zoom",f,this.styleNode.innerText);
    }
  }
}
</script>