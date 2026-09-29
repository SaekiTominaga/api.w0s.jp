import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { env } from '@w0s/env-value-type';
import app from '../app.ts';

const origin = env('REFERRER_ORIGINS', 'string[]').at(0)!;

await test('Content-Type mismatch', async () => {
	const res = await app.request('/report/referrer', {
		method: 'post',
		headers: new Headers({ Origin: origin }),
	});

	assert.equal(res.status, 400);
	assert.equal((await res.json()).message, 'Either there are no parameters, or the `Content-Type` is not `application/json`');
});

await test('no parameter', async () => {
	const res = await app.request('/report/referrer', {
		method: 'post',
		headers: new Headers({ Origin: origin, 'Content-Type': 'application/json' }),
		body: JSON.stringify({}),
	});

	assert.equal(res.status, 400);
	assert.equal((await res.json()).message, 'Either there are no parameters, or the `Content-Type` is not `application/json`');
});

await test('documentURL invalid', async () => {
	const res = await app.request('/report/referrer', {
		method: 'post',
		headers: new Headers({ Origin: origin, 'Content-Type': 'application/json' }),
		body: JSON.stringify({ documentURL: 123 }),
	});

	assert.equal(res.status, 400);
	assert.equal((await res.json()).message, 'The `documentURL` parameter is invalid');
});

await test('referrer undefined', async () => {
	const res = await app.request('/report/referrer', {
		method: 'post',
		headers: new Headers({ Origin: origin, 'Content-Type': 'application/json' }),
		body: JSON.stringify({ documentURL: 'xxx' }),
	});

	assert.equal(res.status, 400);
	assert.equal((await res.json()).message, 'The `referrer` parameter is invalid');
});
