/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// export default {
// 	async fetch(request, env, ctx): Promise<Response> {
// 		return new Response('Hello World!');
// 	},
// } satisfies ExportedHandler<Env>;


import {PrismaClient} from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export interface Env{
	DATABASE_URL: string
}

export default {
		async fetch(
			request: Request,
			env: Env,
			ctx: ExecutionContext
		): Promise<Response>{
		const prisma= new PrismaClient({
		 datasourceUrl: env.DATABASE_URL
		}).$extends(withAccelerate())

	const response=	await prisma.log.create({
			data:{
				level:'Info',
				message:`${request.method} ${request.url}`,
				meta:{
					headers: JSON.stringify(request.headers),
				},

			},
		})
		
		console.log(JSON.stringify(response))
		return  Response.json(response)
	},
}