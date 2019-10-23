# bbdc-chatbot

This is the front-end chat bot interface for the BBDC project from DFKI.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
There are two places you can change the configuration of the app: 
*vue.config.js* and *.env*

The difference between the two files is that vue.config.js is used to change system configuration, 
and is not accessible for the app itself, while .env file can be access from the app using 

```javascript
let val = process.env.VUE_APP_XXX
```

For instance, 
to change the base URL of the app, go to vue.config.js and change the value for publicPath.
To change the backend server URL, go to .env and change the value og VUE_APP_BACKEND_URL

Please note that only variable starting with VUE_APP_ can be accessed in the app.

More info please see [Configuration Reference](https://cli.vuejs.org/config/)
 and [Environment Variables](https://cli.vuejs.org/guide/mode-and-env.html#environment-variables)

##License

MIT License
