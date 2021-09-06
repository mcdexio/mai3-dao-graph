import { log, BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'
import { User, Dao } from '../generated/schema'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
    let bd = BigDecimal.fromString('1')
    for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
      bd = bd.times(BigDecimal.fromString('10'))
    }
    return bd
  }
  
export function convertToDecimal(amount: BigInt, decimals: BigInt): BigDecimal {
    if (decimals == ZERO_BI) {
        return amount.toBigDecimal()
    }
    return amount.toBigDecimal().div(exponentToBigDecimal(decimals))
}

export function fetchUser(address: Address): User {
    let user = User.load(address.toHexString())
    if (user === null) {
        user = new User(address.toHexString())
        user.save()
    }
    return user as User
}

export function fetchDao(): Dao {
    let dao = Dao.load("mcdexDao")
    if (dao === null) {
        dao = new Dao("mcdexDao")
        dao.proposalCount = 0
        dao.totalCapturedUSD = ZERO_BD
        dao.save()
    }
    return dao as Dao
}