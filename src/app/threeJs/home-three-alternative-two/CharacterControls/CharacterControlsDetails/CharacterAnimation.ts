import * as THREE from 'three'

export class CharacterAnimation {
  fadeDuration: number = 0.2
  animationMap: Map<string, THREE.AnimationAction>
  mixer: THREE.AnimationMixer

  constructor(animationMap: Map<string, THREE.AnimationAction>, mixer: THREE.AnimationMixer ) {
    this.animationMap = animationMap;
    this.mixer = mixer
  }

  animateCharacter(
    previousAction: string,
    currentAction: string,
    delta: number
  ){
    if (previousAction != currentAction) {
      const toPlay = this.animationMap.get(currentAction)
      const current = this.animationMap.get(previousAction)
      current!.fadeOut(this.fadeDuration)
      toPlay!.reset().fadeIn(this.fadeDuration).play();
      previousAction = currentAction
    }
    this.mixer.update(delta)
  }
}
