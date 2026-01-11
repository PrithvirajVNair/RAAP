import { Component, signal } from '@angular/core';
import { Api } from '../service/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { Sidebar } from "../sidebar/sidebar";
import { Header } from "../header/header";

@Component({
  selector: 'app-risks',
  imports: [ReactiveFormsModule, RouterLink, Sidebar, Header],
  templateUrl: './risks.html',
  styleUrl: './risks.css',
})
export class Risks {

  riskForm: FormGroup
  companyRisks = signal<any>([])
  toggleRiskValue: boolean = false

  constructor(private fb: FormBuilder, private api: Api) {
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

  ngOnInit(){
    this.getRisk()
  }

}
