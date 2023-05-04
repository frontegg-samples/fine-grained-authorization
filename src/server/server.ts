import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { HeroContext } from './request';
import { AuthZOpaClient } from '@frontegg/authz-client';
import chalk from 'chalk';

function createServer(): Express {
	const app = express();
	app.use(bodyParser.json());

	const client: AuthZOpaClient = new AuthZOpaClient({ url: 'http://localhost:8182' });

	app.post('/', async (req, res) => {
		const context: HeroContext = req.body as HeroContext;
		if (!context) {
			res.status(400).send('No body');
			return;
		}

		try {
			const authz = await client.authorized(context.tenantId, {
				scope: 'Rent',
				subjectContext: { id: context.heroId },
				assetContext: { id: context.assetId }
			});

			if (authz.authorized) {
				res.status(200).send({
					message: `Hero ${context.heroId} can rent asset ${context.assetId}`,
					reasons: authz.rules
				});
			} else {
				res.status(403).send({
					message: `Hero ${context.heroId} can't rent asset ${context.assetId}`,
					reasons: authz.rules
				});
			}
		} catch (e) {
			res.status(500).send((e as Error).message);
		}
	});

	return app;
}

export function startServer(): void {
	const app = createServer();
	app.listen(3000, () =>
		console.log(chalk.greenBright('Server is up and running on port 3000 an frontegg-FGA enabled logic'))
	);
}
