/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		console.log(`Test: ${url.pathname}`);
		switch (url.pathname) {
			case '/message':
				console.log(`DB = ${env.USER_FORUMS_DB}`);
				// If you did not use `DB` as your binding name, change it here
				const { results } = await env.USER_FORUMS_DB.prepare(
					`SELECT users.id, users.username, posts.title, posts.description
					FROM users
					JOIN posts ON posts.user_id = users.id
					WHERE users.id = ?`
				)
					.bind("1")
					.run();
				console.log("Returning message data");
				return Response.json(results);
			case '/random':
				return new Response(crypto.randomUUID());
			default:
				return new Response('Not Found', { status: 404 });
		}
	},
};
