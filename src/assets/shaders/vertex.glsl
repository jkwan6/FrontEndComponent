uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
attribute float aRandom;
attribute vec2 uv;

varying vec2 vUv;
varying float vRandom;
varying float vElevation;

uniform vec2 uFrequency;
uniform float uBigWaveElevation;
uniform vec2 uBigWaveFrequency;
uniform float uTime;
uniform float uBigWaveSpeed;


void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);


  float elevation = sin(modelPosition.x * uBigWaveFrequency.x + uTime * uBigWaveSpeed) *
                    sin(modelPosition.z * uBigWaveFrequency.y + uTime * uBigWaveSpeed) *
                    uBigWaveElevation;

  modelPosition.y += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  gl_Position = projectedPosition;


  vElevation = elevation;

}
