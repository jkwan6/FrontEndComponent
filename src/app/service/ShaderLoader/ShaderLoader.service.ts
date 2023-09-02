import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class ShaderLoader {

  constructor() { }

  // Provide Path of Shader 'assets/shaders/xxx/xxx'
  LoadShader(shaderPath: string) : string {
    const req = new XMLHttpRequest();
    req.open('GET', shaderPath, false);
    req.overrideMimeType('text/plain');
    req.send();

    return req.responseText;
  }
}
