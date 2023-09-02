import * as THREE from 'three'
import { DIRECTIONS, modelAction } from '../CharacterControlsUtils'

export class CharacterWalkDirection {

  constructor(
    camera: THREE.Camera,
    model: THREE.Group,
  ) {
    this.camera = camera;
    this.model = model;
  }
  model: THREE.Group
  camera: THREE.Camera;

  // Resetting Walk Direction
  calculateWalkDirection(keysPressed: string, currentAction: string): THREE.Vector3 {
    let walkDirection = new THREE.Vector3(0, 0, 0);
    let rotateQuarternion = new THREE.Quaternion();
    let rotateAngle = new THREE.Vector3(0, 1, 0);

    if (currentAction == modelAction.run || currentAction == modelAction.walk) {
      // calculate towards camera direction
      var angleYCameraDirection = Math.atan2(
        (this.camera.position.x - this.model.position.x),
        (this.camera.position.z - this.model.position.z))
      // diagonal movement angle offset
      var directionOffset = this.directionOffset(keysPressed)

      // rotate model
      rotateQuarternion.setFromAxisAngle(rotateAngle, angleYCameraDirection + directionOffset)
      this.model.quaternion.rotateTowards(rotateQuarternion, Math.PI * 0.1)

      // calculate direction
      this.camera.getWorldDirection(walkDirection)
      walkDirection.y = 0;
      walkDirection.normalize(); // Unit Vector
      walkDirection.applyAxisAngle(rotateAngle, directionOffset)
    }
    return walkDirection;
  }

  private directionOffset(keysPressed: any) {
    var directionOffset = 0 // W

    if (keysPressed[DIRECTIONS.FORWARD] && keysPressed[DIRECTIONS.LEFT]) { directionOffset = Math.PI / 4; }
    else if (keysPressed[DIRECTIONS.FORWARD] && keysPressed[DIRECTIONS.RIGHT]) { directionOffset = - Math.PI / 4; }
    else if (keysPressed[DIRECTIONS.BACKWARD] && keysPressed[DIRECTIONS.LEFT]) { directionOffset = Math.PI / 4 + Math.PI / 2; }
    else if (keysPressed[DIRECTIONS.BACKWARD] && keysPressed[DIRECTIONS.RIGHT]) { directionOffset = -Math.PI / 4 - Math.PI / 2; }
    else if (keysPressed[DIRECTIONS.BACKWARD]) { directionOffset = Math.PI; }
    else if (keysPressed[DIRECTIONS.LEFT]) { directionOffset = Math.PI / 2; }
    else if (keysPressed[DIRECTIONS.RIGHT]) { directionOffset = - Math.PI / 2; }

    return directionOffset
  }
}
