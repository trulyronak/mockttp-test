const superagent = require("superagent");
const mockttp = require("mockttp");
const express = require('express');
const appPort = 3000;
const proxyPort = 4000;

// Start Simple Server
const app = express();
app.listen(appPort, "localhost", () => {
    console.log("app listening")
})

// Start your server
const proxy = mockttp.getLocal();
const rule = {
    matchers: [new mockttp.matchers.WildcardMatcher()],
    handler: new mockttp.handlers.PassThroughHandler({
        forwarding: {
            targetHost: `http://localhost:${appPort}`,
            updateHostHeader: true
        }
    })
}

proxy.addRule(rule);
proxy.start(proxyPort).then(_ => {
    console.log(`proxy started on ${proxy.url}`)
})

proxy.on('request', completedRequest => {
    console.log(`request for ${completedRequest.url}`)
})