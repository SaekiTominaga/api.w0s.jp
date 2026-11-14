import ejs from 'ejs';
import { Hono } from 'hono';
import { env } from '@w0s/env-value-type';
import type { Variables } from '../app.ts';
import Mail from '../util/Mail.ts';
import { json as jsonValidator } from '../validator/domEvent.ts';

/* ===== DOM イベント検知 ===== */

export const domEventApp = new Hono<{ Variables: Variables }>().post(jsonValidator, async (context) => {
	const { req } = context;

	const { documentURL, eventType } = req.valid('json');

	const ua = req.header('User-Agent');

	/* メール通知 */
	const html = await ejs.renderFile(`${env('ROOT')}/${env('TEMPLATE_DIR')}/mail/domEvent.ejs`, {
		documentURL: documentURL,
		eventType: eventType,
		ua: ua,
	});

	await new Mail().sendHtml(env('DOMEVENT_MAIL_TITLE'), html);

	return new Response(undefined, {
		status: 204,
	});
});
