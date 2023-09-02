import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { vertex } from './shaders/vertex'
import { fragment } from './shaders/fragment'
import { ShaderLoader } from './../../../service/ShaderLoader/ShaderLoader.service'

@Component({
  selector: 'app-three-js-page-seven',
  templateUrl: './three-js-page-seven.component.html',
  styleUrls: ['./three-js-page-seven.component.css']
})
export class ThreeJsPageSevenComponent implements AfterViewInit {

  constructor() { }
  ngAfterViewInit(): void {

    /**
     * Base
     */
    // Debug
    const gui = new dat.GUI()

    // Canvas
    const canvas = document.querySelector('canvas.webgl')

    // Scene
    const scene = new THREE.Scene()

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader()
    const flagTexture = textureLoader.load('../../../assets/textures/flag-french.jpg');


    const x = new ShaderLoader;
    var stringy = x.LoadShader('assets/shaders/fragment.glsl')
    console.log(stringy)

    /**
     * Test mesh
     */
    // Geometry
    const geometry : THREE.PlaneGeometry | any = new THREE.PlaneGeometry(1, 1, 32, 32)
      console.log(geometry)


    const count = geometry.attributes.position.count;
    const random = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      random[i] = Math.random();
    }

    geometry.setAttribute('aRandom', new THREE.BufferAttribute(random, 1))
    console.log(count)

      // Material
      const material: THREE.RawShaderMaterial | any = new THREE.RawShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uFrequency: { value: new THREE.Vector2(10, 5) },
          uTime: { value: 0 },
          uColor: { value: new THREE.Color('purple') },
          uTexture: { value: flagTexture }
        },
        transparent: true
      })

    gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(30).step(1).name('FreqX');
    gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(30).step(1).name('FreqY');



      // Mesh
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)


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
      camera.position.set(0.25, - 0.25, 1)
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

        // Update Materials
        material.uniforms.uTime.value = elapsedTime;

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
