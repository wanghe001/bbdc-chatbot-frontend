<template>
  <div class="home">
    <login-box v-if="!loggedIn"></login-box>
    <div v-if="loggedIn" class="chatbot-wrapper"
         :class="{expanded:explainTabClicked,'expanded-left':backgroundTabClicked}">
      <h3 class="title">Hello, {{$store.state.nickName}}</h3>
      <span class="button explain" :class="{expanded:explainTabClicked,disabled:!explainChecked}"
            @click="tabButtonClicked('explain')">Explanation</span>
      <span class="button background" :class="{expanded:backgroundTabClicked}"
            @click="tabButtonClicked('background')">Background</span>
      <div class="message-panel">
        <message-box v-for="(message,index) in this.$store.state.messages" :key="index"
          :message="message.text"
          :type="message.from"
        >
        </message-box>
      </div>
      <div class="user-message-wrapper">
        <textarea id="user-text" v-model="userMessage"></textarea>
        <div class="submit-control">
          <span @click="submitMessage" class="user-text-submit">Send</span>
          <label class="explain-checkbox-container">Explain
            <input type="checkbox" v-model="explainChecked">
            <span class="checkmark"></span>
          </label>
        </div>

      </div>
    </div>
    <div v-if="loggedIn"
         class="explanation-window" :class="{expanded: explainTabClicked}">
      <div class='background section'>
        <h2 class='section-title'>Background</h2>
        <accordion v-for="(entity,index) in background"
                   :key="index"
                   :title="entity.rawName"
                   :body="setMessageGradient(entity)"
        ></accordion>
      </div>
      <div class='history section'>
        <h2>History</h2>
        <div class='utterance' v-for="(utterance,index) in explanations" :key='index'>
          <div v-if="index<explanations.length-1" v-html="setMessageGradient(utterance)"></div>
        </div>
      </div>
      <div class="prediction section">
        <h2>Prediction</h2>
        <div class="utterance">
          <div>
            <div v-if="explanations[explanations.length-1]"
                 v-html="setMessageGradient(explanations[explanations.length-1])"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="loggedIn" class="background-window" :class="{expanded: backgroundTabClicked}">
      <accordion v-for="(entity,index) in backgroundText"
                 :key="index"
                 :title="entity.rawName"
                 :body="entity.text"
      ></accordion>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import LoginBox from '../components/LoginBox.vue';
import MessageBox from '../components/MessageBox.vue';
import Accordion from '../components/Accordion.vue';

export default {
  name: 'home',
  components: {
    LoginBox,
    MessageBox,
    Accordion,
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
      backgroundTabClicked: false,
      background: this.$store.state.background,
      backgroundText: this.$store.state.backgroundText,
      explanations: this.$store.state.explanations,
      backgroundShown: false,
      backgroundContent: {},
      explainChecked: false,
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
      this.$store.dispatch('fetchMessages', { explain: this.explainChecked });
    },
    setMessageGradient(message) {
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
      if (message.utterance) {
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
      }
      const splittedText = message.text.split('');
      const RGB = redRGB;
      message.annotation.forEach((anno) => {
        const start = anno[0];
        const end = anno[0] + anno[1] - 1;
        const color = `rgba(${RGB.red},${RGB.green},${RGB.blue},${0.2 + anno[2] * 0.8})`;
        splittedText[start] = `<span class="background-token" style="background: ${color}">${splittedText[start]}`;
        splittedText[end] = `${splittedText[end]}</span>`;
      });
      return `<div class="background-text">${splittedText.join('')}</div>`;
    },
    tabButtonClicked(button) {
      if (button === 'background') {
        this.backgroundTabClicked = !this.backgroundTabClicked;
        this.explainTabClicked = false;
      } else {
        this.explainTabClicked = !this.explainTabClicked;
        this.backgroundTabClicked = false;
      }
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
    &.expanded-left{
      left:50vw;
      transition: 0.4s;
    }
    .title{
      color: white;
    }
    .button {
      color:white;
      &.explain{
        background: #dd5d69;
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
      &.background{
        background: #4f4c4d;
        position:absolute;
        width:100px;
        height:20px;
        top:0;
        left:-140px;
        transform: rotate(-90deg);
        transform-origin: top right;
        padding:5px;
        border-radius: 5px;
        transition: 0.4s;
        &:hover{
          background: #444444;
          cursor: pointer;
        }
        &.expanded{
          transform: rotate(0);
          left:-110px;
          transition: 0.4s;
        }
      }
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
      .submit-control {
        width:19%;
        display: inline-block;
        vertical-align: middle;
      }
      .user-text-submit{
        vertical-align: middle;
        text-align: center;
        width:50%;
        margin:4%;
        background: #4f4c4d;
        color:white;
        padding:10px;
        border-radius: 5px;
        cursor: pointer;
        display: block;
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
    z-index: -2;
    transition: 0.4s;
    border-radius: 5px;
    background:white;
    .section {
      margin:0 20px;
      &.background{
        margin-top:50px;
      }
    }
    &.expanded{
      left:50vw;
      transition: 0.4s;
      z-index: -1;
    }
    h2{
      color: #dd5d69;
      width: 160px;
      text-align: left;
    }
    .entity-name {
      background:#CC4C58;
      color:white;
      padding:2px;
      margin: 2px;
      border-radius: 2px;
    }
    .utterance {
      margin: 10px;
      text-align: left;
      .context {
        padding: 5px;
        margin:2px;
        border-radius: 5px;
        color: white;
        display: inline-block;
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
    .background {
      margin-left:20px;
      max-height:40vh;
      overflow-y:auto;
      &::-webkit-scrollbar {
        width: 5px;
      }
      &::-webkit-scrollbar-track {
        background: rgba(#CC4C58,0.3);
      }
      &::-webkit-scrollbar-thumb {
        background: #CC4C58;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: #AA2A36;
      }
      .background-text {
        text-align: justify;
        margin:0 10px;
        .background-token {
          display: inline-block;
          margin: 2px;
          padding: 2px;
          border-radius: 2px;
        }
      }
    }
  }
  .background-window {
    position:fixed;
    width:40vw;
    height:80vh;
    left:30vw;
    top:10vh;
    box-shadow: 1px 1px 1px 1px #4f4c4d;
    z-index: -2;
    transition: 0.4s;
    border-radius: 5px;
    background:white;
    &.expanded{
      left:10vw;
      transition: 0.4s;
      z-index:-1;
    }
    .accordion-title{
      background:white;
      border: 1px solid #dddddd;
      color: #4f4c4d;
      box-shadow: 1px 1px 1px 1px #4f4c4d;
      &:first-child{
        margin-top:50px;
      }
    }
    .accordion-body{
      color: #4f4c4d;
      text-align: justify;
      padding: 10px;
      margin: 10px;
    }
  }

  /* The container */
  .explain-checkbox-container {
    display: block;
    position: relative;
    padding-left: 35px;
    margin:12px 10px;
    cursor: pointer;
    font-size: 22px;
    color:white;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Hide the browser's default checkbox */
  .explain-checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom checkbox */
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
    border-radius: 5px;
  }

  /* On mouse-over, add a grey background color */
  .explain-checkbox-container:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the checkbox is checked, add a blue background */
  .explain-checkbox-container input:checked ~ .checkmark {
    background-color: #4f4c4d;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .explain-checkbox-container input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .explain-checkbox-container .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }

</style>
