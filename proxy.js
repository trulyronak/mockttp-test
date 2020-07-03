const superagent = require("superagent");
const mockttp = require("mockttp");
 
const socketPort = 3000;
const proxyPort = 4000;

// Start Socket Server
const socket = require("./socketServer");
socket.run(socketPort)

// Start your server
const proxy = mockttp.getLocal();
const rule = {
    matchers: [new mockttp.matchers.WildcardMatcher()],
    handler: new mockttp.handlers.PassThroughHandler({
        forwarding: {
            targetHost: `http://localhost:${socketPort}`,
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