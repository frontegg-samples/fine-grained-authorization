import {IdResponse} from "./id-response";
import axios, {AxiosResponse} from "axios";

export class PolicyApis {
	private readonly baseUrl: string;
	private readonly token: string | undefined;

	constructor(config: { baseUrl?: string, token: string }) {
		this.baseUrl = config?.baseUrl ?? 'https://api.frontegg.com';
		this.token = config?.token;
	}

	public async createSubject(tenantId: string, subject: Record<string, unknown>): Promise<IdResponse> { // TODO create openapi client for this
		const res: AxiosResponse<IdResponse> = await axios.post(
			`${this.baseUrl}/policy/resources/subjects/v1`,
			subject,
			{
				headers: {
					Authorization: `Bearer ${this.token}`,
					'frontegg-tenant-id': tenantId
				}
			}
		);
		return res.data;
	}

	public async createAsset(tenantId: string, asset: Record<string, unknown>, parentAssetId?: string | undefined): Promise<IdResponse> { // TODO create openapi client for this
		const res: AxiosResponse<IdResponse> = await axios.post(
			`${this.baseUrl}/policy/resources/assets/v1${parentAssetId ? `/${parentAssetId}` : ''}`,
			asset,
			{
				headers: {
					Authorization: `Bearer ${this.token}`,
					'frontegg-tenant-id': tenantId
				}
			}
		);
		return res.data;
	}

	public async createPolicy(tenantId: string, policy: Record<string, unknown>): Promise<IdResponse> { // TODO create openapi client for this
		const res: AxiosResponse<IdResponse> = await axios.post(
			`${this.baseUrl}/policy/resources/policies/v1`,
			policy,
			{
				headers: {
					Authorization: `Bearer ${this.token}`,
					'frontegg-tenant-id': tenantId
				}
			}
		);
		return res.data;
	}

	public async setMainPolicy(tenantId: string, policyId: string, main: boolean = true): Promise<void> { // TODO create openapi client for this
		const res: AxiosResponse<IdResponse> = await axios.patch(
			`${this.baseUrl}/policy/resources/policies/v1/${policyId}/main`,
			{mainPolicy: main}, // TODO from openapi types
			{
				headers: {
					Authorization: `Bearer ${this.token}`,
					'frontegg-tenant-id': tenantId
				}
			}
		);
	}

	public async createRule(tenantId: string, policyId: string, rule: Record<string, unknown>): Promise<IdResponse> { // TODO create openapi client for this
		const res: AxiosResponse<IdResponse> = await axios.post(
			`${this.baseUrl}/policy/resources/policies/v1/${policyId}/rules`,
			rule,
			{
				headers: {
					Authorization: `Bearer ${this.token}`,
					'frontegg-tenant-id': tenantId
				}
			}
		);
		return res.data;
	}
}
