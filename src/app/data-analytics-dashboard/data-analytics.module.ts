import {  NgModule  } from '@angular/core';
import {  CommonModule  } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MaterialModule, MdTabsModule, MdProgressSpinnerModule, MdProgressBarModule
 } from '@angular/material';
import { dataAnalyticsDashboardRouting } from './data-analytics-dashboard-routing';
import { DataAnalyticsDashboardComponent } from './data-analytics.component';
import {  Angulartics2Module  } from 'angulartics2';
import { DataListsModule } from '../data-lists/data-lists.module';
import {
  AccordionModule, ButtonModule, FieldsetModule, GrowlModule,
  TabViewModule
 } from 'primeng/primeng';
import {  DateTimePickerModule  } from 'ng2-openmrs-formentry/src/app/components/date-time-picker';
import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';
import { EtlApi } from '../etl-api/etl-api.module';
import { SelectModule } from 'angular2-select';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { ChartModule } from 'angular2-highcharts';
import { BusyConfig, BusyModule } from 'angular2-busy';
import { AgGridModule } from 'ag-grid-angular';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { CalendarModule } from 'angular-calendar';
import { DataAnalyticsDashboardGuard } from './data-analytics-guard';
import { ClinicDashboardCacheService
} from '../clinic-dashboard/services/clinic-dashboard-cache.service';
import { HivClinicFlowResourceService } from '../etl-api/hiv-clinic-flow-resource.service';
import { ClinicFlowCacheService } from '../hiv-care-lib/clinic-flow/clinic-flow-cache.service';
import { Http, RequestOptions, XHRBackend } from '@angular/http';
import { Router } from '@angular/router';
import { SessionStorageService } from '../utils/session-storage.service';
import { HttpClient } from '../shared/services/http-client.service';
import { AdminDashboardClinicFlowComponent } from './hiv/clinic-flow/admin-dashboard-clinic-flow';
import { HivCareLibModule } from '../hiv-care-lib/hiv-care-lib.module';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    dataAnalyticsDashboardRouting,
    CommonModule,
    FormsModule,
    DateTimePickerModule,
    DataListsModule,
    TabViewModule,
    FieldsetModule,
    ButtonModule,
    GrowlModule,
    AccordionModule,
    OpenmrsApi,
    EtlApi,
    Angulartics2Module.forChild(),
    NgamrsSharedModule,
    ChartModule.forRoot(require('highcharts'),
      require('highcharts/highcharts-more'),
      require('highcharts/modules/exporting')
    ),
    BusyModule.forRoot(
      new BusyConfig({
        message: 'Please Wait...',
        backdrop: true,
        delay: 200,
        minDuration: 600,
        wrapperClass: 'my-class',

      })
    ),
    HivCareLibModule,
    CalendarModule.forRoot(),
    AgGridModule.withComponents([]),
    NgxMyDatePickerModule,
    MdTabsModule.forRoot(),
    MdProgressSpinnerModule,
    MdProgressBarModule,
    MaterialModule
  ],
  declarations: [
    DataAnalyticsDashboardComponent,
    AdminDashboardClinicFlowComponent
  ],
  providers: [
    DataAnalyticsDashboardGuard,
    ClinicDashboardCacheService,
    HivClinicFlowResourceService,
    ClinicFlowCacheService,
    {
      provide: 'ClinicFlowResource',
      useExisting: HivClinicFlowResourceService
    },
    {
      provide: Http,
      useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions,
                   router: Router, sessionStorageService: SessionStorageService) =>
        new HttpClient(xhrBackend, requestOptions, router, sessionStorageService),
      deps: [XHRBackend, RequestOptions, Router, SessionStorageService]
    }
  ],
  exports: [
    DataAnalyticsDashboardComponent
  ]
})
export class DataAnalyticsModule {}
