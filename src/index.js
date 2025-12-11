/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import Environment from "./bootstrap/bootstrap";
import Authentication from "./authentication/auth";
import Signup from "./authentication/signup";

async function parseRequestFormBody(request) {
	const formData = await request.formData();
	const body = {};
	for (const entry of formData.entries()) {
		body[entry[0]] = entry[1];
	}
	return body;
}

export default {
	async fetch(request, env, ctx) {
		Environment.loadEnvironment(env);
		const url = new URL(request.url);
		console.log(`Receiving endpoint call: ${url.pathname}`);
		const body = await parseRequestFormBody(request);

		switch (url.pathname) {
			case '/api/login':
				console.log(`Attempting login`);
				const loginResults = await Authentication.attemptLogin(body.username, body.password);
				console.log(`Responding from login with: ${JSON.stringify(loginResults)}`);
				return Response.json(loginResults);

			case '/api/signup':
				console.log("Attempting signup");
				const signup = new Signup();
				const signupResult = await signup.attemptAccountCreation(body.username, body.password);
				return Response.json(loginResults);


			case '/message':
				console.log(`DB = ${Environment.instance.USER_FORUMS_DB}`);
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
