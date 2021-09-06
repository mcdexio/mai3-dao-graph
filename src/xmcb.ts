import { 
    DelegateChanged as DelegateChangedEvent,
} from '../generated/XMCB/xmcb'

import {
    fetchUser,
} from './utils'

export function handleDelegateChanged(event: DelegateChangedEvent): void {
    let user = fetchUser(event.params.delegator)
    let toDelegate = fetchUser(event.params.toDelegate)
    user.delegatee = toDelegate.id
    user.save()
}