const http = require('http');
const req = http.request({
  hostname: 'localhost', port: 3001, path: '/api/capsules', method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  let data = ''; res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'DATA:', data));
});
req.on('error', (e) => console.log('HTTP ERR', e.message));
req.write(JSON.stringify({
  senderName: 'Test', senderEmail: 'test@test.com', letter: 'Hello',
  recipientType: 'self', deliveryType: 'virtual', deliveryDate: '2026-10-10', deliveryTime: '12:00'
}));
req.end();
