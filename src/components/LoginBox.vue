<template>
    <div class="login-box">
      <label for="user-nick-name">Please enter your nick name:</label>
      <input v-model="nickName" id="user-nick-name">
      <span class="button" @click="logIn">Start</span>
    </div>
</template>

<script>
export default {
  name: 'LoginBox',
  data() {
    return {
      nickName: '',
    };
  },
  methods: {
    logIn() {
      this.$store.commit('logIn');
      this.$store.commit('setNickName', this.nickName);
    },
  },
};
</script>

<style lang="scss" scoped>
  .login-box{
    position: fixed;
    top: 40vh;
    left: 40vw;
    height: 20vh;
    width: 20vw;
    background: #CC4C58;
    border-radius: 5px;
    label{
      display: block;
      margin: 20px auto;
      color: white;
      border-radius: 5px;
    }
    input{
      display: block;
      margin:20px auto;
      border-radius: 5px;
      border-color:white;
      border-style: solid;
      caret-color: #CC4C58;
      &:focus{
        outline: none;
      }
    }
    .button{
      display: block;
      padding: 20px;
      background: #4f4c4d;
      color: white;
      width: 100px;
      margin:20px auto;
      cursor: pointer;
      border-radius: 5px;
      &:hover{
        color:#eeeeee;
        background: #444444;
      }
    }
  }

</style>
