export var fragment: string;

fragment = `






precision mediump float;
varying float vRandom;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

uniform float uBigWaveElevation;

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

void main()
{
  vec4 textureColor = texture2D(uTexture, vUv);
  textureColor.rgb *= vElevation * 2.0 + 0.9;

  float mixStrength = uColorMultiplier * (uColorOffset + vElevation);

  vec3 mixedColor = mix(uDepthColor, uSurfaceColor, mixStrength);


  gl_FragColor = vec4(mixedColor, 1.0);
}










`
