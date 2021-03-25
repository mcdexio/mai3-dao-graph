import { log, BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'
import { User } from '../generated/schema'

import { 
    DelegateChanged as DelegateChangedEvent,
} from '../generated/XMCB/xmcb'

import {
    BI_18,
    convertToDecimal,
    ADDRESS_ZERO,
    fetchUser,
} from './utils'

export function handleDelegateChanged(event: DelegateChangedEvent): void {
    let user = fetchUser(event.params.delegator)
    let toDelegate = fetchUser(event.params.toDelegate)
    user.delegatee = toDelegate.id
    user.save()
}