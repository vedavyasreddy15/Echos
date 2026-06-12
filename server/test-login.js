fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'vedavyasreddybommineni@gmail.com', password: 'masterpassword123' })
}).then(async res => console.log('STATUS:', res.status, await res.text()))
  .catch(err => console.log('ERROR:', err));
