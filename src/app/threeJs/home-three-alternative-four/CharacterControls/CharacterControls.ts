import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as RAPIER from '@dimforge/rapier3d'
import { Capsule } from 'three/examples/jsm/math/Capsule'
import { Octree } from 'three/examples/jsm/math/Octree'
import { CharacterControlsUtils, DIRECTIONS, IButtonPressed, IColliderVariables, IGuiParams, IKeysPressed, IPlayerVariables, ITempVariables, IThreeJsMainComponents } from './CharacterControlsUtils'
import { Injectable } from '@angular/core'
import { CharacterAnimation } from './CharacterControlDetails/CharacterAnimation'
import { CharacterWalkDirection } from './CharacterControlDetails/CharacterWalkDirection'
import { CharacterTranslation } from './CharacterControlDetails/CharacterTranslation'

export class CharacterControls {

  constructor(
    playerVariables: IPlayerVariables,
    guiParams: IGuiParams,
    tempVariables: ITempVariables,
    buttonPressed: IButtonPressed,
    threeJsMainComponents: IThreeJsMainComponents,
    colliderVariables: IColliderVariables,
    keysPressed: any
  ) {
    this.playerVariables = playerVariables,
    this.guiParams = guiParams,
    this.tempVariables = tempVariables,
    this.buttonPressed = buttonPressed,
    this.threeJsMainComponents = threeJsMainComponents
    this.colliderVariables = colliderVariables
    this.keysPressed = keysPressed
    this.animation = new CharacterAnimation(playerVariables.animatedVariables.animationsMap!, playerVariables.animatedVariables.mixer!);
    this.characterWalkDirection = new CharacterWalkDirection(
      this.threeJsMainComponents.camera,
      this.playerVariables.animatedVariables.mesh
    );
    this.characterTranslation = new CharacterTranslation(
      buttonPressed,
      threeJsMainComponents,
      tempVariables,
      guiParams,
      playerVariables,
      colliderVariables
    );
  }
  keysPressed: any;
  threeJsMainComponents: IThreeJsMainComponents;
  playerVariables: IPlayerVariables;
  guiParams: IGuiParams;
  tempVariables: ITempVariables;
  buttonPressed: IButtonPressed;
  colliderVariables: IColliderVariables;
  toggleRun: boolean = true;
  animation: CharacterAnimation;
  characterWalkDirection: CharacterWalkDirection;
  characterTranslation: CharacterTranslation;

  public switchRunToggle() {
    this.toggleRun = !this.toggleRun
  }

  updatePlayer(delta: any) {

    this.playerVariables.animatedVariables.mesh.position.set(
      this.playerVariables.player.mesh.position.x,
      this.playerVariables.player.mesh.position.y - 1.5,
      this.playerVariables.player.mesh.position.z,
    )

    // Animations and Current Action
    var directionPressed = Object.values(DIRECTIONS).some(key => this.keysPressed[key] == true);
    var actions = CharacterControlsUtils.previousAndCurrentAction(
      this.playerVariables.animatedVariables.currentAction!,
      directionPressed,
      this.toggleRun);

    // Actions
    var previousAction = actions[0];
    this.playerVariables.animatedVariables.currentAction = actions[1];
    this.animation.animateCharacter(previousAction, this.playerVariables.animatedVariables.currentAction, delta);

    // Walk Direction
    let walkDirection = this.characterWalkDirection.calculateWalkDirection(
      this.keysPressed,
      this.playerVariables.animatedVariables.currentAction!);

    // Character Translation
    this.characterTranslation.calculateTranslation(delta)

    // adjust the camera
    this.threeJsMainComponents.camera.position.sub(this.threeJsMainComponents.controls!.target);
    this.threeJsMainComponents.controls!.target.copy(this.playerVariables.player.mesh.position);
    this.threeJsMainComponents.camera.position.add(this.playerVariables.player.mesh.position);
  }

}
