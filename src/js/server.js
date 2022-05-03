/* eslint-disable no-case-declarations */
const http = require('http');
const Koa = require('koa');
const app = new Koa();
const WS = require('ws');

const users = [];
const chat = [];

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }
  const headers = { 'Access-Control-Allow-Origin': '*', };
  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }
  if (ctx.request.get('Access-Control-Request-Method')) {
      ctx.response.set({
        ...headers,
        'Access-Control-Allow-Methods': 'GET, POST, PUD, DELETE, PATCH',
    });
    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }
    ctx.response.status = 204;
  }
});
  
const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
const wsServer = new WS.Server({ server });
wsServer.on('connection', (ws, req) => {
  const errCallback = (err) => {
    if (err) {
    // TODO: handle error
    }
  }
  ws.on('message', msg => {
    if (msg.includes('{')) {
      parseMessage(msg);
    } else {
      console.log(msg);
    }
    
    ws.send('response', errCallback);
  });
  ws.send('welcome', errCallback);
});
server.listen(port);

function parseMessage(msg) {
  const message = JSON.parse(msg);
  if (!chat.find((o) => o.id === message.id)) {
    chat.push(message);
  }
  // ws.send(msg);
  console.log(message);
}