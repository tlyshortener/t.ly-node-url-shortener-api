const axios = require('axios');

class TlyClient {
	/**
	 * Creates an instance of TlyClient.
	 * @param {string} apiToken - Your T.ly API token.
	 * @param {string} [baseURL='https://api.t.ly'] - The base URL for the API.
	 */
	constructor(apiToken, baseURL = 'https://api.t.ly') {
		if (!apiToken) {
			throw new Error('API token is required');
		}
		this.apiToken = apiToken;
		this.client = axios.create({
			baseURL,
			headers: {
				Authorization: `Bearer ${apiToken}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
	}

	// ===== Pixel Management =====

	async createPixel(data) {
		// data: { name, pixel_id, pixel_type }
		const response = await this.client.post('/api/v1/link/pixel', data);
		return response.data;
	}

	async listPixels() {
		const response = await this.client.get('/api/v1/link/pixel');
		return response.data;
	}

	async getPixel(id) {
		const response = await this.client.get(`/api/v1/link/pixel/${id}`);
		return response.data;
	}

	async updatePixel(id, data) {
		// data: { id, name, pixel_id, pixel_type }
		const response = await this.client.put(`/api/v1/link/pixel/${id}`, data);
		return response.data;
	}

	async deletePixel(id) {
		const response = await this.client.delete(`/api/v1/link/pixel/${id}`);
		return response.data;
	}

	// ===== Short Link Management =====

	async createShortLink(data) {
		// data: { long_url, short_id, domain, expire_at_datetime, expire_at_views, description, public_stats, password, tags, pixels, meta }
		const response = await this.client.post('/api/v1/link/shorten', data);
		return response.data;
	}

	async getShortLink(shortUrl) {
		const response = await this.client.get('/api/v1/link', {
			params: { short_url: shortUrl },
		});
		return response.data;
	}

	async updateShortLink(data) {
		// data should contain short_url along with the fields to update.
		const response = await this.client.put('/api/v1/link', data);
		return response.data;
	}

	async deleteShortLink(data) {
		// data: { short_url }
		// axios.delete accepts a config object with data when the API requires a request body.
		const response = await this.client.delete('/api/v1/link', { data });
		return response.data;
	}

	async expandShortLink(data) {
		// data: { short_url, password (optional) }
		const response = await this.client.post('/api/v1/link/expand', data);
		return response.data;
	}

	async listShortLinks(params = {}) {
		// params: { search, tag_ids, pixel_ids, start_date, end_date, domains }
		const response = await this.client.get('/api/v1/link/list', { params });
		return response.data;
	}

	async bulkShortenLinks(data) {
		// data: { domain, links, tags, pixels }
		const response = await this.client.post('/api/v1/link/bulk', data);
		return response.data;
	}

	async bulkUpdateLinks(data) {
		// data: { links, tags, pixels }
		const response = await this.client.post('/api/v1/link/bulk/update', data);
		return response.data;
	}

	async getStats(shortUrl, params = {}) {
		const response = await this.client.get('/api/v1/link/stats', {
			params: {
				short_url: shortUrl,
				...params,
			},
		});
		return response.data;
	}

	// ===== OneLink Management =====

	async getOneLinkStats(shortUrl, params = {}) {
		const response = await this.client.get('/api/v1/onelink/stats', {
			params: {
				short_url: shortUrl,
				...params,
			},
		});
		return response.data;
	}

	async deleteOneLinkStats(data) {
		// data: { short_url }
		const response = await this.client.delete('/api/v1/onelink/stat', { data });
		return response.data;
	}

	async listOneLinks(params = {}) {
		const response = await this.client.get('/api/v1/onelink/list', { params });
		return response.data;
	}

	// ===== UTM Preset Management =====

	async createUtmPreset(data) {
		// data: { name, source, medium, campaign, content, term }
		const response = await this.client.post('/api/v1/link/utm-preset', data);
		return response.data;
	}

	async listUtmPresets() {
		const response = await this.client.get('/api/v1/link/utm-preset');
		return response.data;
	}

	async getUtmPreset(id) {
		const response = await this.client.get(`/api/v1/link/utm-preset/${id}`);
		return response.data;
	}

	async updateUtmPreset(id, data) {
		// data: { name, source, medium, campaign, content, term }
		const response = await this.client.put(`/api/v1/link/utm-preset/${id}`, data);
		return response.data;
	}

	async deleteUtmPreset(id) {
		const response = await this.client.delete(`/api/v1/link/utm-preset/${id}`);
		return response.data;
	}

	// ===== QR Code Management =====

	async getQrCode(params = {}, config = {}) {
		const response = await this.client.get('/api/v1/link/qr-code', {
			...config,
			params,
		});
		return response.data;
	}

	async updateQrCode(data) {
		// data: { short_url, image, background_color, corner_dots_color, dots_color, dots_style, corner_style }
		const response = await this.client.put('/api/v1/link/qr-code', data);
		return response.data;
	}

	async getLinkStats(shortUrl, params = {}) {
		const response = await this.client.get('/api/v1/link/stats', {
			params: {
				short_url: shortUrl,
				...params,
			},
		});
		return response.data;
	}

	// ===== Tag Management =====

	async listTags() {
		const response = await this.client.get('/api/v1/link/tag');
		return response.data;
	}

	async createTag(data) {
		// data: { tag }
		const response = await this.client.post('/api/v1/link/tag', data);
		return response.data;
	}

	async getTag(id) {
		const response = await this.client.get(`/api/v1/link/tag/${id}`);
		return response.data;
	}

	async updateTag(id, data) {
		// data: { tag }
		const response = await this.client.put(`/api/v1/link/tag/${id}`, data);
		return response.data;
	}

	async deleteTag(id) {
		const response = await this.client.delete(`/api/v1/link/tag/${id}`);
		return response.data;
	}
}

module.exports = TlyClient;
