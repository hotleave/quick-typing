import * as crypto from 'crypto'

const HASH_KEY = '3198f2e6892d5bdd0630505e20acfc849a12e03c5a1da4c5c41a180c44c67eeb85ef0bc6992d9b0c3926da22ebaa55346bcd76d8556321e044530eff3d868e2636514072'
const HASH_ALG = 'sha1'
const ENCODING = 'hex'

const hashKey = ((): number => {
  const keys = []
  const ivs = []
  const encrypteds = []
  const indices = HASH_KEY.substr(-8).split('').map(s => parseInt(s))
  for (let i = 0; i < indices.length; i++) {
    const s = indices[i]
    const segment = HASH_KEY.substr(i * 16, 16)
    if (s < 4) {
      keys[s] = segment
    } else if (s > 5) {
      encrypteds[s - 6] = segment
    } else {
      ivs[s - 4] = segment
    }
  }

  const decipher = crypto.createDecipheriv('aes-256-cbc',
    Buffer.from(keys.join(''), ENCODING),
    Buffer.from(ivs.join(''), ENCODING))

  decipher.update(encrypteds.join(''), ENCODING)
  const decrypted = decipher.final()

  return decrypted.readInt32BE(0)
})()

const sha1Hmac = (input: string): string => {
  const hmac = crypto.createHmac(HASH_ALG, hashKey.toFixed(0))
  const hash = hmac.update(input).digest(ENCODING)
  return hash.substr(-8)
}

const verify = (content: string, sign: string): boolean => {
  const matched = /^-----第(\d+)段-(\d+)Z-(.+)V--xc.sw.*$/.exec(sign)
  if (!matched) {
    return true
  }

  const id = matched[1]
  const count = matched[2]
  return content.length === parseInt(count) && sha1Hmac(`${content}-${id}`) === matched[3]
}

export const xcapi = {
  sha1Hmac,
  verify
}

export default xcapi
