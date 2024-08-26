// worker.js (Cloudflare Worker Proxy)

// Replace with your Cloudflare Workers KV Namespace ID
const KV_NAMESPACE_ID = "8728cdbf846f4997aed6fa362229fa37";
const YOUR_ACCOUNT_ID = "11642e327b5748ad7e2e842d5e8babb9";
const YOUR_API_TOKEN = "C570bfWHzaK94KnQE7jETosclqKV2PK5s3CTbxWX";

export default {
    async fetch(request, env) {
        // Handle CORS preflight requests
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                }
            });
        }

        if (request.method === 'POST' && request.url.includes('/api/store')) {
            try {
                const { key, value } = await request.json();
                await env.USER_CREDENTIALS.put(key, value);
                return new Response('Credential stored successfully!', {
                    status: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    }
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: 'An error occurred while storing the credential.' }), {
                    status: 500,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    }
                });
            }
        } else {
            return new Response('Invalid request', {
                status: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                }
            });
        }
    }
};