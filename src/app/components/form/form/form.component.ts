import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'tester-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  data: any[] = [];
  errors: string = '';
  httpStatusCode: number = 0;
  disabled: boolean = false;
  isGET: boolean = true;
  testerForm: FormGroup;
  @Output() returnRequest = new EventEmitter();

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.testerForm = this.fb.group({
      apiUrl: ['', Validators.required],
      apiToken: ['', Validators.required],
      apiBody: [''],
      apiMethod: ['get']
    });
  }

  ngOnInit(): void {
    this.disabled = true;
    this.formChange();
  }


  public formChange() {
    this.testerForm.valueChanges.subscribe(() => {
      this.isGET = this.testerForm.controls.apiMethod.value === 'get' ? true : false;
      this.disabled = (this.testerForm.status === 'VALID') ? false : true;
    });
  }

  sendData(): void {
    console.log('sendData', this.testerForm);
    const apiUrl = this.testerForm.controls.apiUrl.value;
    const apiToken = this.testerForm.controls.apiToken.value;
    const apiBody =this.testerForm.controls.apiBody.value;
    const apiMethod = this.testerForm.controls.apiMethod.value;

    switch (apiMethod) {
      case 'get':
        this.requestGet(apiUrl, apiToken);
        break;
      case 'post':
      case 'patch':
      case 'put':
        this.requestBody(apiMethod, apiUrl, apiToken, apiBody);
      break;
      default:
        break;
    }
  }

  private requestGet(apiUrl: string, apiToken: string) {
    this.apiService.serverRequest('get', apiUrl, apiToken).subscribe(
      (result: any) => {
        this.data = result;
        this.returnRequest.emit(this.data);
      },
      error => {
        console.error("ERROR: ", error);
        this.errors = error.message;
        this.httpStatusCode = error.status;
        this.returnRequest.emit(this.errors);
      }
    );
  }

  private requestBody(apiMethod: string, apiUrl: string, apiToken: string, apiBody?: any) {
    this.apiService.serverRequest(apiMethod, apiUrl, apiToken, apiBody).subscribe(
      (result: any) => {
        this.data = result;
        this.returnRequest.emit(this.data);
      },
      error => {
        console.error("ERROR: ", error);
        this.errors = error.message;
        this.httpStatusCode = error.status;
        this.returnRequest.emit(this.errors);
      }
    );
  }

}
