import RAPIER from "@dimforge/rapier3d";

export class GravitySimulation{
  timeElapsed: number;
  previousYTranslate!: number;
  rigidBody: RAPIER.RigidBody;
  currentYTranslate!: number;
  displacement!: number;

  constructor(rigidBody: RAPIER.RigidBody) {
    this.timeElapsed = 0;
    this.rigidBody = rigidBody;
    this.currentYTranslate = 0;
  }

  resetGravitySimulation() {
    this.timeElapsed = 0;
    this.displacement = 0;
  }

  getDisplacement(deltaTime: number): number {
    this.previousYTranslate = this.currentYTranslate;
    this.currentYTranslate = this.rigidBody.translation().y;
    let previousTime: number;
    let currentTime: number;

    var translationDifference = Math.abs(this.currentYTranslate - this.previousYTranslate);
    if (translationDifference < 0.9 * this.displacement) {
      this.resetGravitySimulation();
    }





    //if (this.currentYTranslate > this.previousYTranslate) {
    //  this.resetGravitySimulation();
    //}

    previousTime = this.timeElapsed;
    currentTime = this.timeElapsed + deltaTime;

    if (currentTime < 8) {
      this.displacement =
        0.05 + (9.81 * currentTime * currentTime) -
        (9.81 * previousTime * previousTime);
    }
    else {
      this.displacement = 0.4 + 76 *  2 * (currentTime - previousTime);
    }
/*    console.log(displacement)*/
    this.timeElapsed += deltaTime;
/*    console.log(this.displacement)*/
    return this.displacement
  }
}
