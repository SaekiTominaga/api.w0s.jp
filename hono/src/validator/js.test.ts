import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { env } from '@w0s/env-value-type';
import app from '../app.ts';

const origin = env('JS_ALLOW_ORIGINS', 'string[]').at(0)!;

await test('Content-Type mismatch', async () => {
	const res = await app.request('/report/js', {
		method: 'post',
		headers: new Headers({ Origin: origin }),
	});

	assert.equal(res.status, 400);
	assert.equal((await res.json()).message, 'Either there are no parameters, or the `Content-Type` is not `application/json`');
});

await test('no parameter', async () => {
	const res = await app.request('/report/js', {
		method: 'post',
		headers: new Headers({ Origin: origin, 'Content-Type': 'application/json' }),
		body: JSON.stringify({}),
	});

	assert.equal(res.status, 400);
	assert.equal((await res.json()).message, 'Either there are no parameters, or the `Content-Type` is not `application/json`');
});

await test('documentURL invalid', async () => {
	const res = await app.request('/report/js', {
		method: 'post',
		headers: new Headers({ Origin: origin, 'Content-Type': 'application/json' }),
		body: JSON.stringify({ documentURL: 123 }),
	});

	assert.equal(res.status, 400);
	assert.equal((await res.json()).message, 'The `documentURL` parameter is invalid');
});

await test('message undefined', async () => {
	const res = await app.request('/report/js', {
		method: 'post',
		headers: new Headers({ Origin: origin, 'Content-Type': 'application/json' }),
		body: JSON.stringify({ documentURL: 'xxx' }),
	});

	assert.equal(res.status, 400);
	assert.equal((await res.json()).message, 'The `message` parameter is invalid');
});

await test('jsURL undefined', async () => {
	const res = await app.request('/report/js', {
		method: 'post',
		headers: new Headers({ Origin: origin, 'Content-Type': 'application/json' }),
		body: JSON.stringify({ documentURL: 'xxx', message: 'xxx' }),
	});

	assert.equal(res.status, 400);
	assert.equal((await res.json()).message, 'The `jsURL` parameter is invalid');
});

await test('lineNumber undefined', async () => {
	const res = await app.request('/report/js', {
		method: 'post',
		headers: new Headers({ Origin: origin, 'Content-Type': 'application/json' }),
		body: JSON.stringify({ documentURL: 'xxx', message: 'xxx', jsURL: 'xxx' }),
	});

	assert.equal(res.status, 400);
	assert.equal((await res.json()).message, 'The `lineNumber` parameter is invalid');
});

await test('columnNumber undefined', async () => {
	const res = await app.request('/report/js', {
		method: 'post',
		headers: new Headers({ Origin: origin, 'Content-Type': 'application/json' }),
		body: JSON.stringify({ documentURL: 'xxx', message: 'xxx', jsURL: 'xxx', lineNumber: 1 }),
	});

	assert.equal(res.status, 400);
	assert.equal((await res.json()).message, 'The `columnNumber` parameter is invalid');
});
