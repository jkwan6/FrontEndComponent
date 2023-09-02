export var vertex: string;

vertex = `





uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform float uSize;

attribute vec3 position;
attribute vec2 uv;
attribute float aScale;
attribute vec3 color;
attribute vec3 aRandomness;

varying vec2 vUv;
varying vec3 vColor;

uniform float uTime;

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);


  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = length(modelPosition.xz);
  float offsetAngle = (1.0/distanceToCenter) * uTime * 0.2;
  angle += offsetAngle;

  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;

  modelPosition.x += aRandomness.x;
  modelPosition.y += aRandomness.y;
  modelPosition.z += aRandomness.z;



  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = uSize * aScale;
  gl_PointSize *= (1.0 / - viewPosition.z);

  vColor = color;
}




























`
