import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { gsap } from 'gsap';

@Component({
  selector: 'app-three-js-page13',
  templateUrl: './three-js-page13.component.html',
  styleUrls: ['./three-js-page13.component.css']
})
export class ThreeJsPage13Component implements AfterViewInit {

  constructor() { }
    ngAfterViewInit(): void {

     /**
     * Loaders
     */
      const loadingBarElement: any = document.querySelector('.loading-bar');
      console.log(loadingBarElement)


      const loadingManager = new THREE.LoadingManager(
        // Loaded
        () => {

          gsap.delayedCall(0.5, () => {
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 6, value: 0 })
            loadingBarElement.classList.add("ended");
            loadingBarElement.style.transform = ``
          })
        },
        // Progress
        (itemUrl, itemLoaded, itemsTotal) => {
          const progressRatio = (itemLoaded / itemsTotal);
          loadingBarElement.style.transform = `scaleX(${progressRatio})`

        },
        // Error
        () => {

        },
      );
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


      // Overlay

      const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
      const overlayMaterial : any = new THREE.ShaderMaterial({
        wireframe: false,
        transparent: true,
        uniforms:
        {
          uAlpha: { value: 1 },
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
      });
      const overlayMesh = new THREE.Mesh(overlayGeometry, overlayMaterial);
      scene.add(overlayMesh);






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
      const renderer: any = new THREE.WebGLRenderer({
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

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
      }

      tick()



    }

}
