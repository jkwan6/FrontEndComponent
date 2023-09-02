import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { vertex } from './shaders/vertex'
import { fragment } from './shaders/fragment'
import { ShaderLoader } from '../../../service/ShaderLoader/ShaderLoader.service';

@Component({
  selector: 'app-three-js-page9',
  templateUrl: './three-js-page9.component.html',
  styleUrls: ['./three-js-page9.component.css']
})
export class ThreeJsPage9Component implements AfterViewInit {

  constructor() { }
  ngAfterViewInit(): void {

    // Debug
    const gui = new dat.GUI({ width: 340 })
    const debugObject = {
      depthColor : "#0000ff",
      surfaceColor : "#8888ff"
    };


    // Canvas
    const canvas = document.querySelector('canvas.webgl')

    // Scene
    const scene = new THREE.Scene()

    /**
     * Water
     */
    // Geometry
    const waterGeometry = new THREE.PlaneGeometry(2, 2, 128, 128);

    // Material

    const shaderLoader = new ShaderLoader;
    const vertexShader = shaderLoader.LoadShader('assets/shaders/vertex.glsl')

    const waterMaterial : any = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader: fragment,
      uniforms:
      {
        uTime: {value: 0},
        uBigWaveElevation: { value: 0.5 },
        uBigWaveFrequency: {value: new THREE.Vector2(4, 1.5)},
        uBigWaveSpeed: { value: 0.75 },
        uDepthColor: { value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.25 },
        uColorMultiplier: { value: 2 }

      }
    })
    //waterMaterial.wireframe = true;


    gui.add(waterMaterial.uniforms.uBigWaveElevation, 'value').min(0).max(1).step(0.001).name('Wave Elevation');
    gui.add(waterMaterial.uniforms.uBigWaveFrequency.value, 'x').min(0).max(10).step(0.001).name('Wave FrequencyY');
    gui.add(waterMaterial.uniforms.uBigWaveFrequency.value, 'y').min(0).max(10).step(0.001).name('Wave FrequencyZ');
    gui.add(waterMaterial.uniforms.uBigWaveSpeed, 'value').min(0.1).max(4).step(0.001).name('Wave Speed');
    gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.1).name('Color Offset');
    gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(1).max(5).step(0.5).name('Color Multiplier');

    gui.addColor(debugObject, "depthColor").onChange(() => {
      waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
    });

    gui.addColor(debugObject, "surfaceColor").onChange(() => {
      waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
    });


    // Mesh
    const water = new THREE.Mesh(waterGeometry, waterMaterial)
    water.rotation.x = - Math.PI * 0.5
    scene.add(water)

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    window.addEventListener('resize', () => {
      // Update sizes
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      // Update camera
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      // Update renderer
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(1, 1, 1)
    scene.add(camera)

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas!
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    /**
     * Animate
     */
    const clock = new THREE.Clock()

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      waterMaterial.uniforms.uTime.value = elapsedTime;
      // Update controls
      controls.update()

      // Render
      renderer.render(scene, camera)

      // Call tick again on the next frame
      window.requestAnimationFrame(tick)
    }

    tick()

    }


}
