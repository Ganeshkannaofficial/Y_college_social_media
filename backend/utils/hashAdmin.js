const bcrypt = require('bcryptjs');

(async () => {
  const plainPassword = 'supersecurepassword'; // match your .env ADMIN_PASSWORD
  const hash = await bcrypt.hash(plainPassword, 10);
  console.log('Hashed Password:', hash);
})();

