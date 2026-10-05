import bcrypt from "bcrypt"

const password = "Admin@135"

const hash = await bcrypt.hash(password, 10)

console.log("Password:", password)
console.log("Bcrypt hash: ", hash)