const fetch = require('node-fetch');

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function restlog(obj: any) {
	await fetch('https://restlogs.deno.dev', {
		method: 'POST',
		body: JSON.stringify(obj),
		headers: {
			'Content-Type': 'application/json',
		}
	});
}
