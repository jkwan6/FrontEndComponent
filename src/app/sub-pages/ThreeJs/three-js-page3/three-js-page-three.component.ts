import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import { ScrollService } from '../../../service/ScrollService/ScrollService';

@Component({
  /*//selector: 'app-three-js-page-three',*/
  templateUrl: './three-js-page-three.component.html',
  styleUrls: ['./three-js-page-three.component.css']
})

export class ThreeJsPageThreeComponent implements AfterViewInit {

  // PROPERTIES
  scene!: THREE.Scene;
  geometry!: THREE.BoxGeometry;
  material!: THREE.MeshBasicMaterial;
  mesh!: THREE.Mesh;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  axesHelper!: THREE.AxesHelper;
  controls!: OrbitControls;
  @ViewChild('divElement') divElement: any;

  constructor(private scrollService: ScrollService) {  }
  ngAfterViewInit(): void {

    const test1 = document.getElementById('test1')
    test1!.addEventListener('scroll', () => {
      this.scrollService.setScrollY(test1!.scrollTop);
      this.scrollService.setTotalScrollHeight(test1!.scrollHeight)
    })

    const test2 = document.getElementById('test2')
  }

}
