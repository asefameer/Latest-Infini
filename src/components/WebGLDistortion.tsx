import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Advanced vertex shader with displacement ───
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  varying vec2 vUv;
  varying float vDistortion;

  // Simplex noise helpers
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x_) - 0.5;
    vec3 ox = floor(x_ + 0.5);
    vec3 a0 = x_ - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Ambient wave distortion on z-axis
    float noise = snoise(uv * 3.0 + uTime * 0.15) * 0.015;
    
    // Mouse proximity displacement
    float dist = distance(uv, uMouse);
    float mouseInfluence = smoothstep(0.5, 0.0, dist) * uHover;
    float mouseDisplace = mouseInfluence * 0.04 * sin(dist * 25.0 - uTime * 4.0);
    
    pos.z += noise + mouseDisplace;
    vDistortion = noise + mouseDisplace;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// ─── Advanced fragment shader ───
const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;
  varying float vDistortion;

  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x_) - 0.5;
    vec3 ox = floor(x_ + 0.5);
    vec3 a0 = x_ - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    
    // ── Distance from mouse ──
    float dist = distance(uv, uMouse);
    float strength = smoothstep(0.45, 0.0, dist) * uHover;
    
    // ── Liquid noise warp ──
    float noiseX = snoise(uv * 4.0 + vec2(uTime * 0.2, 0.0)) * 0.008;
    float noiseY = snoise(uv * 4.0 + vec2(0.0, uTime * 0.15)) * 0.008;
    uv += vec2(noiseX, noiseY);
    
    // ── Radial mouse warp (liquid bulge) ──
    vec2 dir = uv - uMouse;
    float bulge = strength * 0.06;
    uv += dir * bulge * sin(dist * 18.0 - uTime * 3.5);
    
    // ── Chromatic aberration ──
    float caStrength = 0.003 + strength * 0.015;
    vec2 caDir = normalize(uv - 0.5) * caStrength;
    float r = texture2D(uTexture, uv + caDir).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, uv - caDir).b;
    vec3 color = vec3(r, g, b);
    
    // ── Edge glow on distortion ──
    float glow = abs(vDistortion) * 12.0;
    vec3 glowColor = mix(
      vec3(0.35, 0.85, 0.85),  // cyan
      vec3(0.65, 0.35, 0.85),  // purple
      sin(uTime * 0.5 + dist * 6.0) * 0.5 + 0.5
    );
    color += glowColor * glow * 0.4;
    
    // ── Mouse proximity glow ──
    float mouseGlow = smoothstep(0.3, 0.0, dist) * uHover * 0.15;
    color += glowColor * mouseGlow;
    
    // ── Vignette ──
    float vignette = 1.0 - smoothstep(0.4, 1.4, length(vUv - 0.5) * 2.0);
    color *= mix(0.7, 1.0, vignette);
    
    // ── Subtle scanlines ──
    float scanline = sin(vUv.y * uResolution.y * 0.5) * 0.02;
    color -= scanline;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// ─── Distortion plane component ───
const DistortionPlane = ({ texture }: { texture: THREE.VideoTexture }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();
  const targetHover = useRef(0);
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [texture, size]
  );

  // Smooth lerp all uniforms each frame
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value += delta;

    // Smooth hover
    mat.uniforms.uHover.value = THREE.MathUtils.lerp(
      mat.uniforms.uHover.value,
      targetHover.current,
      0.08
    );

    // Smooth mouse
    mat.uniforms.uMouse.value.lerp(targetMouse.current, 0.07);
  });

  const handlePointerMove = useCallback((e: any) => {
    if (e.uv) {
      targetMouse.current.set(e.uv.x, e.uv.y);
      targetHover.current = 1;
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    targetHover.current = 0;
  }, []);

  return (
    <mesh
      ref={meshRef}
      scale={[viewport.width, viewport.height, 1]}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <planeGeometry args={[1, 1, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

// ─── Main WebGL component ───
interface WebGLDistortionProps {
  videoSrc: string;
  className?: string;
  onReady?: () => void;
}

const WebGLDistortion = ({ videoSrc, className = "", onReady }: WebGLDistortionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);
  const [ready, setReady] = useState(false);

  const getTexture = useCallback(() => {
    if (textureRef.current) return textureRef.current;
    if (!videoRef.current) return null;
    const tex = new THREE.VideoTexture(videoRef.current);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.format = THREE.RGBAFormat;
    tex.colorSpace = THREE.SRGBColorSpace;
    textureRef.current = tex;
    return tex;
  }, []);

  const handleCanPlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setReady(true);
      onReady?.();
    }
  }, [onReady]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
        onCanPlay={handleCanPlay}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      {ready && (
        <Canvas
          className="absolute inset-0"
          gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
          style={{ position: "absolute", inset: 0 }}
          dpr={[1, 1.5]}
        >
          <SceneContent getTexture={getTexture} />
        </Canvas>
      )}
    </div>
  );
};

// Separate component inside Canvas context
const SceneContent = ({ getTexture }: { getTexture: () => THREE.VideoTexture | null }) => {
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    const tex = getTexture();
    if (tex) setTexture(tex);
  }, [getTexture]);

  // Keep trying until texture is available
  useFrame(() => {
    if (!texture) {
      const tex = getTexture();
      if (tex) setTexture(tex);
    }
  });

  if (!texture) return null;
  return <DistortionPlane texture={texture} />;
};

export default WebGLDistortion;
