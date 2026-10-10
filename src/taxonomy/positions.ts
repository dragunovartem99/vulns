// Where the attacker stands, outside in: Akhawe et al.'s network, web and gadget
// attackers, the web one split by whose browser carries the attack, plus
// OWASP 2025's supply-chain attacker.
export const BASIS = {
	rule:
		"An entry goes under the position its payload is delivered from: what the attacker must " +
		"control to land it. The positions are web security's threat models, from the outside in.",
	sources: [
		"https://www.adambarth.com/papers/2010/akhawe-barth-lam-mitchell-song.pdf",
		"https://owasp.org/Top10/2025/A03_2025-Software_Supply_Chain_Failures/",
	],
};

export const CATEGORIES = ["network", "cross-site", "direct", "content", "supply-chain"] as const;

export type Category = (typeof CATEGORIES)[number];

export type Position = {
	/** The threat model it comes from. */
	model: string;
	/** Where I stand, in the sheet's own voice. */
	stance: string;
};

export const POSITIONS: Record<Category, Position> = {
	"network": {
		model: "Network attacker",
		stance: "I sit on the wire between your user and your server.",
	},
	"cross-site": {
		model: "Web attacker, through your user's browser",
		stance: "I run a site your user visits while signed in to yours.",
	},
	"direct": {
		model: "Web attacker, with a client of my own",
		stance: "I use your app like anyone else, just not through your UI.",
	},
	"content": {
		model: "Gadget attacker",
		stance: "I put text, links or files into pages your other users open.",
	},
	"supply-chain": {
		model: "Supply-chain attacker",
		stance: "I get my code into what you install and load.",
	},
};

/** How bad it gets when it lands. Red density on the card scales with it. */
export const SEVERITIES = ["critical", "high", "medium"] as const;
