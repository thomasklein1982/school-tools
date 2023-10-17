<template>
  <div class="screen" style="text-align: center; ">
    <h1>School-Tools v{{ version }}</h1>
    <p>Diese App bietet verschiedene Tools rund um Zeugniskonferenzen.</p>
    <div class="multiline">
      <Button @click="$emit('conference')" label="Zeugniskonferenz-Tool"/>
      <Button @click="$emit('mahnliste')" label="Mahnlisten-Tool"/>
    </div>
  </div>
</template>

<script>
  export default{
    props: {
      version: String
    }
  };
</script>