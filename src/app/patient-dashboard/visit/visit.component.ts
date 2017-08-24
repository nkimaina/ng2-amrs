import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as Moment from 'moment';
import * as _ from 'lodash';
import { VisitResourceService } from '../../openmrs-api/visit-resource.service';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { PatientService } from '../patient.service';
import {
  UserDefaultPropertiesService
} from '../../user-default-properties/user-default-properties.service';
import { Subscription, Observable } from 'rxjs';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { PatientProgramResourceService } from '../../etl-api/patient-program-resource.service';
import * as moment from 'moment/moment';
@Component({
  selector: 'visit',
  templateUrl: 'visit.component.html',
  styleUrls: ['visit.component.css']
})
export class VisitComponent implements OnInit, OnDestroy {
  public allProgramVisitConfigs: any = {};
  public currentProgramConfig: any;

  public hasFetchedVisits = false;
  public allPatientVisits = [];

  public programUuid: string = '';
  public currentProgramEnrollmentUuid: string = '';
  public visit: any;

  public patient: any;
  public errors: Array<any> = [];
  public isBusy: boolean = false;

  public get programVisitTypesUuid(): Array<string> {
    if (this.currentProgramConfig &&
      Array.isArray(this.currentProgramConfig.visitTypes)) {
      return _.map(this.currentProgramConfig.visitTypes, (item) => {
        return (item as any).uuid;
      });
    }
    return [];
  }

  public get hasDetermineVisitStatus(): boolean {
    return this.hasFetchedVisits &&
      this.currentProgramConfig;
  }

  private patientChangeSub: Subscription;

  constructor(private visitResourceService: VisitResourceService,
    private patientService: PatientService, private router: Router,
    private appFeatureAnalytics: AppFeatureAnalytics,
    private route: ActivatedRoute,
    private patientProgramResourceService: PatientProgramResourceService) { }

  ngOnInit() {
    this.isBusy = true;
    this.subscribeToPatientChanges();
    this.extractSelectedProgramFromUrl();
    // app feature analytics
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Patient Visits Loaded', 'ngOnInit');
  }

  ngOnDestroy(): void {
    if (this.patientChangeSub) {
      this.patientChangeSub.unsubscribe();
    }
  }

  fetchAllProgramVisitConfigs() {
    this.allProgramVisitConfigs = {};
    let sub = this.patientProgramResourceService.
      getAllProgramVisitConfigs().subscribe(
      (programConfigs) => {
        this.allProgramVisitConfigs = programConfigs;
        this.determineProgramConfigurationObject();
      },
      (error) => {
        this.errors.push({
          id: 'program configs',
          message: 'There was an error fetching all the program configs'
        });
      });
  }

  getPatientVisits() {
    this.allPatientVisits = [];
    this.hasFetchedVisits = false;

    if (!(this.patient && this.patient.uuid)) {
      return;
    }

    this.visitResourceService
      .getPatientVisits({ patientUuid: this.patient.uuid })
      .subscribe((visits) => {
        this.allPatientVisits = visits;
        this.hasFetchedVisits = true;
        this.determineTodayVisitForProgram();
        console.log('Fetched visits', visits);
      }, (error) => {
        this.errors.push({
          id: 'patient visits',
          message: 'There was an error fetching all the patient visits'
        });
      });
  }

  subscribeToPatientChanges() {
    this.patientChangeSub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient !== null) {
          this.patient = patient;
          this.getPatientVisits();
        }
      }
      , (err) => {
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      });
  }

  determineTodayVisitForProgram() {
    if (!(this.currentProgramConfig && this.hasFetchedVisits)) {
      this.visit = undefined;
      return;
    }

    // Filter out visits not in the program
    let programVisits = this.filterOutNonProgramVisits();
    console.log('program visits', programVisits);
    let orderedVisits = this.sortVisitsByVisitStartDateTime(programVisits);

    if (orderedVisits.length > 0 &&
      moment(orderedVisits[0].startDatetime).isSame(moment(), 'days')) {
      this.visit = orderedVisits[0];
      console.log('Today visit present', this.visit);
    } else {
      this.visit = undefined;
    }

    this.isBusy = false;
  }

  filterOutNonProgramVisits(): Array<any> {
    return this.filterVisitsByVisitTypes(this.allPatientVisits, this.programVisitTypesUuid);
  }

  filterVisitsByVisitTypes(visits: Array<any>, visitTypes: Array<string>): Array<any> {
    let returnVal = [];
    console.log('program visit types', visitTypes);
    returnVal = _.filter(visits, (visit) => {
      let inType = _.find(visitTypes, (type) => {
        return type === visit.visitType.uuid;
      });
      if (inType) {
        return true;
      }
      return false;
    });
    return returnVal;
  }


  sortVisitsByVisitStartDateTime(visits: Array<any>) {
    // sorts this in descending order
    return visits.sort((a, b) => {
      return moment(b.startDatetime).diff(moment(a.startDatetime), 'seconds');
    });
  }

  determineProgramConfigurationObject() {
    this.currentProgramConfig = this.allProgramVisitConfigs[this.programUuid];
    this.determineTodayVisitForProgram();
  }

  extractSelectedProgramFromUrl() {
    this.route.params.subscribe(params => {
      if (params) {
        this.programUuid = params['program'];
        if (this.programUuid) {
          this.fetchAllProgramVisitConfigs();
        }
      }
    });
  }

  goToLandingPage() {
    this.router.navigate(['/patient-dashboard/' + this.patient.uuid + '/general/landing-page']);
  }

  onFormSelected(form) {
    if (form) {
      this.router.navigate(['../formentry', form.uuid],
        {
          relativeTo: this.route,
          queryParams: { visitUuid: this.visit.uuid }
        });
    }
  }
  onEncounterSelected(encounter) {
    if (encounter) {
      this.router.navigate(['../formentry', encounter.form.uuid], {
        relativeTo: this.route,
        queryParams: { encounter: encounter.uuid }
      });
    }
  }

  onVisitStartedOrChanged(visit) {
    this.isBusy = true;
    this.getPatientVisits();
  }

}
