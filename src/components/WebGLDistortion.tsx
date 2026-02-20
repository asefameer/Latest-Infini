import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // Distance from mouse
    float dist = distance(uv, uMouse);
    float strength = smoothstep(0.4, 0.0, dist) * uHover;
    
    // Ripple distortion
    float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.02 * strength;
    
    // Chromatic shift
    vec2 offsetR = uv + vec2(ripple * 1.2, ripple * 0.8);
    vec2 offsetG = uv + vec2(ripple * 0.5, ripple * 1.0);
    vec2 offsetB = uv + vec2(-ripple * 0.8, ripple * 1.5);
    
    float r = texture2D(uTexture, offsetR).r;
    float g = texture2D(uTexture, offsetG).g;
    float b = texture2D(uTexture, offsetB).b;
    float a = texture2D(uTexture, uv).a;
    
    gl_FragColor = vec4(r, g, b, a);
  }
`;

interface DistortionPlaneProps {
  texture: THREE.Texture;
  onMouseMove: (uv: THREE.Vector2) => void;
}

const DistortionPlane = ({ texture, onMouseMove }: DistortionPlaneProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uTime: { value: 0 },
    }),
    [texture]
  );

  useFrame((_, delta) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value += delta;
    }
  });

  const handlePointerMove = useCallback(
    (e: any) => {
      if (meshRef.current) {
        const mat = meshRef.current.material as THREE.ShaderMaterial;
        mat.uniforms.uMouse.value.set(e.uv.x, e.uv.y);
        mat.uniforms.uHover.value = THREE.MathUtils.lerp(mat.uniforms.uHover.value, 1, 0.1);
        onMouseMove(e.uv);
      }
    },
    [onMouseMove]
  );

  const handlePointerLeave = useCallback(() => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uHover.value = 0;
    }
  }, []);

  return (
    <mesh
      ref={meshRef}
      scale={[viewport.width, viewport.height, 1]}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
};

interface WebGLDistortionProps {
  videoSrc: string;
  className?: string;
}

const WebGLDistortion = ({ videoSrc, className = "" }: WebGLDistortionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);

  const getTexture = useCallback(() => {
    if (textureRef.current) return textureRef.current;
    if (!videoRef.current) return null;
    const tex = new THREE.VideoTexture(videoRef.current);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.format = THREE.RGBAFormat;
    textureRef.current = tex;
    return tex;
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover opacity-0"
        onCanPlay={() => {
          // Force re-render when video is ready
          if (videoRef.current) videoRef.current.play();
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <Canvas
        className="absolute inset-0"
        gl={{ alpha: true, antialias: false }}
        style={{ position: "absolute", inset: 0 }}
      >
        <WebGLContent getTexture={getTexture} />
      </Canvas>
    </div>
  );
};

const WebGLContent = ({ getTexture }: { getTexture: () => THREE.VideoTexture | null }) => {
  const textureRef = useRef<THREE.VideoTexture | null>(null);

  useFrame(() => {
    if (!textureRef.current) {
      textureRef.current = getTexture();
    }
  });

  if (!textureRef.current) {
    // Try to get texture on first render
    textureRef.current = getTexture();
  }

  if (!textureRef.current) return null;

  return <DistortionPlane texture={textureRef.current} onMouseMove={() => {}} />;
};

export default WebGLDistortion;
