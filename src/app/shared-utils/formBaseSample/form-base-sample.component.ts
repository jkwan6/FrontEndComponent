import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { share } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { IComments } from '../../interface/IComments';
import { BaseRepository } from '../../repository/BaseRepository';
import { SharedUtils } from '../SharedUtils';

@Component({
  selector: 'form-base-sample',
  templateUrl: './form-base-sample.component.html',
  styleUrls: ['./form-base-sample.component.css']
})
export class FormBaseSample implements OnInit {

  formVariable!: IComments;     // Update Type Based on Form Parameters
  form!: FormGroup;             // ReactiveForm
  testArray!: string[];

  constructor() {}

  ngOnInit(): void {
    this.InitialializeFormGroup();
    this.testArray = ["string1", "string2", "string3", "string4", "string5"]
  }

  // #region --> Code Module to Initialize FormGroup
  private InitialializeFormGroup() {

    this.formVariable = { author: "", commentsDescription: "" };            // Gotta initialize First

    this.form = new FormGroup({});
    // Add Parameters to Form Group
    this.form.addControl(
      SharedUtils.nameof(this.formVariable, x => x.author!),                 // Update Property Here
      new FormControl("", Validators.required)                              // "" To initialize empty form
    );
    this.form.addControl(
      SharedUtils.nameof(this.formVariable, x => x.commentsDescription),    // Update Property Here
      new FormControl("", Validators.required)                              // "" To initialize empty form
    );
    this.form.addControl(
      "test1",                                                              // Update Property Here
      new FormControl("", Validators.required)                              // "" To initialize empty form
    );
  }
  // #endregion

  // Assign User Values from UI to class property
  public onSubmit() {
    this.formVariable = {
      author:
        this.form.controls[SharedUtils.nameof(this.formVariable, x => x.author!)].value,
      commentsDescription:
        this.form.controls[SharedUtils.nameof(this.formVariable, x => x.commentsDescription)].value,
    }
  }
}
