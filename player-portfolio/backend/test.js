import bcrypt from 'bcryptjs';

async function test() {
  const match = await bcrypt.compare('1234567', '$2a$10$vwl5SH5HlAWYBxFpEMx3kOVpXTmyzt8KLDMj2CyOjaldpt/pz/5G6');
  console.log(match);
}

test();