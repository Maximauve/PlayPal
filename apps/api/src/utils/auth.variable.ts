import * as bcrypt from "bcrypt";

function hashPassword(plaintextPassword: string) {
  return bcrypt.hash(plaintextPassword, 10);
}

export default hashPassword;