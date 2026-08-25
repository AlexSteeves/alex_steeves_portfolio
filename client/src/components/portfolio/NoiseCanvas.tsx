import { useEffect, useRef } from "react";
import { useTheme } from "../../lib/useTheme";

// ── Vertex shader ── (full-screen triangle)
const VERT = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

// ── Fragment shader ──
// Technique: domain-warped FBM (simplex 3D noise) mapped directly to a
// mix between the theme's background and foreground color — a single
// grayscale density field that reads as drifting smoke rather than a
// colored aurora. uBg/uFg are supplied by React and swap with the theme.
const FRAG = `
  precision mediump float;
  uniform vec2  uResolution;
  uniform float uTime;
  uniform vec3  uBg;
  uniform vec3  uFg;

  /* ── Simplex 3D helpers ─────────────────────────────────────────── */
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j  = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x  = x_ * ns.x + ns.yyyy;
    vec4 y  = y_ * ns.x + ns.yyyy;
    vec4 h  = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  /* ── 3-octave FBM ───────────────────────────────────────────────── */
  float fbm(vec2 p, float t){
    mat2 r = mat2(0.8, -0.6, 0.6, 0.8);  // rotate between octaves
    float v = 0.0;
    float a = 0.5;
    vec2  sh = vec2(100.0);
    for (int i = 0; i < 3; i++){
      v += a * (snoise(vec3(p, t)) * 0.5 + 0.5);
      p  = r * p * 2.0 + sh;
      a *= 0.5;
    }
    return v;  // [0, 1]
  }

  /* ── Main ───────────────────────────────────────────────────────── */
  void main(){
    vec2 uv = gl_FragCoord.xy / uResolution;
    float t  = uTime * 0.07;  // very slow drift

    /* Domain warp — two fbm samples displace the UV before the
       final density lookup, producing organic drifting smoke shapes */
    vec2 q = vec2(
      fbm(uv + vec2(0.00, 0.00), t),
      fbm(uv + vec2(5.20, 1.30), t)
    );

    float n = fbm(uv * 1.3 + 3.5 * q, t + 0.15);

    /* Smoke density — soften the low end so wisps fade to background
       instead of a hard edge, keep contrast in the mid-band. Capped
       below 1.0 so the densest wisps never reach full uFg contrast —
       keeps foreground text readable underneath in both themes. */
    float smoke = smoothstep(0.32, 0.82, n) * 0.8;

    vec3 col = mix(uBg, uFg, smoke);

    /* Radial vignette — keeps centre clearest, smoke settles toward the edges */
    vec2 vc  = (uv - 0.5) * vec2(1.0, 1.6);
    float vig = pow(clamp(1.0 - dot(vc, vc), 0.0, 1.0), 0.6);
    col = mix(uBg, col, mix(0.4, 1.0, vig));

    gl_FragColor = vec4(col, 1.0);
  }
`;

// Smoke colors per theme — deliberately not full text-primary brightness,
// a mid-tone so wisps read as smoke rather than blown-out highlights.
const SMOKE_COLORS: Record<"dark" | "light", { bg: [number, number, number]; fg: [number, number, number] }> = {
  dark: { bg: [0.039, 0.039, 0.039], fg: [0.58, 0.58, 0.56] },
  light: { bg: [0.965, 0.961, 0.949], fg: [0.32, 0.31, 0.29] },
};

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string,
): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
  }
  return shader;
}

export default function NoiseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [theme] = useTheme();
  const colorsRef = useRef(SMOKE_COLORS[theme]);
  colorsRef.current = SMOKE_COLORS[theme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.warn("WebGL not available — noise canvas will not render");
      return;
    }

    // ── Compile + link program ──
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // ── Fullscreen quad (two triangles) ──
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uResolution");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uBg = gl.getUniformLocation(prog, "uBg");
    const uFg = gl.getUniformLocation(prog, "uFg");

    let rafId: number;

    const draw = (timestamp: number) => {
      // Render at 0.5× pixel density — noise is soft enough that
      // the upscaling is invisible and halves GPU fragment work
      const w = Math.floor(canvas.offsetWidth * 0.5);
      const h = Math.floor(canvas.offsetHeight * 0.5);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      const { bg, fg } = colorsRef.current;
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, timestamp / 1000);
      gl.uniform3f(uBg, bg[0], bg[1], bg[2]);
      gl.uniform3f(uFg, fg[0], fg[1], fg[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
