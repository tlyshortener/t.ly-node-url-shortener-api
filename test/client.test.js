const assert = require('node:assert/strict');
const test = require('node:test');
const axios = require('axios');
const TlyClient = require('../index');

function createClientWithRecorder() {
	const calls = [];

	const fakeHttpClient = {
		get: async (url, config) => {
			calls.push({ method: 'get', url, config });
			return { data: { ok: true, method: 'get', url, config } };
		},
		post: async (url, data, config) => {
			calls.push({ method: 'post', url, data, config });
			return { data: { ok: true, method: 'post', url, data, config } };
		},
		put: async (url, data, config) => {
			calls.push({ method: 'put', url, data, config });
			return { data: { ok: true, method: 'put', url, data, config } };
		},
		delete: async (url, config) => {
			calls.push({ method: 'delete', url, config });
			return { data: { ok: true, method: 'delete', url, config } };
		},
	};

	const originalCreate = axios.create;
	axios.create = () => fakeHttpClient;

	const client = new TlyClient('token');
	axios.create = originalCreate;

	return { client, calls };
}

test('constructor requires api token', () => {
	assert.throws(() => new TlyClient(), /API token is required/);
});

test('short link methods map to documented endpoints', async () => {
	const { client, calls } = createClientWithRecorder();

	await client.createShortLink({ long_url: 'https://example.com' });
	await client.getShortLink('https://t.ly/abc');
	await client.updateShortLink({ short_url: 'https://t.ly/abc', description: 'updated' });
	await client.deleteShortLink({ short_url: 'https://t.ly/abc' });
	await client.expandShortLink({ short_url: 'https://t.ly/abc', password: 'secret' });
	await client.listShortLinks({ search: 'example', page: 2 });
	await client.bulkShortenLinks({ links: [{ LongUrl: 'https://example.com' }] });
	await client.bulkUpdateLinks({ links: [{ ShortURL: 'https://t.ly/abc' }] });
	await client.getStats('https://t.ly/abc', { start_date: '2024-01-01', end_date: '2024-01-31' });
	await client.getLinkStats('https://t.ly/xyz');

	assert.deepEqual(calls.map((call) => `${call.method.toUpperCase()} ${call.url}`), [
		'POST /api/v1/link/shorten',
		'GET /api/v1/link',
		'PUT /api/v1/link',
		'DELETE /api/v1/link',
		'POST /api/v1/link/expand',
		'GET /api/v1/link/list',
		'POST /api/v1/link/bulk',
		'POST /api/v1/link/bulk/update',
		'GET /api/v1/link/stats',
		'GET /api/v1/link/stats',
	]);

	assert.deepEqual(calls[1].config, {
		params: { short_url: 'https://t.ly/abc' },
	});
	assert.deepEqual(calls[3].config, {
		data: { short_url: 'https://t.ly/abc' },
	});
	assert.deepEqual(calls[8].config, {
		params: {
			short_url: 'https://t.ly/abc',
			start_date: '2024-01-01',
			end_date: '2024-01-31',
		},
	});
	assert.deepEqual(calls[9].config, {
		params: {
			short_url: 'https://t.ly/xyz',
		},
	});
});

test('tag and pixel methods map to documented endpoints', async () => {
	const { client, calls } = createClientWithRecorder();

	await client.listTags();
	await client.createTag({ tag: 'news' });
	await client.getTag(123);
	await client.updateTag(123, { tag: 'updates' });
	await client.deleteTag(123);

	await client.createPixel({ name: 'pixel', pixel_id: 'abc', pixel_type: 'facebook' });
	await client.listPixels();
	await client.getPixel(55);
	await client.updatePixel(55, { name: 'pixel2', pixel_id: 'xyz', pixel_type: 'googleTagManager' });
	await client.deletePixel(55);

	assert.deepEqual(calls.map((call) => `${call.method.toUpperCase()} ${call.url}`), [
		'GET /api/v1/link/tag',
		'POST /api/v1/link/tag',
		'GET /api/v1/link/tag/123',
		'PUT /api/v1/link/tag/123',
		'DELETE /api/v1/link/tag/123',
		'POST /api/v1/link/pixel',
		'GET /api/v1/link/pixel',
		'GET /api/v1/link/pixel/55',
		'PUT /api/v1/link/pixel/55',
		'DELETE /api/v1/link/pixel/55',
	]);
});

test('onelink, utm preset, and qr methods map to documented endpoints', async () => {
	const { client, calls } = createClientWithRecorder();

	await client.getOneLinkStats('https://t.ly/one', { start_date: '2024-06-01', end_date: '2024-06-08' });
	await client.deleteOneLinkStats({ short_url: 'https://t.ly/one' });
	await client.listOneLinks({ page: 3 });

	await client.createUtmPreset({
		name: 'Newsletter Launch',
		source: 'newsletter',
		medium: 'email',
		campaign: 'fall_launch',
		content: 'hero-cta',
		term: 'running-shoes',
	});
	await client.listUtmPresets();
	await client.getUtmPreset(10);
	await client.updateUtmPreset(10, { name: 'Updated Preset' });
	await client.deleteUtmPreset(10);

	await client.getQrCode({
		short_url: 'https://t.ly/c55j',
		output: 'base64',
		format: 'eps',
	});
	await client.updateQrCode({
		short_url: 'https://t.ly/c55j',
		background_color: '#ffffff',
		dots_color: '#000000',
	});

	assert.deepEqual(calls.map((call) => `${call.method.toUpperCase()} ${call.url}`), [
		'GET /api/v1/onelink/stats',
		'DELETE /api/v1/onelink/stat',
		'GET /api/v1/onelink/list',
		'POST /api/v1/link/utm-preset',
		'GET /api/v1/link/utm-preset',
		'GET /api/v1/link/utm-preset/10',
		'PUT /api/v1/link/utm-preset/10',
		'DELETE /api/v1/link/utm-preset/10',
		'GET /api/v1/link/qr-code',
		'PUT /api/v1/link/qr-code',
	]);

	assert.deepEqual(calls[0].config, {
		params: {
			short_url: 'https://t.ly/one',
			start_date: '2024-06-01',
			end_date: '2024-06-08',
		},
	});
	assert.deepEqual(calls[1].config, {
		data: { short_url: 'https://t.ly/one' },
	});
	assert.deepEqual(calls[2].config, {
		params: { page: 3 },
	});
	assert.deepEqual(calls[8].config, {
		params: {
			short_url: 'https://t.ly/c55j',
			output: 'base64',
			format: 'eps',
		},
	});
});
