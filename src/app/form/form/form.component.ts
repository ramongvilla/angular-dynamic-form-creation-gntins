import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Validators, FormBuilder, FormControl, FormGroup, AbstractControl } from '@angular/forms';

export interface form {
  id: string,
  formGroup: FormGroup,
  metaData: any[],
  transactionalData: any[],
}

@Component({
  selector: 'json-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  forms: form[] = [];
  @Input() formJson: any;
  @Input() debug: boolean = false;
  @Output() output: EventEmitter<FormGroup> = new EventEmitter();
  fg: FormGroup;

  constructor(
    private fb: FormBuilder,
    ) { }

  ngOnInit() { }

  createForm() {
    if (this.formJson == null) return;
    let dataObject = this.formJson;
    let objectProps = Object.keys(dataObject).map(prop => {
      return Object.assign({}, { key: prop }, dataObject[prop]);
    });
    debugger;
    const formGroup = {};
    for (let prop of Object.keys(dataObject)) {
      formGroup[prop] = new FormControl(dataObject[prop].value || '', this.mapValidators(dataObject[prop].validation));
    }

    this.fg = new FormGroup(formGroup)
    const form: form = {
      id: new Date().getUTCMilliseconds().toString(),
      formGroup: this.fg,
      metaData: objectProps,
      transactionalData: [],
    }
    this.fg.valueChanges.subscribe(values => {
      this.output.emit(this.fg);
    });
    this.forms.push(form);
    return form;
  }

  private mapValidators(validators) {
    const formValidators = [];

    if (validators) {
      for (const validation of Object.keys(validators)) {
        if (validation === 'required') {
          formValidators.push(Validators.required);
        } else if (validation === 'minLength') {
          formValidators.push(Validators.minLength(validators[validation]));
        } else if (validation === 'maxLength') {
          formValidators.push(Validators.maxLength(validators[validation]));
        }
      }
    }

    return formValidators;
  }

  public hasValidator(controlName: string, validator: string): boolean {
    let control: AbstractControl = this.fg.controls[controlName];
    switch (validator) {
      case 'required':
        control.setValue('');  // as is appropriate for the control
      case 'pattern':
        control.setValue('3'); // given you have knowledge of what the pattern is - say its '\d\d\d'
    }
    if (control.validator != null && control.validator(control) != null) {
      let hasValidator: boolean = !!control.validator(control).hasOwnProperty(validator);
      return hasValidator;
    }
    return false;
  }

  // updateForm(id: string, transactionalData: any) {
  //   debugger;
  //   this.store.dispatch(new actions.Update(id, { transactionalData: transactionalData }));
  // }

  // deleteForm(id: string) {
  //   this.store.dispatch(new actions.Delete(id));
  // }

  onSubmit(form: any) {

  }
}