import { Component, Injectable, OnDestroy } from "@angular/core";
import * as RAPIER from '@dimforge/rapier3d'
import { IBoxDimensions } from './home-three-alternative-two.component'


@Injectable({
  providedIn: 'any'
}) // DI Decorator
export class RapierPhysicsWorld {

  world!: RAPIER.World;

  constructor() {
    var gravity = new RAPIER.Vector3(0, -9.81, 0);
    this.world = new RAPIER.World(gravity);
  }

  public instantiatePhysicsWorld(): RAPIER.World {
    var broadPhase = new RAPIER.BroadPhase();
    this.world.broadPhase = broadPhase;
    return this.world;
  }


  public createRigidBox(boxParameters: IBoxDimensions, boxPosition: RAPIER.Vector3): RAPIER.RigidBody {
    // Theres some factor applied to dimensions
    boxParameters = { height: boxParameters.height / 2, length: boxParameters.length / 2, width: boxParameters.width / 2 };
    var bodyType = RAPIER.RigidBodyDesc.dynamic();
    var rigidBody = this.world.createRigidBody(bodyType);
    rigidBody.setTranslation(boxPosition, true);
    var colliderType = RAPIER.ColliderDesc.cuboid(boxParameters.length, boxParameters.height, boxParameters.width);
    this.world.createCollider(colliderType, rigidBody);
    return rigidBody;
  }

  public createPhysicsFloor(scale: RAPIER.Vector3, nsubdivs: number, heights: number[]): RAPIER.RigidBody {
    let groundBodyDesc = RAPIER.RigidBodyDesc.fixed();
    let groundBody = this.world.createRigidBody(groundBodyDesc);
    let groundCollider = RAPIER.ColliderDesc.heightfield(
      nsubdivs, nsubdivs, new Float32Array(heights), scale
    );
    this.world.createCollider(groundCollider, groundBody);
    return groundBody;
  }

}
