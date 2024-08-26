export async function onRequestPost(context) {
    console.log('onRequestPost function called');
    try {
        const { key, value } = await context.request.json();
        console.log(`Attempting to store: key=${key}, value=${value}`);
        await context.env.USER_CREDENTIALS.put(key, value);
        console.log('Successfully stored in KV');
        return new Response('Credential stored successfully!', {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        });
    } catch (error) {
        console.error('Error storing credential:', error);
        return new Response(JSON.stringify({ error: 'An error occurred while storing the credential.', details: error.message }), {
            status: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        });
    }
}

export async function onRequestOptions() {
    console.log('onRequestOptions function called');
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    });
}