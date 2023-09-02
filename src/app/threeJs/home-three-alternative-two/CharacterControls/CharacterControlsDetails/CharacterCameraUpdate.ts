import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class CharacterCameraUpdate {
  camera: THREE.Camera;
  orbitControl: OrbitControls
  cameraTarget = new THREE.Vector3()

  constructor(
    camera: THREE.Camera,
    orbitControls: OrbitControls,
  ) {
    this.camera = camera;
    this.orbitControl = orbitControls
  }


  public updateCameraTarget(model: THREE.Group, translation: RAPIER.Vector3) {

    var cameraOffset = this.cameraPositionRelativeToModel(model)

    // move camera
    this.camera.position.x = translation.x + cameraOffset.x
    this.camera.position.y = translation.y + cameraOffset.y
    this.camera.position.z = translation.z + cameraOffset.z

    // update camera target
    this.cameraTarget.x = translation.x
    this.cameraTarget.y = translation.y + 1.5
    this.cameraTarget.z = translation.z
    this.orbitControl.target = this.cameraTarget
  }

  public cameraPositionRelativeToModel(model: THREE.Group): THREE.Vector3 {
    return this.camera.position.sub(model.position);
  }

}

