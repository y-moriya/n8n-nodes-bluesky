import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class Bluesky implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Bluesky',
		name: 'bluesky',
		icon: 'file:bluesky.svg',
		group: ['transform'],
		version: 1,
		description: 'Bluesky API',
		defaults: {
			name: 'Bluesky',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'blueskyApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://bsky.social/xrpc',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'com.atproto.repo',
						value: 'comAtprotoRepo',
					},
					{
						name: 'app.bsky.feed',
						value: 'appBskyFeed',
					},
					{
						name: 'app.bsky.actor',
						value: 'appBskyActor',
					},
					{
						name: 'app.bsky.graph',
						value: 'appBskyGraph',
					},
					{
						name: 'com.atproto.server',
						value: 'comAtprotoServer',
					},
				],
				default: 'comAtprotoRepo',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['comAtprotoRepo'],
					}
				},
				options: [
					{
						name: 'Post',
						value: 'post',
						description: 'Post a new record',
						action: 'Post',
						routing: {
							request: {
								method: 'POST',
								url: '/com.atproto.repo.createRecord',
								body: {
									repo: '={{$parameter["repo"]}}',
									collection: 'app.bsky.feed.post',
									record: {
										text: '={{$parameter["text"]}}',
										createdAt: `${new Date().toISOString()}`,
									},
								},
							},
						},
					},
				],
				default: 'post',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['appBskyFeed'],
					}
				},
				options: [
					{
						name: 'Get Feed',
						value: 'getFeed',
						description: 'Get posts from a feed',
						action: 'Get Feed',
						routing: {
							request: {
								method: 'GET',
								url: '/app.bsky.feed.getFeed',
								qs: {
									feed: '={{$parameter["feed"]}}',
									limit: '={{$parameter["limit50"]}}',
									cursor: '={{$parameter["cursor"]}}',
								},
							},
						},
					},
					{
						name: 'Get Author Feed',
						value: 'getAuthorFeed',
						description: 'Get post and reposts by the author',
						action: 'Get Author Feed',
						routing: {
							request: {
								method: 'GET',
								url: '/app.bsky.feed.getAuthorFeed',
								qs: {
									actor: '={{$parameter["actor"]}}',
									limit: '={{$parameter["limit50"]}}',
									cursor: '={{$parameter["cursor"]}}',
									filter: '={{$parameter["filter"]}}',
								},
							},
						},
					},
					{
						name: 'Get Timeline',
						value: 'getTimeline',
						description:
							"Get a view of the requesting account's home timeline. This is expected to be some form of reverse-chronological feed.",
						action: 'Get Timeline',
						routing: {
							request: {
								method: 'GET',
								url: '/app.bsky.feed.getTimeline',
								qs: {
									limit: '={{$parameter["limit50"]}}',
									cursor: '={{$parameter["cursor"]}}',
								},
							},
						},
					},
					{
						name: 'Get List Feed',
						value: 'getListFeed',
						description:
							'Get a feed of recent posts from a list (posts and reposts from any actors on the list). Does not require auth.',
						action: 'Get List Feed',
						routing: {
							request: {
								method: 'GET',
								url: '/app.bsky.feed.getListFeed',
								qs: {
									list: '={{$parameter["list"]}}',
									limit: '={{$parameter["limit50"]}}',
									cursor: '={{$parameter["cursor"]}}',
								},
							},
						},
					},
					{
						name: 'Search Posts',
						value: 'searchPosts',
						description: 'Find posts matching search criteria, returning views of those posts.',
						action: 'Search Posts',
						routing: {
							request: {
								method: 'GET',
								url: '/app.bsky.feed.searchPosts',
								qs: {
									q: '={{$parameter["query"]}}',
									limit: '={{$parameter["limit25"]}}',
									cursor: '={{$parameter["cursor"]}}',
								},
							},
						},
					},
				],
				default: 'getFeed',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['appBskyActor'],
					}
				},
				options: [
					{
						name: 'Get Profile',
						value: 'getProfile',
						description:
							'Get detailed profile view of an actor. Does not require auth, but contains relevant metadata with auth.',
						action: 'Get Profile',
						routing: {
							request: {
								method: 'GET',
								url: '/app.bsky.actor.getProfile',
								qs: {
									actor: '={{$parameter["repo"]}}',
								},
							},
						},
					},
				],
				default: 'getProfile',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['appBskyGraph'],
					}
				},
				options: [
					{
						name: 'Get Lists',
						value: 'getLists',
						description:
							'Enumerates the lists created by a specified account (actor).',
						action: 'Get Lists',
						routing: {
							request: {
								method: 'GET',
								url: '/app.bsky.graph.getLists',
								qs: {
									actor: '={{$parameter["repo"]}}',
									limit: '={{$parameter["limit50"]}}',
									cursor: '={{$parameter["cursor"]}}',
								},
							},
						},
					},
				],
				default: 'getLists',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['comAtprotoServer'],
					}
				},
				options: [
					{
						name: 'Delete Session',
						value: 'deleteSession',
						description:
							'Delete the current session. Requires auth.',
						action: 'Delete Session',
						routing: {
							request: {
								method: 'POST',
								url: '/com.atproto.server.deleteSession',
							},
						},
					},
				],
				default: 'deleteSession',
			},
			{
				displayName: 'repo',
				name: 'repo',
				type: 'string',
				required: true,
				default: '',
				description: 'The handle or DID of the repo (aka, current account).',
				placeholder: 'repo',
				displayOptions: {
					show: {
						operation: ['post', 'getProfile', 'getLists'],
					},
				},
			},
			{
				displayName: 'Message',
				name: 'text',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'The text to post.',
				displayOptions: {
					show: {
						operation: ['post'],
					},
				},
				typeOptions: {
					rows: 2,
				},
			},
			{
				displayName: 'feed',
				name: 'feed',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'at-uri',
				displayOptions: {
					show: {
						operation: ['getFeed'],
					},
				},
			},
			{
				displayName: 'list',
				name: 'list',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'at-uri',
				displayOptions: {
					show: {
						operation: ['getListFeed'],
					},
				},
			},
			{
				displayName: 'limit',
				name: 'limit50',
				type: 'number',
				default: '50',
				placeholder: '',
				displayOptions: {
					show: {
						operation: ['getFeed', 'getAuthorFeed', 'getLists'],
					},
				},
				description: 'The number of records to return, default is 50, >=1 and <= 100',
			},
			{
				displayName: 'limit',
				name: 'limit25',
				type: 'number',
				default: '25',
				placeholder: '',
				displayOptions: {
					show: {
						operation: ['searchPosts'],
					},
				},
				description: 'The number of records to return, default is 25, >=1 and <= 100',
			},
			{
				displayName: 'actor',
				name: 'actor',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'actor',
				displayOptions: {
					show: {
						operation: ['getAuthorFeed'],
					},
				},
			},
			{
				displayName: 'cursor',
				name: 'cursor',
				type: 'string',
				default: '',
				placeholder: 'cursor',
				displayOptions: {
					show: {
						operation: [
							'getFeed',
							'getAuthorFeed',
							'getTimeline',
							'getListFeed',
							'searchPosts',
							'getLists',
						],
					},
				},
			},
			{
				displayName: 'filter',
				name: 'filter',
				type: 'options',
				options: [
					{
						name: 'posts_with_replies',
						value: 'posts_with_replies',
					},
					{
						name: 'posts_no_replies',
						value: 'posts_no_replies',
					},
					{
						name: 'posts_with_media',
						value: 'posts_with_media',
					},
					{
						name: 'posts_and_author_threads',
						value: 'posts_and_author_threads',
					},
				],
				default: 'posts_with_replies',
				displayOptions: {
					show: {
						operation: [
							'getAuthorFeed',
						],
					},
				},
				description: 'The number of records to return, default is 50, >=1 and <= 100',
			},
			{
				displayName: 'query',
				name: 'query',
				type: 'string',
				default: '',
				required: true,
				placeholder: '',
				description:
					'Search query string; syntax, phrase, boolean, and faceting is unspecified, but Lucene query syntax is recommended.',
				displayOptions: {
					show: {
						operation: ['searchPosts'],
					},
				},
			},
		],
	};
}
