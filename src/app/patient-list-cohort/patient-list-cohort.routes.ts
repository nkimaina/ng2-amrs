import { Routes, RouterModule } from '@angular/router';
import { CohortListComponent } from './cohort-list.component';
import { AddCohortListComponent } from './add-cohort-list.component';
import { ModuleWithProviders } from '@angular/core';
import { EditCohortListComponent } from './edit-cohort-list.component';
import { ViewCohortListMembersComponent } from './cohort-list-members.component';
import { AddCohortMemberContainerComponent } from './add-cohort-member-container.component';

const patientListCohort: Routes = [

  {
    path: 'patient-list',
    children: [
      { path: '', component: CohortListComponent },
      { path: 'add-cohort-list', component: AddCohortListComponent },
      { path: 'edit-cohort-list', component: EditCohortListComponent },
      { path: 'cohort-list-members', component: ViewCohortListMembersComponent },
      { path: 'cohort-members/:cohort/add', component: AddCohortMemberContainerComponent }
    ]
  }
];
export const cohortRouting: ModuleWithProviders = RouterModule.forChild(patientListCohort);
