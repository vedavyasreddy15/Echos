import http from 'http';
const req = http.request({
  hostname: 'localhost', port: 3001, path: '/api/capsules', method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  let data = ''; res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(res.statusCode, data));
});
req.write(JSON.stringify({
  senderName: 'Test', senderEmail: 'test@test.com', letter: 'Hello',
  recipientType: 'self', deliveryType: 'virtual', deliveryDate: '2026-10-10'
}));
req.end();
