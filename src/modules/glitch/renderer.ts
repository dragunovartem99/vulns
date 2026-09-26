import { FRAGMENT, VERTEX } from "./shader";
import type { FrameState, OverlayCanvas } from "./types";

export type Renderer = {
	resize: (size: { width: number; height: number }) => void;
	draw: (state: FrameState) => void;
};

function compile({
	gl,
	type,
	source,
}: {
	gl: WebGL2RenderingContext;
	type: GLenum;
	source: string;
}): WebGLShader | null {
	const shader = gl.createShader(type);
	if (!shader) return null;

	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;

	console.error(gl.getShaderInfoLog(shader));
	return null;
}

function link({ gl }: { gl: WebGL2RenderingContext }): WebGLProgram | null {
	const vertex = compile({ gl, type: gl.VERTEX_SHADER, source: VERTEX });
	const fragment = compile({ gl, type: gl.FRAGMENT_SHADER, source: FRAGMENT });
	const program = gl.createProgram();
	if (!vertex || !fragment) return null;

	gl.attachShader(program, vertex);
	gl.attachShader(program, fragment);
	gl.linkProgram(program);
	if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;

	console.error(gl.getProgramInfoLog(program));
	return null;
}

// A full-screen pass and three uniforms — the entire GPU side. Returns null
// when WebGL2 is missing or the shader fails, and the page simply goes without.
export function createRenderer({ canvas }: { canvas: OverlayCanvas }): Renderer | null {
	// Both canvas types return a WebGL2 context for "webgl2", but TS resolves
	// the call on their union through the plain-string overload.
	const gl = canvas.getContext("webgl2", {
		alpha: true,
		premultipliedAlpha: true,
		antialias: false,
		depth: false,
		stencil: false,
		powerPreference: "low-power",
	}) as WebGL2RenderingContext | null;
	if (!gl) return null;

	const program = link({ gl });
	if (!program) return null;

	gl.useProgram(program);
	gl.bindVertexArray(gl.createVertexArray());

	const resolution = gl.getUniformLocation(program, "u_resolution");
	const time = gl.getUniformLocation(program, "u_time");
	const glitch = gl.getUniformLocation(program, "u_glitch");

	return {
		resize: ({ width, height }) => {
			canvas.width = width;
			canvas.height = height;
			gl.viewport(0, 0, width, height);
			gl.uniform2f(resolution, width, height);
		},
		draw: (state) => {
			gl.uniform1f(time, state.time);
			gl.uniform1f(glitch, state.glitch);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		},
	};
}
