// The OWASP Top 10:2025 by id and page slug. An entry takes the category its
// CWE — or that CWE's nearest mapped parent — is listed under.
export const OWASP = {
	A01: "Broken_Access_Control",
	A02: "Security_Misconfiguration",
	A03: "Software_Supply_Chain_Failures",
	A04: "Cryptographic_Failures",
	A05: "Injection",
	A06: "Insecure_Design",
	A07: "Authentication_Failures",
	A08: "Software_or_Data_Integrity_Failures",
	A09: "Security_Logging_and_Alerting_Failures",
	A10: "Mishandling_of_Exceptional_Conditions",
} as const;

export type OwaspId = keyof typeof OWASP;

export const OWASP_IDS = Object.keys(OWASP) as [OwaspId, ...OwaspId[]];

// The category's page in the OWASP Top 10:2025.
export function owaspUrl(id: OwaspId): string {
	return `https://owasp.org/Top10/2025/${id}_2025-${OWASP[id]}/`;
}

// "A05:2025 Injection", as OWASP writes it.
export function owaspName(id: OwaspId): string {
	return `${id}:2025 ${OWASP[id].replaceAll("_", " ")}`;
}
