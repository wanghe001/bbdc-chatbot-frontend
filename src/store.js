import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    nickName: '',
    messages: [
      {
        text: 'Welcome to the chatbot. You can ask some questions if you want. Here is an example: Who is Michael Jordan?',
        from: 'bot',
        isExcluded: true,
      },
    ],
    explanations: [],
    background: [],
    backgroundText: [],
  },
  mutations: {
    logIn(state) {
      state.isLoggedIn = true;
    },
    logOut(state) {
      state.isLoggedIn = false;
    },
    setNickName(state, payload) {
      state.nickName = payload;
    },
    refreshMessages(state, newMessages) {
      state.messages.length = 0;
      state.messages.push(...newMessages);
    },
    addMessage(state, newMessage) {
      state.messages.push(newMessage);
    },
    refreshBackground(state, newBackground) {
      state.background.length = 0;
      state.background.push(...newBackground);
    },
    refreshBackgroundText(state, newBackgroundText) {
      state.backgroundText.length = 0;
      state.backgroundText.push(...newBackgroundText);
    },
    refreshExplanations(state, newExplanations) {
      state.explanations.length = 0;
      state.explanations.push(...newExplanations);
    },
  },
  actions: {
    fetchMessages({ commit }, payload = { explain: true }) {
      const utterances = this.state.messages.filter(_ => !_.isExcluded).map(_ => _.text);
      const utteranceTypes = this.state.messages.filter(_ => !_.isExcluded).map(_ => `<${_.from}>`);
      const requestBody = {
        utterances,
        explain: payload.explain !== undefined ? payload.explain : true,
        utterance_types: utteranceTypes,
      };
      const url = process.env.VUE_APP_BACKEND_URL;
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(requestBody),
      }).then(_ => _.json()).then((response) => {
        console.log(response);
        const message = [];
        const background = [];
        const explanations = [];
        const backgroundText = [];
        for (let i = 0; i < response.utterances.length; i += 1) {
          message.push({
            text: response.utterances[i],
            from: response.utterance_types[i].slice(1, response.utterance_types[i].length - 1),
          });
        }
        if (response.explain) {
          Object.keys(response.explanation_annotations.background).forEach((key) => {
            background.push(
              Object.assign(
                response.background[key],
                { annotation: response.explanation_annotations.background[key] },
                { link: key },
                { text: response.background[key].text },
              ),
            );
          });
          response.explanation_annotations.utterances.forEach((utterance, index) => {
            explanations.push({
              utterance: response.utterances[index],
              annotation: utterance,
              type: response.utterance_types[index],
            });
          });
        }
        if (response.background) {
          Object.keys(response.background).forEach((key) => {
            backgroundText.push(
              Object.assign(response.background[key], {
                link: key,
              }),
            );
          });
        }
        commit('refreshMessages', message);
        commit('refreshBackground', background);
        commit('refreshBackgroundText', backgroundText);
        commit('refreshExplanations', explanations);
      }).catch((reason) => {
        console.log(reason);
      });
    },
  },
});
