import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { gsap } from 'gsap';
import { Raycaster, Texture } from 'three';

@Component({
  selector: 'app-three-js-page15',
  templateUrl: './three-js-page15.component.html',
  styleUrls: ['./three-js-page15.component.css']
})
export class ThreeJsPage15Component implements AfterViewInit {

  constructor() { }
    ngAfterViewInit(): void {
      const gui = new dat.GUI({
        width: 400
      })

      // Canvas
      const canvas = document.querySelector('canvas.webgl')

      // Scene
      const scene = new THREE.Scene()

      /**
       * Loaders
       */
      // Texture loader
      const textureLoader = new THREE.TextureLoader()
      const bakedTexture = textureLoader.load('../../../assets/textures/baked2.jpg');
      bakedTexture.flipY = false;
      bakedTexture.encoding = THREE.sRGBEncoding;
      // Draco loader
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('draco/')

      // GLTF loader
      const gltfLoader = new GLTFLoader()
      gltfLoader.setDRACOLoader(dracoLoader)

      /**
       * Object
       */

      const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
      const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })
      const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
      /**
       * Models
       */
      gltfLoader.load(
        '../../../assets/models/portal2.glb',
        (gltf) => {

          gltf.scene.traverse((child:any) => {
            child.material = bakedMaterial;
          })

          const poleLightAMesh : any = gltf.scene.children.find((child) => {
            return child.name === 'lamppaper';
          })

          const poleLightBMesh: any = gltf.scene.children.find((child) => {
            return child.name === 'lamppaper001';
          })

          const portalLight: any = gltf.scene.children.find((child) => {
            return child.name === 'Circle';
          })

          poleLightAMesh.material = poleLightMaterial;
          poleLightBMesh.material = poleLightMaterial;
          portalLight.material = portalLightMaterial;

          scene.add(gltf.scene);
        }
      )


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
      const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
      camera.position.x = 4
      camera.position.y = 2
      camera.position.z = 4
      scene.add(camera)

      /**
       * Renderer
       */
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas!,
        antialias: true
      })
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.outputEncoding = THREE.sRGBEncoding

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true

      /**
       * Animate
       */
      const clock = new THREE.Clock()

      const tick = () => {
        const elapsedTime = clock.getElapsedTime()

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
