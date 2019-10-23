<template>
<div class="message-box" :class="type">
  <div class="message">{{message}}</div>
</div>
</template>

<script>
export default {
  name: 'MessageBox',
  props: {
    message: String,
    type: String,
  },
};
</script>

<style lang="scss" scoped>
  .message-box{
    &.user{
      text-align:right;
      .message{
        background: #4f4c4d;
        &::after{
          right:0;
          border-left-color: #4f4c4d;
          border-right: 0;
          border-bottom: 0;
          margin-top:-5px;
          margin-right:-10px;
        }
      }
    }
    &.bot{
      text-align: left;
      .message{
        background:#CC4C58;
        &::after{
          left:0;
          border-right-color: #CC4C58;
          border-left: 0;
          border-bottom: 0;
          margin-top:-5px;
          margin-left:-10px;
        }
      }
    }
    .message{
      display: inline-block;
      margin: 10px;
      padding: 5px 10px;
      border-radius:5px;
      position:relative;
      color:white;
      &::after{
        content:'';
        position:absolute;
        top:65%;
        width:0;
        height:0;
        border:10px solid transparent;
      }
    }
  }

</style>
