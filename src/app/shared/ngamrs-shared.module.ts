import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BusyModule, BusyConfig } from 'angular2-busy';
import { LaddaModule } from 'angular2-ladda';
import { CommonModule } from '@angular/common';
import {
  MaterialModule, MdProgressSpinnerModule, MdProgressBarModule, MdTabsModule
} from '@angular/material';
import { CacheService } from 'ionic-cache/ionic-cache';
import { SelectModule } from 'angular2-select';

import { DisplayErrorComponent } from './display-error/display-error.component';
import { DataTablesComponent } from './components/datatables.component';
import { DateSelectorComponent } from './components/date-selector.component';
import { StringToDatePipe } from './pipes/string-to-date.pipe';
import { Ng2FilterPipe } from './pipes/ng2-filter.pipe';
import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';
import { OnlineTrackerComponent } from '../online-tracker';
import { BuildVersionComponent } from '../build-version';
import { RoutesProviderService } from './dynamic-route/route-config-provider.service';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { FormsModule } from '@angular/forms';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { ChartModule } from 'angular2-highcharts';
import { AgGridModule } from 'ag-grid-angular';
import { DataListsModule } from '../data-lists/data-lists.module';
import { EtlApi } from '../etl-api/etl-api.module';
import { InputTextModule } from 'primeng/primeng';
import { ReportingUtilitiesModule } from '../reporting-utilities/reporting-utilities.module';
import { DataCacheService } from './services/data-cache.service';
import { LocationFilterComponent } from './locations/location-filter/location-filter.component';
@NgModule({
  imports: [
    RouterModule,
    BusyModule.forRoot(
      new BusyConfig({
        message: 'Please Wait...',
        backdrop: true,
        delay: 200,
        minDuration: 600,
        wrapperClass: 'my-class',

      })
    ),
    LaddaModule.forRoot({
      style: 'expand-right',
      spinnerSize: 20,
      spinnerColor: 'white',
      spinnerLines: 12
    }),
    ChartModule.forRoot(require('highcharts'),
      require('highcharts/highcharts-more'),
      require('highcharts/modules/exporting')
    ),
    AgGridModule.withComponents([]),
    CommonModule,
    OpenmrsApi,
    EtlApi,
    ReportingUtilitiesModule,
    FormsModule,
    InputTextModule,
    DataListsModule,
    NgxMyDatePickerModule,
    MdTabsModule.forRoot(),
    MdProgressSpinnerModule,
    MdProgressBarModule,
    MaterialModule,
    SelectModule
  ],
  exports: [
    BusyModule,
    LaddaModule,
    DisplayErrorComponent,
    DataTablesComponent,
    StringToDatePipe,
    Ng2FilterPipe,
    OnlineTrackerComponent,
    BuildVersionComponent,
    DateSelectorComponent,
    PdfViewerComponent,
    LocationFilterComponent
  ],
  declarations: [
    DisplayErrorComponent,
    DataTablesComponent,
    StringToDatePipe,
    Ng2FilterPipe,
    OnlineTrackerComponent,
    BuildVersionComponent,
    DateSelectorComponent,
    PdfViewerComponent,
    LocationFilterComponent
  ],
  providers: [
    Ng2FilterPipe,
    StringToDatePipe,
    RoutesProviderService,
    DataCacheService,
    CacheService
  ],
})
export class NgamrsSharedModule { }
