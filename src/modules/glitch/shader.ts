import { RED } from "./palette";

/**
 * How hard the glass bends: how far past the edge the corners of the screen
 * reach, as a fraction of the half-extent. The page itself never moves — the
 * curve lives in the bezel, the scanlines and the glitches, which is enough for
 * the eye, draws the same in every browser, and costs nothing to scroll under.
 */
export const CURVATURE = 0.22;

/**
 * One triangle that covers the whole clip space, built from the vertex index
 * alone — no buffers, no attributes.
 */
export const VERTEX = `#version 300 es
void main() {
	vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
	gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`;

/**
 * The whole look, layered bottom to top with premultiplied "over": vignette,
 * scanlines, a rolling band, film grain, glitch slips, then the glass — a rim
 * glow, a reflection, and the bezel eating the corners.
 *
 * Everything that should follow the curve is drawn in warped space: the point
 * pushed outward by \`q · (1 + k·ρ⁴)\`, with ρ² = |q|² / 2 reaching 1 at the
 * corners. ρ⁴ keeps the middle flat and spends the curve on the rim.
 *
 * Grain is re-rolled at 24 steps a second whatever the refresh rate, so it reads
 * as film rather than static, and a 120 Hz screen costs no more than a 60 Hz one.
 */
export const FRAGMENT = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_glitch;

out vec4 outColor;

const vec3 RED = vec3(${RED.join(", ")});
const float CURVATURE = ${CURVATURE.toFixed(4)};

float hash(vec2 p) {
	vec3 p3 = fract(vec3(p.xyx) * 0.1031);
	p3 += dot(p3, p3.yzx + 33.33);
	return fract((p3.x + p3.y) * p3.z);
}

vec4 over(vec4 top, vec4 base) {
	return top + base * (1.0 - top.a);
}

vec4 layer(vec3 rgb, float alpha) {
	return vec4(rgb * alpha, alpha);
}

// A phone held upright has little width to spare: the curve eases off with
// the aspect, so the rim never bites into text that runs close to the sides.
vec2 barrel(vec2 q) {
	float aspect = u_resolution.x / u_resolution.y;
	float rho2 = dot(q, q) * 0.5;
	return q * (1.0 + CURVATURE * clamp(aspect, 0.5, 1.0) * rho2 * rho2);
}

// Signed distance, in pixels, from a rounded screen edge: negative inside.
float screenEdge(vec2 warped, vec2 half_, float radius) {
	vec2 d = abs(warped * half_) - (half_ - radius);
	return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
}

void main() {
	vec2 px = gl_FragCoord.xy;
	vec2 q = px / u_resolution * 2.0 - 1.0;
	vec2 w = barrel(q);
	vec2 wpx = (w * 0.5 + 0.5) * u_resolution;
	vec2 half_ = u_resolution * 0.5;
	float shortSide = min(u_resolution.x, u_resolution.y);
	float frame = floor(u_time * 24.0);

	vec4 color = vec4(0.0);

	color = over(layer(vec3(0.0), smoothstep(0.5, 1.4, length(w)) * 0.55), color);

	color = over(layer(vec3(0.0), step(1.0, mod(wpx.y, 2.0)) * 0.16), color);

	float band = 1.0 - smoothstep(0.0, 0.08, abs(fract(w.y * 0.5 - u_time * 0.04) - 0.5));
	color = over(layer(vec3(1.0), band * 0.025), color);

	float grain = hash(px + frame * 37.0) * 2.0 - 1.0;
	color = over(layer(vec3(step(0.0, grain)), abs(grain) * 0.08), color);

	// Glitch: the signal failing. Thin scanlines slip into bright streaks, a
	// few thicker bands flare dim across the tube, the odd line burns red, and
	// the whole screen flickers.
	if (u_glitch > 0.0) {
		float along = w.x * 0.5 + 0.5;

		float line = floor(wpx.y / 2.0);
		float roll = hash(vec2(line, frame));
		float start = hash(vec2(line, frame + 1.0));
		float streak = step(start, along) * step(along, start + 0.2 + 0.5 * roll);
		float lit = step(1.0 - u_glitch * 0.1, roll) * streak;
		vec3 tint = roll > 1.0 - u_glitch * 0.02 ? RED : vec3(1.0);
		color = over(layer(tint, lit * 0.5 * u_glitch), color);

		float band = floor(wpx.y / 12.0);
		float flare = step(1.0 - u_glitch * 0.04, hash(vec2(band, frame + 7.0)));
		color = over(layer(vec3(1.0), flare * 0.16 * u_glitch), color);

		color = over(layer(vec3(1.0), u_glitch * 0.04 * step(0.5, hash(vec2(frame)))), color);
	}

	float edge = screenEdge(w, half_, shortSide * 0.04);

	float rim = exp(min(edge, 0.0) / (shortSide * 0.025)) * 0.07;
	color = over(layer(vec3(1.0), rim * step(edge, 0.0)), color);

	float glare = 1.0 - smoothstep(0.0, 0.7, length((q - vec2(-0.5, 0.6)) * vec2(0.8, 1.6)));
	color = over(layer(vec3(1.0), glare * 0.03), color);

	color = over(layer(vec3(0.0), smoothstep(-1.0, 1.0, edge)), color);

	outColor = color;
}`;
