import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

@Component({
  selector: 'app-three-js-page-four',
  templateUrl: './three-js-page-four.component.html',
  styleUrls: ['./three-js-page-four.component.css']
})
export class ThreeJsPageFourComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit(): void {
    /**
     * Debug
     */
    const gui = new dat.GUI()

    const debugObject = {
      createSphere:
        () => {
          createSphere(
            Math.random() * 0.5,
            new THREE.Vector3( Math.random() - 0.5, 3, Math.random() - 0.5)
          )
        },

      createBox:
        () => {
          createBox(Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5, new THREE.Vector3(
            Math.random() - 0.5, 3, Math.random() - 0.5))
        },


      reset: () => {
        for (const object of objectsToUpdate) {
          object.body.removeEventListener('collide', playHitSound)
          world.removeBody(object.body)


          // Remove mesh
          scene.remove(object.mesh)

        }
        objectsToUpdate.splice(0, objectsToUpdate.length)
      }
    };

    gui.add(debugObject, 'createSphere')
    gui.add(debugObject, 'createBox')
    gui.add(debugObject, 'reset')
    


    /**
     * Base
     */
    // Canvas
    const canvas = document.querySelector('canvas.webgl4')

    // Scene
    const scene = new THREE.Scene()

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader()
    const cubeTextureLoader = new THREE.CubeTextureLoader()

    const hitSound = new Audio('../../../assets/sounds/hit.mp3')

    const playHitSound = (collision: any) => {
      const impactStrength = collision.contact.getImpactVelocityAlongNormal()

      if (impactStrength > 1.5) {
        hitSound.volume = Math.random();
        hitSound.currentTime = 0
        hitSound.play();

      }
    }



    const environmentMapTexture = cubeTextureLoader.load([
      '../../../assets/textures/environmentMaps/0/px.jpg',
      '../../../assets/textures/environmentMaps/0/nx.jpg',
      '../../../assets/textures/environmentMaps/0/py.jpg',
      '../../../assets/textures/environmentMaps/0/ny.jpg',
      '../../../assets/textures/environmentMaps/0/pz.jpg',
      '../../../assets/textures/environmentMaps/0/nz.jpg'
    ])


    // Physics

    const world = new CANNON.World();

    world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true;

    world.gravity.set(0, -9.81, 0)


    // Materials

    const defaultMaterial = new CANNON.Material('concrete')
/*    const plasticMaterial = new CANNON.Material('plastic')*/

    const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.7
      });

    world.addContactMaterial(defaultContactMaterial)


    //const sphereShape = new CANNON.Sphere(0.5);
    //const sphereBody = new CANNON.Body({
    //  mass: 1,
    //  position: new CANNON.Vec3(0, 3, 0),
    //  shape: sphereShape,
    //  material: defaultMaterial
    //});
    //sphereBody.applyLocalForce(new CANNON.Vec3(100, 0, 0), sphereBody.position)
    //world.addBody(sphereBody)


    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();
    floorBody.mass = 0;
    floorBody.addShape(floorShape)
    floorBody.material = defaultMaterial
    world.addBody(floorBody)

    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 2 / 4
    )


    /**
     * Test sphere
     */
    //const sphere = new THREE.Mesh(
    //  new THREE.SphereGeometry(0.5, 32, 32),
    //  new THREE.MeshStandardMaterial({
    //    metalness: 0.3,
    //    roughness: 0.4,
    //    envMap: environmentMapTexture,
    //    envMapIntensity: 0.5
    //  })
    //)
    //sphere.castShadow = true
    //sphere.position.y = 0.5
    //scene.add(sphere)





    /**
     * Floor
     */
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
      })
    )
    floor.receiveShadow = true
    floor.rotation.x = - Math.PI * 0.5
    scene.add(floor)

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.camera.left = - 7
    directionalLight.shadow.camera.top = 7
    directionalLight.shadow.camera.right = 7
    directionalLight.shadow.camera.bottom = - 7
    directionalLight.position.set(5, 5, 5)
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
    camera.position.set(- 3, 3, 3)
    scene.add(camera)

    // Controls
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas!
    })
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


    // Utilities

    const objectsToUpdate: {
      mesh: THREE.Mesh,
      body: CANNON.Body;
    }[] = []


    // Sphere

    const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture
    })
    const createSphere = (radius: number, position: THREE.Vector3) =>
    {
      const mesh = new THREE.Mesh(
        sphereGeometry,
        sphereMaterial
      )
      mesh.scale.set(radius, radius, radius)
      mesh.castShadow = true;
      mesh.position.copy(position);
      scene.add(mesh)

      // CANON JS BODY

      const shape = new CANNON.Sphere(radius)
      const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
      })
      body.position.x = position.x;
      body.position.y = position.y;
      body.position.z = position.z;


      body.addEventListener('collide', playHitSound);

      world.addBody(body);

      // Save in object to update
      objectsToUpdate.push({ mesh: mesh, body: body })

      console.log(objectsToUpdate)
    }

    createSphere(0.5, new THREE.Vector3(0,3,0))


    // Box
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture
    })

    const createBox = (width: number, height: number, depth: number, position: THREE.Vector3) => {
      const mesh = new THREE.Mesh(
        boxGeometry,
        boxMaterial
      )
      mesh.scale.set(width, height, depth)
      mesh.castShadow = true;
      mesh.position.copy(position);
      scene.add(mesh)

      // CANON JS BODY

      const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
      const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
      })
      body.position.x = position.x;
      body.position.y = position.y;
      body.position.z = position.z;


      body.addEventListener('collide', playHitSound);



      world.addBody(body);

      // Save in object to update
      objectsToUpdate.push({ mesh: mesh, body: body })

      console.log(objectsToUpdate)
    }

    createBox(0.5, 0.5, 0.5, new THREE.Vector3(0, 1, 0))


    // Animate

    const clock = new THREE.Clock()
    let oldElapsedTime = 0
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      const deltaTime =  elapsedTime - oldElapsedTime
      oldElapsedTime = elapsedTime



/*      sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);*/



      //console.log(deltaTime)
      // Update Physics World
      world.step(1 / 60, deltaTime, 3)


      for (const object of objectsToUpdate) {
        object.mesh.position.x = object.body.position.x
        object.mesh.position.y = object.body.position.y
        object.mesh.position.z = object.body.position.z


        object.mesh.quaternion.x = object.body.quaternion.x
        object.mesh.quaternion.y = object.body.quaternion.y
        object.mesh.quaternion.z = object.body.quaternion.z
        object.mesh.quaternion.w = object.body.quaternion.w


      }

      //sphere.position.x = sphereBody.position.x;
      //sphere.position.y = sphereBody.position.y;
      //sphere.position.z = sphereBody.position.z;

      //console.log(sphereBody.position)

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
