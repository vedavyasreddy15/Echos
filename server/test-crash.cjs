const { spawn } = require('child_process');
const server = spawn('node', ['index.js']);
server.stdout.on('data', d => console.log('OUT:', d.toString()));
server.stderr.on('data', d => console.log('ERR:', d.toString()));

setTimeout(() => {
  const http = require('http');
  const req = http.request({
    hostname: 'localhost', port: 3001, path: '/api/capsules', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, (res) => {
    res.on('data', () => {});
    res.on('end', () => server.kill());
  });
  req.on('error', (e) => { console.log('HTTP ERR', e.message); server.kill(); });
  req.write(JSON.stringify({
    senderName: 'Test', senderEmail: 'test@test.com', letter: 'Hello',
    recipientType: 'self', deliveryType: 'virtual', deliveryDate: '2026-10-10'
  }));
  req.end();
}, 2000);
