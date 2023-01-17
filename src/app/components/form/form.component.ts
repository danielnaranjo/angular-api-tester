import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'tester-form',
  template: `
  <form [formGroup]="testerForm" (change)="formChange()">
      <input type="text" formControlName="apiUrl" placeholder="API URL" /><br />
      <textarea formControlName="apiToken" placeholder="TOKEN" rows="10"></textarea
      ><br />
      <select formControlName="apiMethod">
          <option value="get">GET</option>
          <option value="post">POST</option>
          <option value="put">PUT</option>
          <option value="patch">PATCH</option>
          <option value="delete">DELETE</option>
      </select><br />
      <textarea *ngIf="!isGET" formControlName="apiBody" placeholder="BODY" rows="10"></textarea
          ><br />
      <button (click)="sendData()" [disabled]="disabled">Probar servicio API</button>
      <!-- <pre *ngIf="data">{{ data | json }}</pre> -->
  </form>
`,
  styles: [`
  * {
    margin: 10px;
    padding: 20px;
  }

  textarea,
    input {
      width: 550px;
  }
  `]
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
      apiUrl: ['https://', Validators.required],
      apiToken: ['', Validators.required],
      apiBody: [''],
      apiMethod: ['get'],
    });
  }

  ngOnInit(): void {
    this.disabled = true;
    this.formChange();
  }


  public formChange() {
    this.testerForm.valueChanges.subscribe(() => {
      this.isGET = this.testerForm.controls['apiMethod'].value === 'get' ? true : false;
      this.disabled = (this.testerForm.status === 'VALID') ? false : true;
    });
  }

  sendData(): void {
    const apiUrl = this.testerForm.controls['apiUrl'].value;
    const apiToken = this.testerForm.controls['apiToken'].value;
    const apiBody =this.testerForm.controls['apiBody'].value;
    const apiMethod = this.testerForm.controls['apiMethod'].value;
    // console.log('sendData', apiMethod);
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
    this.apiService.serverRequest('get', apiUrl, apiToken, null)
    .pipe(
      tap((d) => console.log('tap',d)),
    )
    .subscribe(
      (result: any) => {
        this.data = result;
        this.returnRequest.emit(this.data);
      },
      // error => {
      //   console.error("ERROR: ", error);
      //   this.errors = error.message;
      //   this.httpStatusCode = error.status;
      //   this.returnRequest.emit(this.errors);
      // }
    );
  }

  private requestBody(apiMethod: string, apiUrl: string, apiToken: string, apiBody?: any) {
    this.apiService.serverRequest(apiMethod, apiUrl, apiToken, apiBody)
    .pipe(
      tap((d) => console.log('tap',d)),
    )
    .subscribe(
      (result: any) => {
        this.data = result;
        const curlMessage = `response ${this.data}`;
        this.returnRequest.emit(curlMessage);
      },
      // error => {
      //   console.error("ERROR: ", error);
      //   this.errors = error.message;
      //   this.httpStatusCode = error.status;
      //   this.returnRequest.emit(this.errors);
      // }
    );
  }

}
