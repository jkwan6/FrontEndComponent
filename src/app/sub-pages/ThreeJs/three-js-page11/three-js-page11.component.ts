import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

@Component({
  selector: 'app-three-js-page11',
  templateUrl: './three-js-page11.component.html',
  styleUrls: ['./three-js-page11.component.css']
})
export class ThreeJsPage11Component implements AfterViewInit {

  constructor() { }
    ngAfterViewInit(): void {
      // Debug
      const gui = new dat.GUI()

      // Canvas
      const canvas = document.querySelector('canvas.webgl')

      // Scene
      const scene = new THREE.Scene()

      /**
       * Loaders
       */
      const textureLoader = new THREE.TextureLoader()
      const gltfLoader = new GLTFLoader()
      const cubeTextureLoader = new THREE.CubeTextureLoader()

      /**
       * Update all materials
       */
      const updateAllMaterials = () => {
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = 1
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

      /**
       * Material
       */



      // Textures
      const mapTexture = textureLoader.load('../../../assets/models/LeePerrySmith/color.jpg')
      mapTexture.encoding = THREE.sRGBEncoding

      const normalTexture = textureLoader.load('../../../assets/models/LeePerrySmith/normal.jpg')


      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 15, 15),
        new THREE.MeshStandardMaterial()
      )
      plane.rotation.y = Math.PI
      plane.position.y = - 5
      plane.position.z = 5
      scene.add(plane)


      // Material
      const material = new THREE.MeshStandardMaterial({
        map: mapTexture,
        normalMap: normalTexture
      })

      const customUniforms = {
        uTime: {value: 0}
      }

      const depthMaterial = new THREE.MeshDepthMaterial(
        {
          depthPacking: THREE.RGBADepthPacking
        });


      material.onBeforeCompile = (shader: any) =>
      {
        shader.uniforms.uTime = customUniforms.uTime;
        console.log(shader.uniforms)

        shader.vertexShader = shader.vertexShader
          .replace(
            '#include <common>',
            `
            #include <common>

            uniform float uTime;
            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }
        `
        );

        shader.vertexShader = shader.vertexShader
          .replace(
            "#include <beginnormal_vertex>",
            `
            #include <beginnormal_vertex>
            float angle = position.y + uTime * 0.2;
            mat2 rotateMatrix = get2dRotateMatrix(angle);

            objectNormal.xz = rotateMatrix * objectNormal.xz;
            


            `
        );



        shader.vertexShader = shader.vertexShader
          .replace(
            "#include <begin_vertex>",
            `
            #include <begin_vertex>

            transformed.xz = rotateMatrix * transformed.xz;
            `
        );
      }

      depthMaterial.onBeforeCompile = (shader: any) => {
        shader.uniforms.uTime = customUniforms.uTime;
        console.log(shader.uniforms)

        shader.vertexShader = shader.vertexShader
          .replace(
            '#include <common>',
            `
            #include <common>

            uniform float uTime;
            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }
        `
          );
        shader.vertexShader = shader.vertexShader
          .replace(
            "#include <begin_vertex>",
            `
            #include <begin_vertex>
            float angle = position.y + uTime * 0.2;
            mat2 rotateMatrix = get2dRotateMatrix(angle);

            transformed.xz = rotateMatrix * transformed.xz;
            `
          );
      }



      /**
       * Models
       */
      gltfLoader.load('../../../assets/models/LeePerrySmith/LeePerrySmith.glb',
        (gltf) => {
          // Model
          const mesh : any = gltf.scene.children[0]
          mesh.rotation.y = Math.PI * 0.5
          mesh.material = material
          mesh.customDepthMaterial = depthMaterial
          scene.add(mesh)

          // Update materials
          updateAllMaterials()
        }
      )

      /**
       * Lights
       */
      const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
      directionalLight.castShadow = true
      directionalLight.shadow.mapSize.set(1024, 1024)
      directionalLight.shadow.camera.far = 15
      directionalLight.shadow.normalBias = 0.05
      directionalLight.position.set(0.25, 2, - 2.25)
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
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas!,
        antialias: true
      })
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFShadowMap
/*      renderer.physicallyCorrectLights = true*/
      renderer.outputEncoding = THREE.sRGBEncoding
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1
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

        customUniforms.uTime.value = elapsedTime;

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
