import inquirer from 'inquirer';
import { Seeder } from './seeder';
import * as util from 'util';
import { AuthenticateApi } from './authenticate-api';
import chalk from 'chalk';

async function promptVendorCreds(): Promise<{ clientId: string; secret: string }> {
	const prompt = inquirer.createPromptModule();
	const clientIdAns = await prompt({
		type: 'input',
		name: 'clientId',
		message: 'Enter your Frontegg environment Client ID'
	});
	const apiKeyAns = await prompt({
		type: 'password',
		name: 'apiKey',
		message: 'Enter your Frontegg environment API Key'
	});
	return { clientId: clientIdAns.clientId, secret: apiKeyAns.apiKey };
}

export async function seed(): Promise<void> {
	const creds = await promptVendorCreds();
	const token = await AuthenticateApi.authenticate(creds);
	const seeder = new Seeder({ token: token });

	const res = await seeder.seed();
	chalk.green('Seed subjects, assets and policy created successfully!');
	console.log(util.inspect(res, { colors: true, depth: null }));
}
