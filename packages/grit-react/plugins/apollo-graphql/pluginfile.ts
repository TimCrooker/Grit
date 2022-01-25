import { PluginConfig } from 'plugins'

const config: PluginConfig = {
	name: 'Apollo GraphQL',
	description:
		'Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL. Use it to fetch, cache, and modify application data, all while automatically updating your UI.',
	url: 'https://www.apollographql.com/docs/react/',
	extend: {
		_app: {
			import: [
				'import { initializeApollo } from "services/graphql";',
				'import { ApolloProvider } from "@apollo/client";',
			],
			inner: ['const apolloClient = initializeApollo();'],
			wrapper: [
				['<ApolloProvider client={apolloClient}>', '</ApolloProvider>'],
			],
		},
		testSetup: {
			import: ["import { MockedProvider } from '@apollo/client/testing';"],
			wrapper: [
				[
					'<MockedProvider mocks={[]} addTypename={false}>',
					'</MockedProvider>',
				],
			],
		},
	},
}

module.exports = config
