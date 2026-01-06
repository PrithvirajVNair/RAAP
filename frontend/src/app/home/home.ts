import { AfterViewInit, Component } from '@angular/core';
import { Header } from "../header/header";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { Api } from '../service/api';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  imports: [Header, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {

  token: any = ""
  userDetails: any = ""
  reqHeader: object = {}
  toggleCreateValue: boolean = false
  companyForm: FormGroup
  hasNoCompany: boolean = false

  constructor(private fb: FormBuilder, private api: Api) {
    this.companyForm = this.fb.group({
      name: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9 ]*")]],
      industry: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9 ]*")]]
    })
  }

  createCompany() {
    this.reqHeader = {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    }
    if (this.companyForm.valid) {
      const name = this.companyForm.value.name
      const industry = this.companyForm.value.industry
      this.api.createCompanyAPI({ name, industry }, this.reqHeader).subscribe({
        next: (res: any) => {
          console.log(res);
          alert(res)
        },
        error: (reason: any) => {
          console.log(reason);

          if (reason.status == 400) {
            alert(reason.error)
          }
          else if (reason.status == 404) {
            alert(reason.error)
          }
          else if (reason.status == 401) {
            alert(reason.error)
          }
          else {
            alert("Something Went Wrong! Please Try Again...")
          }
        }
      })
    }
  }

  toggelCreate() {
    if (this.toggleCreateValue == false) {
      this.toggleCreateValue = true
    }
    else {
      this.toggleCreateValue = false
    }
  }

  ngOnInit() {
    if (sessionStorage.getItem('token')) {
      this.token = sessionStorage.getItem('token')
      this.userDetails = JSON.parse(sessionStorage.getItem('user') || "")
      if(this.userDetails?.companyId != null && this.userDetails?.leftCompanyAt ==null){
          this.hasNoCompany=false
      }
      else{
        this.hasNoCompany=true
      }
    }
  }

  ngAfterViewInit(): void {
  const ctx = document.getElementById('riskChart') as HTMLCanvasElement;

  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Low', 'Medium', 'High'],
      datasets: [{
        label: 'Risks',
        data: [5, 3, 2], // replace with API data later
        backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks:{
            stepSize: 1,
            precision: 0
          }
        }
      }
    }
  });
}



}
