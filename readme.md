# T.LY API Client

A Node.js client for the [T.LY URL Shortener](https://t.ly/) API. This package provides convenient methods to manage short links, OneLinks, UTM presets, QR codes, tags, and pixels through T.LY's API.

## Table of Contents

-   [Installation](#installation)
-   [Getting Started](#getting-started)
-   [Testing](#testing)
-   [Publishing](#publishing)
-   [API Reference](#api-reference)
    -   [Short Link Management](#short-link-management)
    -   [OneLink Management](#onelink-management)
    -   [UTM Preset Management](#utm-preset-management)
    -   [QR Code Management](#qr-code-management)
    -   [Pixel Management](#pixel-management)
    -   [Tag Management](#tag-management)
-   [Example](#example)
-   [License](#license)

## Installation

Install the package via [npm](https://www.npmjs.com/):

```
npm install tly-api
```

## Getting Started

1. **Obtain an API Token**: Sign up or log in to [T.LY](https://t.ly/settings#/api) and retrieve your API token from the T.LY dashboard.

2. **Initialize the Client**:

    ```js
    const TlyClient = require('tly-api');

    // Replace 'YOUR_API_TOKEN' with your actual T.LY API token.
    const tly = new TlyClient('YOUR_API_TOKEN');
    ```

3. **Use the Methods**: You can now call any of the available methods (short link creation, pixel management, tag management, etc.) on the `tly` instance.

## Testing

Run the test suite:

```bash
npm test
```

## Publishing

NPM does not allow publishing the same version twice. Before publishing, bump `package.json` version:

```bash
npm version patch --no-git-tag-version
npm publish
```

Use `minor` or `major` instead of `patch` when appropriate.

## API Reference

Below is a summary of the methods available on the `TlyClient` class. For detailed parameter structures, refer to the inline code comments.

### Short Link Management

-   **createShortLink(data)**
    Creates a new short link.
    _Example `data`:_

    ```js
    {
      long_url: 'https://example.com',
      short_id: 'customalias',
      domain: 't.ly',
      expire_at_datetime: '2025-12-31T23:59:59Z',
      expire_at_views: 1000,
      description: 'My short link',
      public_stats: false,
      password: 'optionalPassword',
      tags: [1, 2],
      pixels: [101, 102],
      meta: { 'title': 'Custom Title' }
    }
    ```

-   **getShortLink(shortUrl)**
    Retrieves a short link by its short URL (e.g., `t.ly/alias`).

-   **updateShortLink(data)**
    Updates an existing short link.
    _Important:_ `data` should include `short_url` along with any fields to update.

-   **deleteShortLink(data)**
    Deletes a short link.
    _Important:_ `data` must include the `short_url` you wish to delete.

-   **expandShortLink(data)**
    Retrieves the long URL behind a short URL.
    _Example `data`:_

    ```js
    {
      short_url: 't.ly/alias',
      password: 'ifProtected'
    }
    ```

-   **listShortLinks(params)**
    Retrieves a paginated list of short links.
    _Example `params`:_

    ```js
    {
      search: 'example',
      tag_ids: [1],
      pixel_ids: [101],
      start_date: '2025-01-01',
      end_date: '2025-01-31',
      domains: ['t.ly']
    }
    ```

-   **bulkShortenLinks(data)**
    Shortens multiple links at once.
    _Example `data`:_

    ```js
    {
      domain: 't.ly',
      links: [
        { long_url: 'https://site1.com' },
        { long_url: 'https://site2.com' }
      ],
      tags: [1, 2],
      pixels: [101, 102]
    }
    ```

-   **bulkUpdateLinks(data)**
    Updates multiple short links in a single request.

-   **getStats(shortUrl, params)**
    Retrieves analytics data for a short URL (`/api/v1/link/stats`).

-   **getLinkStats(shortUrl, params)**
    Alias of `getStats`.

### OneLink Management

-   **getOneLinkStats(shortUrl, params)**
    Retrieves OneLink analytics (`/api/v1/onelink/stats`).
    Optional params include `start_date` and `end_date`.

-   **deleteOneLinkStats(data)**
    Deletes OneLink stats (`/api/v1/onelink/stat`).
    `data` should include `short_url`.

-   **listOneLinks(params)**
    Lists OneLinks (`/api/v1/onelink/list`).
    Optional params include `page`.

### UTM Preset Management

-   **createUtmPreset(data)**
    Creates a UTM preset.

-   **listUtmPresets()**
    Lists UTM presets.

-   **getUtmPreset(id)**
    Retrieves one UTM preset by ID.

-   **updateUtmPreset(id, data)**
    Updates a UTM preset by ID.

-   **deleteUtmPreset(id)**
    Deletes a UTM preset by ID.

### QR Code Management

-   **getQrCode(params, config)**
    Gets a QR code (`/api/v1/link/qr-code`).
    Use params like `short_url`, `output`, and `format`.

-   **updateQrCode(data)**
    Updates QR code options (`/api/v1/link/qr-code`).

### Pixel Management

-   **createPixel(data)**
    Creates a new pixel.

-   **listPixels()**
    Retrieves a list of all pixels.

-   **getPixel(id)**
    Retrieves a single pixel by its ID.

-   **updatePixel(id, data)**
    Updates the pixel's attributes.

-   **deletePixel(id)**
    Deletes the pixel by its ID.

### Tag Management

-   **listTags()**
    Retrieves a list of all tags.

-   **createTag(data)**
    Creates a new tag.
    _Example `data`:_

    ```js
    {
    	tag: 'Marketing';
    }
    ```

-   **getTag(id)**
    Retrieves a single tag by its ID.

-   **updateTag(id, data)**
    Updates the tag’s attributes.
    _Example `data`:_

    ```js
    {
    	tag: 'New Tag Name';
    }
    ```

-   **deleteTag(id)**
    Deletes the tag by its ID.

## Example

Below is a simple usage example demonstrating how to create and retrieve a short link:

```js
const TlyClient = require('tly-api');

// Replace 'YOUR_API_TOKEN' with your actual T.LY API token.
const tly = new TlyClient('YOUR_API_TOKEN');

async function runExample() {
	try {
		// Create a new short link
		const createdLink = await tly.createShortLink({
			long_url: 'https://www.example.com',
			description: 'Example Link',
		});
		console.log('Created Short Link:', createdLink);

		// Retrieve the details of the created short link
		const shortUrl = createdLink.short_url;
		const linkInfo = await tly.getShortLink(shortUrl);
		console.log('Retrieved Link Info:', linkInfo);
	} catch (error) {
		console.error('Error:', error.response ? error.response.data : error.message);
	}
}

runExample();
```

## License

This package is licensed under the MIT License.
