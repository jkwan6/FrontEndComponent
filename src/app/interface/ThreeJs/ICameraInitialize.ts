export interface ICameraInitialize {
  position: {
    x: number,
    y: number,
    z: number
  },
  aspectRatio: number,
  fieldOfView: number,
  cameraType: cameraType
}

export const enum cameraType {
  PerspectiveCamera = 'PerspectiveCamera'
}
