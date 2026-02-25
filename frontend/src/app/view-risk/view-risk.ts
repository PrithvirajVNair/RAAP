import { Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../service/api';
import { Header } from '../header/header';
import { SearchPipe } from '../pipes/search-pipe';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-view-risk',
  imports: [RouterLink, Header, SearchPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './view-risk.html',
  styleUrl: './view-risk.css',
})
export class ViewRisk {
  id: any = '';
  risk = signal<any>({});
  toggleEdit: boolean = false;
  companyUsers = signal<any>([]);
  allComments = signal<any>([]);
  searchKey: string = '';
  riskForm: FormGroup;
  commentForm: FormGroup;
  toggleRiskValue: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private api: Api,
    private fb: FormBuilder,
  ) {
    this.riskForm = this.fb.group({
      title: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
      description: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
      category: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
      impact: ['', [Validators.required, Validators.pattern('[1-5]*')]],
      likelihood: ['', [Validators.required, Validators.pattern('[1-5]*')]],
      mitigationPlan: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
      mitigationStatus: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
      dueDate: ['', [Validators.required]],
    });
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required]],
    });
  }

  addComment(id: string) {
    if (this.commentForm.valid) {
      const comment = this.commentForm.value.comment;
      this.api.addCommentAPI({ id, comment }).subscribe({
        next: (res: any) => {
          console.log(res);
          alert(res);
          location.reload();
        },
      });
    }
  }

  getComments(){
    this.api.getCommentAPI(this.id).subscribe({
      next: (res: any) => {
        this.allComments.set(res);
        console.log(this.allComments());
        
      }
    });
  }

  toggleEditFn() {
    if (this.toggleEdit == false) {
      this.toggleEdit = true;
    } else {
      this.toggleEdit = false;
    }
  }

  toggelRiskUpdate() {
    if (this.toggleRiskValue == false) {
      this.toggleRiskValue = true;
      if (this.toggleRiskValue) {
        this.riskForm.patchValue({
          title: this.risk().title,
          description: this.risk().description,
          category: this.risk().category,
          impact: this.risk().impact,
          likelihood: this.risk().likelihood,
          mitigationPlan: this.risk().mitigationPlan,
          mitigationStatus: this.risk().mitigationStatus,
          dueDate: this.risk().dueDate?.split('T')[0], // REQUIRED
        });
      }
    } else {
      this.toggleRiskValue = false;
    }
  }

  getUsers() {
    this.api.getCompanyUsersAPI().subscribe({
      next: (res: any) => {
        // console.log(res);
        this.companyUsers.set(res);
      },
      error: (reason: any) => {
        alert(reason.error);
      },
    });
  }

  editRisk() {
    if (this.riskForm.valid) {
      const title = this.riskForm.value.title;
      const description = this.riskForm.value.description;
      const category = this.riskForm.value.category;
      const impact = this.riskForm.value.impact;
      const likelihood = this.riskForm.value.likelihood;
      const solution = this.riskForm.value.mitigationPlan;
      const mitigationStatus = this.riskForm.value.mitigationStatus;
      const dueDate = this.riskForm.value.dueDate;
      console.log(title, description, category, impact, likelihood, solution, dueDate);

      this.api
        .updateRiskAPI({
          _id: this.risk()._id,
          title,
          description,
          category,
          impact,
          likelihood,
          solution,
          mitigationStatus,
          dueDate,
        })
        .subscribe({
          next: (res: any) => {
            console.log(res);
            alert(res);
            location.reload();
          },
          error: (reason: any) => {
            console.log(reason);
          },
        });
    } else {
      console.log('FORM INVALID', this.riskForm.errors);
    }
  }

  addUser(userId: any) {
    // console.log(userId); riskId
    this.api.updateRiskAssigneeAPI({ userId, riskId: this.risk()._id }).subscribe({
      next: (res: any) => {
        console.log(res);
        alert(res);
        location.reload();
      },
      error: (reason: any) => {
        alert(reason.error);
      },
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      console.log(this.id);
      this.getRiskDetails();
      this.getUsers();
      this.getComments();
    });
  }

  getRiskDetails() {
    this.api.getACompanyRiskAPI(this.id).subscribe({
      next: (res: any) => {
        this.risk.set(res);
        console.log(res);
      },
    });
  }
}
