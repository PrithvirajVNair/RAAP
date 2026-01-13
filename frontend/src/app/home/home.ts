import { AfterViewInit, ChangeDetectorRef, Component, signal } from '@angular/core';
import { Header } from "../header/header";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { Api } from '../service/api';
import Chart from 'chart.js/auto';
import { RouterLink } from "@angular/router";
import { Sidebar } from "../sidebar/sidebar";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Header, ReactiveFormsModule, Sidebar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home implements AfterViewInit {
  chart!: Chart;
  token: any = ""
  userDetails: any = ""
  reqHeader: object = {}
  toggleCreateValue: boolean = false
  toggleRiskValue: boolean = false
  companyForm: FormGroup
  riskForm: FormGroup
  hasNoCompany: boolean = false
  companyRisks = signal<any>([])
  companyUsers = signal<any>([])
  company = signal<any>({})
  highRisk: number = 0
  mediumRisk: number = 0
  lowRisk: number = 0

  constructor(private fb: FormBuilder, private api: Api, private cdr: ChangeDetectorRef) {
    this.companyForm = this.fb.group({
      name: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9 ]*")]],
      industry: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9 ]*")]]
    })
    this.riskForm = this.fb.group({
      title: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9 ]*")]],
      description: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9 ]*")]],
      category: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9 ]*")]],
      impact: ["", [Validators.required, Validators.pattern("[1-5]*")]],
      likelihood: ["", [Validators.required, Validators.pattern("[1-5]*")]],
      mitigationPlan: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9 ]*")]],
      mitigationOwner: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9 ]*")]],
      dueDate: ["", [Validators.required]]
    })
  }

  addRisk() {
    console.log("hi");

    if (this.riskForm.valid) {
      const title = this.riskForm.value.title
      const description = this.riskForm.value.description
      const category = this.riskForm.value.category
      const impact = this.riskForm.value.impact
      const likelihood = this.riskForm.value.likelihood
      const solution = this.riskForm.value.mitigationPlan
      const assignedTo = this.riskForm.value.mitigationOwner
      const dueDate = this.riskForm.value.dueDate
      console.log(title, description, category, impact, likelihood, solution, assignedTo, dueDate);

      this.api.createRiskAPI({ title, description, category, impact, likelihood, solution, assignedTo, dueDate }).subscribe({
        next: (res: any) => {
          console.log(res);
        },
        error: (reason: any) => {
          console.log(reason);

        }
      })
    }
    else {
      console.log("FORM INVALID", this.riskForm.errors);
    }
  }

  createCompany() {
    if (this.companyForm.valid) {
      const name = this.companyForm.value.name
      const industry = this.companyForm.value.industry
      this.api.createCompanyAPI({ name, industry }).subscribe({
        next: (res: any) => {
          console.log(res);
          this.getCurrentUser()
          alert(res)
          location.reload()
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
  toggelRiskCreate() {
    if (this.toggleRiskValue == false) {
      this.toggleRiskValue = true
    }
    else {
      this.toggleRiskValue = false
    }
  }

  getRisk() {
    this.api.getCompanyRiskAPI().subscribe({
      next: (res: any) => {
        console.log(res);
        this.companyRisks.set(res)
      },
      error: (reason: any) => {
        alert(reason.error)
      }
    })
  }

  getUsers() {
    this.api.getCompanyUsersAPI().subscribe({
      next: (res: any) => {
        // console.log(res);
        this.companyUsers.set(res)
      },
      error: (reason: any) => {
        alert(reason.error)
      }
    })
  }
  
  getcompany() {
    this.api.getCompanyAPI().subscribe({
      next: (res: any) => {
        console.log(res);
        this.company.set(res)
      },
      error: (reason: any) => {
        alert(reason.error)
      }
    })
  }

  getCurrentUser() {
    this.api.getCurrentUsersAPI().subscribe({
      next: (res: any) => {
        sessionStorage.setItem("user", JSON.stringify(res))
        console.log(res);

      }
    })
  }

  getRiskStatus() {
    this.api.getCompanyRiskStatusAPI().subscribe({
      next: (res: any) => {
        this.highRisk = res.riskHigh
        this.mediumRisk = res.riskMedium
        this.lowRisk = res.riskLow
        console.log(this.highRisk, this.lowRisk, this.mediumRisk);
        if (this.chart) {
          this.chart.data.datasets[0].data = [
            this.lowRisk,
            this.mediumRisk,
            this.highRisk
          ];
          this.chart.update();
        }

      },
      error: (reason: any) => {
        console.log(reason.error);
      }
    })
  }

  ngOnInit() {
    if (sessionStorage.getItem('token')) {
      this.getCurrentUser()
      this.token = sessionStorage.getItem('token')
      this.userDetails = JSON.parse(sessionStorage.getItem('user') || "")
      if (this.userDetails?.companyId != null && this.userDetails?.leftCompanyAt == null) {
        this.hasNoCompany = false
        this.getRisk()
        this.getUsers()
        this.getRiskStatus()
        this.getcompany()
      }
      else {
        this.hasNoCompany = true
      }
    }
  }

  ngAfterViewInit(): void {
    const ctx = document.getElementById('riskChart') as HTMLCanvasElement;

    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Low', 'Medium', 'High'],
        datasets: [{
          label: 'Active Risks',
          data: [0, 0, 0], // replace with API data later
          backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0
            }
          }
        }
      }
    });
  }



}
