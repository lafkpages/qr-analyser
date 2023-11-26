import calendar from './calendar.qr?raw';
import wikipedia from './wikipedia.qr?raw';
import wifi from './wifi.qr?raw';

const qrs = { calendar, wikipedia, wifi };

export default qrs;

export const qrIds = Object.keys(qrs) as (keyof typeof qrs)[];
export type QrId = (typeof qrIds)[number];

export function validateQrId(qrId: string) {
	if (qrIds.includes(qrId as any)) {
		return qrId as QrId;
	}
	return qrIds[0];
}
