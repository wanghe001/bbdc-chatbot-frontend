<template>
  <div class="home">
    <login-box v-if="!loggedIn"></login-box>
    <div v-if="loggedIn" class="chatbot-wrapper" :class="{expanded:explainTabClicked}">
      <h3 class="title">Hello, {{$store.state.nickName}}</h3>
      <span class="button explain" :class="{expanded:explainTabClicked}"
            @click="explainTabClicked=!explainTabClicked">Explain</span>
      <div class="message-panel">
        <message-box v-for="(message,index) in this.$store.state.messages" :key="index"
          :message="message.text"
          :type="message.from"
        >
        </message-box>
      </div>
      <div class="user-message-wrapper">
        <textarea id="user-text" v-model="userMessage"></textarea>
        <span @click="submitMessage" class="user-text-submit">Send</span>
      </div>
    </div>
    <div v-if="loggedIn" class="explanation-window" :class="{expanded: explainTabClicked}">
      <div class='background'>
        <h2 class='section-title'>Background</h2>
        <span
          class="entity-name"
          v-for="(wiki,index) in background" :key="index"
          @click="setBackgroundKnowledge(wiki)"
        >{{wiki.rawName}}</span>
      </div>
      <div class='explanation'>
        <h2>Explanations</h2>
        <div class='utterance' v-for="(utterance,index) in explanations" :key='index'>
          <div v-html="setMessageGradient(utterance)"></div>
        </div>
      </div>
      <div class="background-modal" v-if='backgroundShown'>
        <span class='close' @click="backgroundShown=false">X</span>
        <div class='background-content'>
          <h3>{{backgroundContent.rawName}}<span class='type'>{{backgroundContent.type}}</span></h3>
          <div class='background-text'>{{backgroundContent.text}}</div>
          <div class='domain'>Domains: {{backgroundContent.domains.join(", ")}}</div>
          <div class="wiki-page">Wiki Page:
            <a :href="backgroundContent.link" target="_blank">link</a>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import LoginBox from '../components/LoginBox.vue';
import MessageBox from '../components/MessageBox.vue';

export default {
  name: 'home',
  components: {
    LoginBox,
    MessageBox,
  },
  computed: {
    loggedIn() {
      return this.$store.state.isLoggedIn;
    },
  },
  data() {
    return {
      userMessage: '',
      explainTabClicked: false,
      background: this.$store.state.background,
      explanations: this.$store.state.explanations,
      backgroundShown: false,
      backgroundContent: {},
    };
  },
  methods: {
    submitMessage() {
      if (this.userMessage !== '') {
        this.$store.commit('addMessage', {
          text: this.userMessage,
          from: 'user',
        });
      }
      this.userMessage = '';
      this.$store.dispatch('fetchMessages');
    },
    setBackgroundKnowledge(bk) {
      Object.assign(this.backgroundContent, bk);
      console.log(this.backgroundContent);
      this.backgroundShown = true;
    },
    setMessageGradient(message) {
      console.log(message);
      const redRGB = {
        red: 204,
        green: 76,
        blue: 88,
      };
      const blackRGB = {
        red: 79,
        green: 76,
        blue: 77,
      };
      const splittedText = message.utterance.split('');
      const RGB = message.type === '<user>' ? blackRGB : redRGB;
      message.annotation.forEach((anno) => {
        const start = anno[0];
        const end = anno[0] + anno[1] - 1;
        const color = `rgba(${RGB.red},${RGB.green},${RGB.blue},${0.2 + anno[2] * 0.8})`;
        splittedText[start] = `<span class="entity-name" style="background: ${color}">${splittedText[start]}`;
        splittedText[end] = `${splittedText[end]}</span>`;
      });
      const classType = message.type === '<user>' ? 'user' : 'bot';
      let isLast = false;
      if (message.annotation.length === 0) {
        isLast = true;
      }
      const lastClass = isLast ? 'last' : '';
      return `<div class="${classType} ${lastClass}">${splittedText.join('')}</div>`;
    },
  },
};
</script>
<style lang="scss">

  .chatbot-wrapper{
    position:fixed;
    width:40vw;
    height:80vh;
    left:30vw;
    top:10vh;
    background: #CC4C58;
    border-radius: 5px;
    transition: 0.4s;
    &.expanded{
      left:10vw;
      transition: 0.4s;
    }
    .title{
      color: white;
    }
    .explain{
      position:absolute;
      width:100px;
      height:20px;
      top:0;
      right:-140px;
      transform: rotate(90deg);
      transform-origin: top left;
      padding:5px;
      border-radius: 5px;
      transition: 0.4s;
      &:hover{
        background: #CC4C58;
        cursor: pointer;
      }
      &.expanded{
        transform: rotate(0);
        right:-110px;
        transition: 0.4s;
      }
    }
    .button {
      background: #dd5d69;
      color:white;
    }
    .message-panel{
      background: white;
      border-radius: 5px;
      width:80%;
      height:70%;
      margin: 20px auto 20px auto;
    }
    .user-message-wrapper{
      width:80%;
      height:15%;
      margin:auto;
      text-align: left;
      textarea{
        resize: none;
        width:80%;
        height:90%;
        border-radius: 5px;
        border-color: white;
        vertical-align: middle;
        caret-color: #CC4C58;
        &:focus{
          outline: none;
        }
      }
      .user-text-submit{
        vertical-align: middle;
        width:10%;
        margin:4%;
        background: #4f4c4d;
        color:white;
        padding:10px;
        border-radius: 5px;
        cursor: pointer;
        &:hover{
         color:#eeeeee;
         background: #444444;
        }
      }
    }
  }
  .explanation-window {
    position:fixed;
    width:40vw;
    height:80vh;
    left:30vw;
    top:10vh;
    box-shadow: 1px 1px 1px 1px #CC4C58;
    z-index: -1;
    transition: 0.4s;
    border-radius: 5px;
    &.expanded{
      left:50vw;
      transition: 0.4s;
    }
    h2{
      margin-top:50px;
      margin-left:20px;
      color: #dd5d69;
      width: 160px;
      padding: 10px;
      border-radius: 5px;
    }
    .entity-name {
      background:#CC4C58;
      color:white;
      padding:5px;
      margin: 5px;
      border-radius: 5px;
      &:hover{
        background:#BB3B47;
        cursor: pointer;
      }
    }
    .utterance {
      margin:10px 40px;
      .context {
        padding: 5px;
        margin:2px;
        border-radius: 5px;
        color: white;
        display: inline-block;
      }
      .bot{
        text-align: left;
      }
      .user{
        text-align: right;
      }
      .last {
        background: #CC4C58;
        font-size:1.5em;
        color:white;
        margin:2px;
        padding:5px;
        display:inline-block;
        text-align: left;
        float:left;
        border-radius: 5px;
      }
      .prediction {
        color:#CC4C58;
        font-size:1.5em;
        border-radius:5px;
        padding:5px;
        display: inline-block;
      }
    }
    .background-modal{
      position: absolute;
      z-index: 100;
      background: rgba($color: #000000, $alpha: 0.5);
      top:0;
      left:0;
      right:0;
      bottom:0;
      .close{
        position:absolute;
        display: inline-block;
        right:5px;
        top: 5px;
        background: #CC4C58;
        color:white;
        width:20px;
        height: 20px;
        &:hover{
          cursor: pointer;

        }
      }
      .background-content{
        background:white;
        position: absolute;
        top: 10%;
        left: 10%;
        right: 10%;
        bottom: 10%;
        h3{
          color: #dd5d69;
          padding: 10px;
          border-radius: 5px;
          .type {
            color: white;
            background: #CC4C58;
            padding: 5px;
            border-radius: 20px;
            font-size:0.5em;
            display: inline-block;
            margin:5px;

          }
        }
        .background-text{
          color:#CC4C58;
          padding:20px;
          text-align: justify;
          .context {
            padding: 5px;
            margin:2px;
            border-radius: 5px;
            color: white;
            display: inline-block;
          }

        }
        .domain{
          text-align: left;
          color:#CC4C58;
          padding-left:20px;
        }
        .wiki-page {
          text-align: left;
          color:#CC4C58;
          padding-left:20px;
          a{
            color:#CC4C58;
          }
        }
      }
    }
  }
</style>
