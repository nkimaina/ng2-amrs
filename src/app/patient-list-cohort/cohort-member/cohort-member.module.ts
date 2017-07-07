import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { OpenmrsApi } from '../../openmrs-api/openmrs-api.module';
import { PatientSearchModule } from '../../patient-search/patient-search.module';

import { AddCohortMemberComponent } from './add-cohort-member.component';
import { CohortSelectorComponent } from './cohort-selector.component';

@NgModule({
    imports: [
        OpenmrsApi,
        PatientSearchModule,
        FormsModule,
        CommonModule
    ],
    exports: [
        AddCohortMemberComponent
    ],
    declarations: [
        AddCohortMemberComponent,
        CohortSelectorComponent
    ],
    providers: [],
})
export class CohortMemberModule { }
