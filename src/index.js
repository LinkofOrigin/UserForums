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
import DBInstance from "./database/db";

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
		let body = request;

		switch (url.pathname) {
			case '/api/login':
				console.log(`Attempting login`);
				body = await parseRequestFormBody(request);
				const loginSession = await Authentication.attemptLogin(body.username, body.password);
				console.log(`Responding from login with: ${JSON.stringify(loginSession)}`);
				const loginResponseData = {
					loginSession: loginSession,
				};
				const loginResponseOptions = {
					headers: new Headers({
						'Set-Cookie': `session=${loginSession.token}; path=/; HttpOnly; Secure;`
					}),
				};
				const loginResponse = Response.json(loginResponseData, loginResponseOptions);
				console.log(`Login response: ${JSON.stringify(loginResponse)}`);
				return loginResponse;

			case '/api/signup':
				console.log("Attempting signup");
				body = await parseRequestFormBody(request);
				const signup = new Signup();
				const signupResult = await signup.attemptAccountCreation(body.username, body.password);
				console.log("Successfully signed up new user! Attempting immediate login...");

				// Successful signup, now login
				const signupSession = await Authentication.attemptLogin(body.username, body.password);
				const signupResponse = {
					data: {
						loginSession: signupSession,
					},
					// headers: new Headers({
					// 	'Set-Cookie': `session=${sessionToken}`
					// }),
				};
				return Response.json(signupResponse);


			case '/message':
				console.log(`DB = ${Environment.instance.USER_FORUMS_DB}`);
				// body = await request.body();
				// If you did not use `DB` as your binding name, change it here
				const messageResult = await DBInstance.select('users');
				console.log("Returning message data");
				return Response.json(messageResult);

			case '/random':
				return new Response(crypto.randomUUID());

			default:
				return new Response('Not Found', { status: 404 });
		}
	},
};
