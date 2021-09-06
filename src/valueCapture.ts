import { 
    SendValueCaptureNotification as SendValueCaptureNotificationEvent,
} from '../generated/ValueCapture/ValueCapture'

import {
    BI_18,
    convertToDecimal,
    fetchDao,
} from './utils'

export function handleSendValueCaptureNotification(event: SendValueCaptureNotificationEvent): void {
    let dao = fetchDao()
    dao.totalCapturedUSD = convertToDecimal(event.params.totalCapturedUSD, BI_18)
    dao.save()
}