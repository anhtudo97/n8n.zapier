import Crypt from 'cryptr'

const crypt = new Crypt(process.env.ENCRYPTION_KEY!)

export const encrypt = (text: string) => crypt.encrypt(text)
export const decrypt = (text: string) => crypt.decrypt(text)