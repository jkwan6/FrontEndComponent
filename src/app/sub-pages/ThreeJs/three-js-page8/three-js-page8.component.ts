import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { vertex } from './shaders/vertex'
import { fragment } from './shaders/fragment'

@Component({
  selector: 'app-three-js-page8',
  templateUrl: './three-js-page8.component.html',
  styleUrls: ['./three-js-page8.component.css']
})
export class ThreeJsPage8Component implements AfterViewInit {

  constructor() { }
    ngAfterViewInit(): void {
      const gui = new dat.GUI()

      // Canvas
      const canvas = document.querySelector('canvas.webgl')

      // Scene
      const scene = new THREE.Scene()

      /**
       * Test mesh
       */
      // Geometry
      const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

      // Material
      const material = new THREE.RawShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        side: THREE.DoubleSide
      })

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
      const tick = () => {
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
