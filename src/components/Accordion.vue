<template>
    <div>
      <h4 class="accordion-title" @click="isVisible=!isVisible">{{title}}</h4>
      <div v-if="isVisible" class="accordion-body">
        <div v-html="body"></div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Accordion',
  data() {
    return {
      isVisible: false,
    };
  },
  props: {
    title: String,
    body: String,
  },
};
</script>

<style lang="scss" scoped>
  .accordion-title{
    background: rgba(#CC4C58,0.2);
    margin:5px 5px;
    padding: 5px;
    border-radius: 5px;
    color: #CC4C58;
    text-align: left;
  }
  .accordion-body{
    color:white;

  }
</style>
