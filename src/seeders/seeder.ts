import { PolicyApis } from './policy-apis';
import { v4 as uuid } from 'uuid';
import { AxiosError } from 'axios';

export class Seeder {
	private readonly api: PolicyApis;

	constructor(config: { baseUrl?: string; token: string }) {
		this.api = new PolicyApis(config);
	}

	public async seed() {
		try {
			const tenantId: string = uuid();
			// subjects
			const batmanData = {
				subjectId: 'Batman',
				subjectType: 'User',
				attributes: {
					name: 'Bruce Wayne',
					department: 'Gotham',
					capeColor: 'black',
					job: 'hero'
				}
			};
			const supermanData = {
				subjectId: 'Superman',
				subjectType: 'User',
				attributes: {
					name: 'Clark Kent',
					department: 'Metropolis',
					capeColor: 'red',
					job: 'hero'
				}
			};

			const batman = await this.api.createSubject(tenantId, batmanData);
			const superman = await this.api.createSubject(tenantId, supermanData);

			// assets
			const topLevel = await this.api.createAsset(tenantId, {
				attributes: { name: 'Super heroes fortress list' }
			});
			const batcave = await this.api.createAsset(tenantId, { attributes: { name: 'Bat cave' } }, topLevel.id);
			const fortressOfSolitude = await this.api.createAsset(
				tenantId,
				{ attributes: { name: 'Fortress of Solitude' } },
				topLevel.id
			);
			const generalHQ = await this.api.createAsset(tenantId, { attributes: { name: 'HQ for HIRE' } }, batcave.id);

			// policy
			const policy = await this.api.createPolicy(tenantId, {
				name: 'Superheroes policy',
				description: 'Who can access super headquarters',
				allowByDefault: false
			});
			const hierarchyRule = await this.api.createRule(tenantId, policy.id, {
				name: 'Available for rent',
				description: 'All heroes can rent new houses',
				assets: { hierarchical: true, assetIds: [topLevel.id] },
				subjects: {
					attributes: [{ attribute: 'job', op: 'equal', value: 'hero' }]
				},
				scopes: ['Rent']
			});
			const supermanRent = await this.api.createRule(tenantId, policy.id, {
				name: 'superman-rent',
				description: 'Only Superman can access the fortress of solitude',
				allow: false,
				assets: { assetIds: [fortressOfSolitude.id] },
				subjects: {
					attributes: [{ attribute: 'subjectId', op: 'not_equal', value: 'Superman' }]
				},
				scopes: ['Rent']
			});
			const batmanRent = await this.api.createRule(tenantId, policy.id, {
				name: 'batman-rent',
				description: 'Only Batman can access the Bat cave',
				allow: false,
				assets: { assetIds: [batcave.id] },
				subjects: {
					attributes: [{ attribute: 'subjectId', op: 'not_equal', value: 'Batman' }]
				},
				scopes: ['Rent']
			});

			// set to main policy
			await this.api.setMainPolicy(tenantId, policy.id, true);

			return {
				tenantId,

				supermanSubjectId: superman.id,
				batmanSubjectId: batman.id,

				topLevelAssetId: topLevel.id,
				batcaveAssetId: batcave.id,
				fortressOfSolitudeAssetId: fortressOfSolitude.id,
				generalHQAssetId: generalHQ.id,

				policyId: policy.id
			};
		} catch (e) {
			if (e instanceof AxiosError) {
				console.error(`Request failed with status code ${e.status}: ${e.response?.data}`);
			}

			throw e;
		}
	}
}
