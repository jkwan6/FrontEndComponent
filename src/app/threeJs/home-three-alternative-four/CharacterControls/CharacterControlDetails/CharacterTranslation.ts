import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Capsule } from 'three/examples/jsm/math/Capsule'
import { Octree } from 'three/examples/jsm/math/Octree'
import { IButtonPressed, IColliderVariables, IGuiParams, IPlayerVariables, ITempVariables, IThreeJsMainComponents } from '../CharacterControlsUtils'

export class CharacterTranslation {

  constructor(
    buttonPressed: IButtonPressed,
    threeJsMainComponents: IThreeJsMainComponents,
    tempVariables: ITempVariables,
    guiParams: IGuiParams,
    playerVariables: IPlayerVariables,
    colliderVariables: IColliderVariables
  ) {
    this.buttonPressed = buttonPressed;
    this.threeJsMainComponents = threeJsMainComponents;
    this.tempVariables = tempVariables;
    this.guiParams = guiParams;
    this.playerVariables = playerVariables;
    this.colliderVariables = colliderVariables;
  }

  buttonPressed: IButtonPressed;
  threeJsMainComponents: IThreeJsMainComponents;
  tempVariables: ITempVariables;
  guiParams: IGuiParams;
  playerVariables: IPlayerVariables;
  colliderVariables: IColliderVariables;

  calculateTranslation(delta: number) {
    // Falling down Algo
    if (this.playerVariables.playerIsOnGround) {
      this.playerVariables.playerVelocity.y = delta * this.guiParams.gravity;
    } else {
      this.playerVariables.playerVelocity.y += delta * this.guiParams.gravity;
    }
    this.playerVariables.player.mesh.position.addScaledVector(this.playerVariables.playerVelocity, delta);

    // move the player
    const angle = this.threeJsMainComponents.controls!.getAzimuthalAngle();
    if (this.buttonPressed.fwdPressed) {
      this.tempVariables.tempVector.set(0, 0, - 1).applyAxisAngle(this.tempVariables.upVector, angle);
      this.playerVariables.player.mesh.position.addScaledVector(this.tempVariables.tempVector, this.guiParams.playerSpeed * delta);
    }
    if (this.buttonPressed.bkdPressed) {
      this.tempVariables.tempVector.set(0, 0, 1).applyAxisAngle(this.tempVariables.upVector, angle);
      this.playerVariables.player.mesh.position.addScaledVector(this.tempVariables.tempVector, this.guiParams.playerSpeed * delta);
    }
    if (this.buttonPressed.lftPressed) {
      this.tempVariables.tempVector.set(- 1, 0, 0).applyAxisAngle(this.tempVariables.upVector, angle);
      this.playerVariables.player.mesh.position.addScaledVector(this.tempVariables.tempVector, this.guiParams.playerSpeed * delta);
    }
    if (this.buttonPressed.rgtPressed) {
      this.tempVariables.tempVector.set(1, 0, 0).applyAxisAngle(this.tempVariables.upVector, angle);
      this.playerVariables.player.mesh.position.addScaledVector(this.tempVariables.tempVector, this.guiParams.playerSpeed * delta);
    }
    this.playerVariables.player.mesh.updateMatrixWorld();

    // adjust player position based on collisions
    const capsuleInfo = this.playerVariables.player.capsuleInfo;
    this.tempVariables.tempBox.makeEmpty();
    this.tempVariables.tempMat.copy(this.colliderVariables.collider!.matrixWorld).invert();
    this.tempVariables.tempSegment.copy(capsuleInfo.segment);

    // get the position of the capsule in the local space of the collider
    this.tempVariables.tempSegment.start.applyMatrix4(this.playerVariables.player.mesh.matrixWorld).applyMatrix4(this.tempVariables.tempMat);
    this.tempVariables.tempSegment.end.applyMatrix4(this.playerVariables.player.mesh.matrixWorld).applyMatrix4(this.tempVariables.tempMat);

    // get the axis aligned bounding box of the capsule
    this.tempVariables.tempBox.expandByPoint(this.tempVariables.tempSegment.start);
    this.tempVariables.tempBox.expandByPoint(this.tempVariables.tempSegment.end);
    this.tempVariables.tempBox.min.addScalar(- capsuleInfo.radius);
    this.tempVariables.tempBox.max.addScalar(capsuleInfo.radius);

    this.colliderVariables.collider!.geometry.boundsTree!.shapecast({
      intersectsBounds: (box: any) => box.intersectsBox(this.tempVariables.tempBox),
      intersectsTriangle: (tri: any) => {
        // check if the triangle is intersecting the capsule and adjust the
        // capsule position if it is.
        const triPoint = this.tempVariables.tempVector;
        const capsulePoint = this.tempVariables.tempVector2;
        const distance = tri.closestPointToSegment(this.tempVariables.tempSegment, triPoint, capsulePoint);

        if (distance < capsuleInfo.radius) {
          const depth = capsuleInfo.radius - distance;
          const direction = capsulePoint.sub(triPoint).normalize();
          this.tempVariables.tempSegment.start.addScaledVector(direction, depth);
          this.tempVariables.tempSegment.end.addScaledVector(direction, depth);
        }
      }
    });

    // get the adjusted position of the capsule collider in world space after checking
    // triangle collisions and moving it. capsuleInfo.segment.start is assumed to be
    // the origin of the player model.
    const newPosition = this.tempVariables.tempVector;
    newPosition.copy(this.tempVariables.tempSegment.start).applyMatrix4(this.colliderVariables.collider!.matrixWorld);

    // check how much the collider was moved
    const deltaVector = this.tempVariables.tempVector2;
    deltaVector.subVectors(newPosition, this.playerVariables.player.mesh.position);

    // if the player was primarily adjusted vertically we assume it's on something we should consider ground
    this.playerVariables.playerIsOnGround = deltaVector.y > Math.abs(delta * this.playerVariables.playerVelocity.y * 0.25);
    const offset = Math.max(0.0, deltaVector.length() - 1e-5);
    deltaVector.normalize().multiplyScalar(offset);

    // adjust the player model
    this.playerVariables.player.mesh.position.add(deltaVector);

    if (!this.playerVariables.playerIsOnGround) {
      deltaVector.normalize();
      this.playerVariables.playerVelocity.addScaledVector(deltaVector, - deltaVector.dot(this.playerVariables.playerVelocity));
    } else {
      this.playerVariables.playerVelocity.set(0, 0, 0);
    }

  }
}
