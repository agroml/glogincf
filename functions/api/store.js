export async function onRequestPost(context) {
    try {
        const { key, value } = await context.request.json();
        await context.env.USER_CREDENTIALS.put(key, value);
        return new Response('', { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'An error occurred while storing the credential.' }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    });
}