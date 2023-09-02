import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

@Component({
  selector: 'app-three-js-page-six',
  templateUrl: './three-js-page-six.component.html',
  styleUrls: ['./three-js-page-six.component.css']
})
export class ThreeJsPageSixComponent implements AfterViewInit {

  constructor() { }

  @ViewChild('test1') test: any;

    ngAfterViewInit(): void {
      const gui = new dat.GUI()
      // Canvas
      const canvas = document.querySelector('canvas.webgl')

      const container = document.getElementById('test1')

      // Scene
      const scene = new THREE.Scene()

      /**
       * Objects
       */
      const object1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshBasicMaterial({ color: '#ff0000' })
      )
      object1.position.x = - 2

      const object2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshBasicMaterial({ color: '#ff0000' })
      )

      const object3 = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshBasicMaterial({ color: '#ff0000' })
      )
      object3.position.x = 2

      scene.add(object1, object2, object3)


      // Raycaster
      const rayCaster = new THREE.Raycaster();
      //const origin = new THREE.Vector3(-3, 0, 0);
      //const direction = new THREE.Vector3(10, 0, 0);
      //direction.normalize;
      //pointerRayCaster.set(origin, direction);

      //const intersect = pointerRayCaster.intersectObject(object2);
      //const intersects = pointerRayCaster.intersectObjects([object1, object2, object3]);

      //console.log(intersect)
      //console.log(intersects)
      /**
       * Sizes
       */
  
      const sizes = {
        width: this.test!.nativeElement.offsetWidth,
        height: this.test!.nativeElement.offsetHeight
      }

      window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = this.test!.nativeElement.offsetWidth
        sizes.height = this.test!.nativeElement.offsetHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      })



      // Mouse 
      const mouse = new THREE.Vector2();

      container!.addEventListener('mousemove', (event: any) => {
        //console.log("mosuemove")
        mouse.x = (event.layerX / sizes.width - 0.5) * 2;
        mouse.y = - (event.layerY / sizes.height - 0.5) * 2;
        console.log(mouse)
      });







      /**
       * Camera
       */
      // Base camera
      const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
      camera.position.z = 3
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


        // animate objects
        object1.position.y = (Math.sin(elapsedTime * 0.51)) * 3;
        object2.position.y = (Math.sin(elapsedTime * 0.1)) * 10;
        object3.position.y = (Math.sin(elapsedTime * 0.3)) * 10;


        // Cast a Ray
        rayCaster.setFromCamera(mouse, camera);



        //const origin = new THREE.Vector3(-3, 0, 0);
        //const direction = new THREE.Vector3(10, 0, 0);
        //direction.normalize();
        //pointerRayCaster.set(origin, direction)


        ////const intersect = pointerRayCaster.intersectObject(object2);


        const objectsToTest = [object1, object2, object3]
        const intersects = rayCaster.intersectObjects(objectsToTest);


        //if (intersects.length > 0) {
        //  console.log(intersects.length);
        //}

        for (let object of objectsToTest) {
          let materialColor = new THREE.Color('red');
          object.material.color.set(materialColor)
          //console.log(varX.object.material)

        }

        for (let intersect of intersects) {
          let varX: any;
          varX = intersect as unknown as THREE.Object3D;
          let materialColor = new THREE.Color('blue');
          varX.object.material.color.set(materialColor)
          //console.log(varX.object.material)
        }


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
