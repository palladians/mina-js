import { remarkMermaid } from "@theguild/remark-mermaid";
import { defineConfig } from "vocs";

export default defineConfig({
	ogImageUrl:
		"https://vocs.dev/api/og?logo=%logo&title=%title&description=%description",
	title: "MinaJS",
	description: "The TypeScript interface for Mina Protocol.",
	rootDir: "src",
	logoUrl: {
		light: "/logo-inverted.svg",
		dark: "/logo.svg",
	},
	iconUrl: "/logo-round.svg",
	font: {
		google: "DM Sans",
	},
	theme: {
		accentColor: {
			light: "#907aa9",
			dark: "#c4a7e7",
		},
		variables: {
			color: {
				background: {
					light: "#fffaf3",
					dark: "#1f1d2e",
				},
				backgroundDark: {
					light: "#faf4ed",
					dark: "#191724",
				},
				codeBlockBackground: {
					light: "#faf4ed",
					dark: "#191724",
				},
				codeTitleBackground: {
					light: "#f2e9e1",
					dark: "#26233a",
				},
				codeInlineBorder: {
					light: "#9893a5",
					dark: "#6e6a86",
				},
			},
		},
	},
	markdown: {
		code: {
			themes: {
				light: "rose-pine-dawn",
				dark: "rose-pine",
			},
		},
		remarkPlugins: [remarkMermaid as never],
	},
	socials: [
		{ icon: "github", link: "https://github.com/palladians/mina-js" },
		{ icon: "discord", link: "https://get.pallad.co/discord" },
	],
	topNav: [
		{
			text: "Pallad - Mina Protocol wallet",
			link: "https://get.pallad.co/website",
		},
	],
	sidebar: [
		{
			text: "About MinaJS",
			link: "/about",
		},
		{
			text: "Getting Started",
			link: "/getting-started",
		},
		{
			text: "FAQ",
			link: "/faq",
		},
		{
			text: "Roadmap",
			link: "/roadmap",
		},
		{
			text: "MinaJS Connect",
			link: "/connect",
			items: [
				{ text: "Introduction", link: "/connect" },
				{ text: "Getting Started", link: "/connect/getting-started" },
				{ text: "Provider Discovery", link: "/connect/provider-discovery" },
				{ text: "Wallet Interface", link: "/connect/wallet-interface" },
				{ text: "Wallet Client", link: "/connect/wallet-client" },
				{ text: "Test zkApp", link: "/connect/test" },
			],
		},
		{
			text: "MinaJS Accounts",
			link: "/accounts",
			items: [
				{ text: "Introduction", link: "/accounts" },
				{ text: "Getting Started", link: "/accounts/getting-started" },
			],
		},
		{
			text: "Klesia",
			link: "/klesia",
			items: [
				{ text: "Introduction", link: "/klesia" },
				{ text: "JSON-RPC", link: "/klesia/rpc" },
				{ text: "TypeScript SDK", link: "/klesia/sdk" },
			],
		},
	],
	vite: {
		define: {
			"process.env": {},
		},
	},
});
