import { describe, expect, it } from "vitest";

import { toEntry } from "../utils/entry";
import { detects, isPattern } from "../utils/pattern";

describe("isPattern", () => {
	it("accepts a regex both engines read", () => {
		expect(isPattern(String.raw`loading="lazy"`)).toBe(true);
		expect(isPattern(String.raw`addEventListener\(["']scroll`)).toBe(true);
	});

	it("rejects what does not compile", () => {
		expect(isPattern("(unclosed")).toBe(false);
		expect(isPattern("")).toBe(false);
	});

	it("rejects lookaround and backreferences, which ripgrep lacks", () => {
		expect(isPattern("img(?!.*width)")).toBe(false);
		expect(isPattern("(?<=src=)x")).toBe(false);
		expect(isPattern(String.raw`(["'])x\1`)).toBe(false);
	});
});

describe("detects", () => {
	it("finds code any one pattern matches, line by line", () => {
		const code = "const a = 1;\nel.innerHTML = bio;";
		expect(detects({ patterns: ["nope", "^el\\.innerHTML"], code })).toBe(true);
		expect(detects({ patterns: ["textContent"], code })).toBe(false);
	});
});

describe("toEntry", () => {
	const entry = {
		id: "dom-xss",
		body: "\nMy onerror does.\n",
		data: {
			cwe: 79,
			owasp: "A05",
			title: "DOM XSS through innerHTML",
			category: "injection",
			severity: "critical" as const,
			sink: "el.innerHTML = user.bio\n",
			payload: "<img src=x onerror=alert(1)>",
			fix: "el.textContent = user.bio;\n",
			detect: [String.raw`\.innerHTML\s*=`],
			verify: "Save the payload as a bio.",
			fineWhen: "The HTML is a constant.",
			refs: ["https://owasp.org"],
		},
	};

	it("maps a card onto the shared shape", () => {
		const result = toEntry({ entry, page: "https://example.com/vulns/" });
		expect(result.url).toBe("https://example.com/vulns/#dom-xss");
		expect(result.anchors).toEqual(["CWE-79", "A05:2025"]);
		expect(result.bad).toEqual({ label: "Sink", code: "el.innerHTML = user.bio" });
		expect(result.attack?.label).toBe("Payload");
		expect(result.why).toBe("My onerror does.");
	});

	it("leaves the OWASP anchor out when the CWE has none", () => {
		const { owasp: _, ...data } = entry.data;
		expect(toEntry({ entry: { ...entry, data }, page: "/" }).anchors).toEqual(["CWE-79"]);
	});
});
