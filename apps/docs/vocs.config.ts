import { defineConfig } from "vocs";

export default defineConfig({
	title: "MinaJS",
	description: "The TypeScript interface for Mina Protocol.",
	logoUrl: "/logo.svg",
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
	socials: [
		{ icon: "github", link: "https://github.com/palladians/mina-js" },
		{ icon: "discord", link: "https://get.pallad.co/discord" },
	],
	sidebar: [
		{
			text: "Getting Started",
			link: "/getting-started",
		},
		{
			text: "MinaJS Connect",
			link: "/connect",
			items: [{ text: "Introduction", link: "/connect" }],
		},
		{
			text: "MinaJS Accounts",
			link: "/accounts",
			items: [{ text: "Introduction", link: "/accounts" }],
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
});
