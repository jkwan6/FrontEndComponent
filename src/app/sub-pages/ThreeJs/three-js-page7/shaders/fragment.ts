export var fragment: string;


fragment = `




precision mediump float;
varying float vRandom;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main()
{
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 2.0 + 0.9;
    gl_FragColor = textureColor;


//    // Pattern 3
//    float strenght = vUv.x;
//    gl_FragColor = vec4(vUv.x,vUv.x, vUv.x, 1.0);


//    // Pattern 4
//    float strength = vUv.y;
//    gl_FragColor = vec4(strength,strength, strength, 1.0);

    // Pattern 5
    float strength = vUv.y;
    gl_FragColor = vec4(-strength,-strength, -strength, 1.0);

}












`
