import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { gsap } from 'gsap';
import { Raycaster } from 'three';

@Component({
  selector: 'app-three-js-page14',
  templateUrl: './three-js-page14.component.html',
  styleUrls: ['./three-js-page14.component.css']
})
export class ThreeJsPage14Component implements AfterViewInit {

  constructor() { }
    ngAfterViewInit(): void {
      /**
* Loaders
*/
      let sceneReady = false;
      const loadingBarElement: any = document.querySelector('.loading-bar')
      const loadingManager = new THREE.LoadingManager(
        // Loaded
        () => {
          // Wait a little
          window.setTimeout(() => {
            // Animate overlay
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

            // Update loadingBarElement
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
          }, 500)

          window.setTimeout(() => {
            sceneReady = true;
          }, 3000)

        },

        // Progress
        (itemUrl, itemsLoaded, itemsTotal) => {
          // Calculate the progress and update the loadingBarElement
          const progressRatio = itemsLoaded / itemsTotal
          loadingBarElement.style.transform = `scaleX(${progressRatio})`
        }
      )
      const gltfLoader = new GLTFLoader(loadingManager)
      const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

      /**
       * Base
       */
      // Debug
      const debugObject = {
        envMapIntensity: 0,
      }
      // Canvas
      const canvas = document.querySelector('canvas.webgl')

      // Scene
      const scene = new THREE.Scene()

      /**
       * Overlay
       */
      const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
      const overlayMaterial : any = new THREE.ShaderMaterial({
        // wireframe: true,
        transparent: true,
        uniforms:
        {
          uAlpha: { value: 1 }
        },
        vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
        fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
      })
      const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
      scene.add(overlay)

      /**
       * Update all materials
       */
      const updateAllMaterials = () => {
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
          }
        })
      }

      /**
       * Environment map
       */
      const environmentMap = cubeTextureLoader.load([
        '../../../assets/textures/environmentMaps/0/px.jpg',
        '../../../assets/textures/environmentMaps/0/nx.jpg',
        '../../../assets/textures/environmentMaps/0/py.jpg',
        '../../../assets/textures/environmentMaps/0/ny.jpg',
        '../../../assets/textures/environmentMaps/0/pz.jpg',
        '../../../assets/textures/environmentMaps/0/nz.jpg'
      ])

      environmentMap.encoding = THREE.sRGBEncoding

      scene.background = environmentMap
      scene.environment = environmentMap

      debugObject.envMapIntensity = 2.5

      /**
       * Models
       */
      gltfLoader.load(
        '../../../assets/models/FlightHelmet/glTF/FlightHelmet.gltf',
        (gltf) => {
          gltf.scene.scale.set(10, 10, 10)
          gltf.scene.position.set(0, - 4, 0)
          gltf.scene.rotation.y = Math.PI * 0.5
          scene.add(gltf.scene)

          updateAllMaterials()
        }
      )


      // Points of Interest
      const rayCaster = new THREE.Raycaster();

      const points : any = [
        {
          position: new THREE.Vector3(1.55, 0.3, -0.6),
          element: document.querySelector('.point-0')
        },
        {
          position: new THREE.Vector3(0.5, 0.8, -1.6),
          element: document.querySelector('.point-1')
        },
        {
          position: new THREE.Vector3(1.6, -1.3, -0.7),
          element: document.querySelector('.point-2')
        }
      ];

      /**
       * Lights
       */
      const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
      directionalLight.castShadow = true
      directionalLight.shadow.camera.far = 15
      directionalLight.shadow.mapSize.set(1024, 1024)
      directionalLight.shadow.normalBias = 0.05
      directionalLight.position.set(0.25, 3, - 2.25)
      scene.add(directionalLight)

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
      camera.position.set(4, 1, - 4)
      scene.add(camera)

      /**
       * Renderer
       */
      const renderer : any = new THREE.WebGLRenderer({
        canvas: canvas!,
        antialias: true
      })
      renderer.physicallyCorrectLights = true
      renderer.outputEncoding = THREE.sRGBEncoding
      renderer.toneMapping = THREE.ReinhardToneMapping
      renderer.toneMappingExposure = 3
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
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

        if (sceneReady) {
          for (const point of points) {
            const screenPosition = point.position.clone();
            screenPosition.project(camera);

            rayCaster.setFromCamera(screenPosition, camera);
            const intersects = rayCaster.intersectObjects(scene.children, true);

            if (intersects.length === 0) {
              point.element.classList.add("visible");
            }
            else {
              const intersectionDistance = intersects[0].distance;
              const pointDistance = point.position.distanceTo(camera.position);

              if (intersectionDistance < pointDistance) {
                point.element.classList.remove("visible");
              }
              else {
                point.element.classList.add("visible");
              }
            }


            const translateX = screenPosition.x * sizes.width * 0.5;
            const translateY = -screenPosition.y * sizes.height * 0.5;

            point.element.style.transform =
              `translate(${translateX}px, ${translateY}px)`
          }
        }
        // Go Through each Points


        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
      }

      tick()
    }

}
