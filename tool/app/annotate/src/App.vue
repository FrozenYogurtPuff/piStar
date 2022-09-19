<script setup lang="ts">
</script>

<template>
  <div id="annotate">
    <div id="manager"></div>
    <div id="sentence"></div>
    <div id="step"></div>
  </div>
</template>

<style scoped lang="scss">
/* Chrysant Annotator */
#annotate {
  display: flex;
  flex-direction: row;
  flex-grow: 0.3;
  flex-basis: 0;
  flex-wrap: wrap;
  height: 100%;
  overflow: auto;
  min-height: 1px;
}

#manager {
  background-color: lightgray;
  overflow: auto;
  min-height: 1px;
  width: 17vw;
  position: relative;
  height: 100%;
}

#sentence {
  background-color: #0D3349;
  overflow: auto;
  min-height: 1px;
  width: 66vw;
  position: relative;
  height: 100%;
}

#step {
  background-color: #1abc9c;
  overflow: auto;
  min-height: 1px;
  width: 17vw;
  position: relative;
  height: 100%;
}
</style>
