import { createClient } from "redis"
import { promisify } from "util"

const redisClient = createClient()

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

export const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2025_${productId}`
    const retryTimes = 10;
    const expireTime = 3000

    for (let i = 0; i < retryTimes; i++) {
        const result = await setnxAsync(key, expireTime)
        if (result === 1) {
            // thao tác với inventory
            
            return key
        } else {
            await new Promise(resolve => setTimeout(resolve, 50))
        }
    }
}

export const releaseLock = async keyLock => {
    const delAsync = promisify(redisClient.del).bind(redisClient)
    return await delAsync(keyLock)
}