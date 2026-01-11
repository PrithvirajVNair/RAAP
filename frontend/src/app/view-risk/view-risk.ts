import { Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../service/api';
import { CommonModule, NgIf } from '@angular/common';
import { Header } from "../header/header"; 

@Component({
  selector: 'app-view-risk',
  imports: [RouterLink, NgIf, Header],
  templateUrl: './view-risk.html',
  styleUrl: './view-risk.css',
})
export class ViewRisk {

  id:any = ""
  risk = signal<any>({})
  constructor(private route:ActivatedRoute, private api:Api){}


  ngOnInit(){
    this.route.paramMap.subscribe(params=>{
      this.id=params.get('id')
      console.log(this.id);
      this.getRiskDetails()
    })
  }

  getRiskDetails(){
    this.api.getACompanyRiskAPI(this.id).subscribe({
      next:(res:any)=>{
        this.risk.set(res)
        console.log(res);
        
      }
    })
  }

}
