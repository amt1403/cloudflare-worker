/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Retrieve identity information from headers
  const { cf } = request;
  const email = request.headers.get('cf-access-authenticated-user-email');
  const timestamp = new Date().toISOString();
  const country = cf.country.toLowerCase();
  
  let headers = [];
  for (const [key, value] of request.headers.entries()) {
    headers.push(`${key}: ${value}`);
  }

  // Create the headers string
  const headersString = headers.join('<br>');

  // response body
  let body;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/secure')) {
    const countryParam = url.pathname.split('/')[2];
    if (countryParam) {
      // Serve the country flag image
      const flagUrl = `https://iabdultahan.uk/${countryParam.toLowerCase()}.png`;
      body = `<img src="${flagUrl}" alt="${countryParam} flag">`;
      return new Response(body, {
        headers: { 'Content-Type': 'text/html' },
      });
    }
  }

    body = `
    ${email} authenticated at ${timestamp} from <a href="/secure/${country}">${country}</a>
  `;
  

  body = `
    ${email} authenticated at ${timestamp} from <a href="/secure/${country}">${country}</a><br><br>
    <strong>Request Headers:</strong><br>
    ${headersString}
  `;

  return new Response(body, {
    headers: { 'Content-Type': 'text/html' },
  });
}


