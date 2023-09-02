export var fragment: string;

fragment = `


precision mediump float;

varying vec3 vColor;

void main()
{


  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.0 - strength;
  strength = pow(strength, 5.0);

  vec3 colorMix = mix(vec3(0.0), vColor, strength);

  gl_FragColor = vec4(colorMix, 1.0);
}



`
