import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { VisitResourceService } from
  '../../../openmrs-api/visit-resource.service';
import { EncounterResourceService } from
  '../../../openmrs-api/encounter-resource.service';

@Component({
  selector: 'app-visit-details',
  templateUrl: './visit-details.component.html',
  styleUrls: ['./visit-details.component.css']
})
export class VisitDetailsComponent implements OnInit {
  public completedEncounterTypesUuids = [];
  public allowedEncounterTypesUuids = [];
  public isBusy = false;
  public error = '';
  public showDeleteEncountersButton = false;
  public showConfirmationDialog = false;
  public confirmingCancelVisit = false;
  public editingLocation = false;

  @Output()
  public formSelected = new EventEmitter<any>();

  @Output()
  public encounterSelected = new EventEmitter<any>();

  @Output()
  public visitCancelled = new EventEmitter<any>();

  private _visit: any;
  @Input()
  public get visit(): any {
    return this._visit;
  }
  public set visit(v: any) {
    this._visit = v;
    this.extractCompletedEncounterTypes();
    console.log('Viewing visit:', v);
    console.log('completed encounters', this.completedEncounterTypesUuids);
  }

  public get visitWithNoEncounters(): boolean {
    return !(this.visit &&
      Array.isArray(this.visit.encounters) &&
      this.visit.encounters.length > 0);
  }


  private _programVisitTypesConfig: any;
  public get programVisitTypesConfig(): any {
    return this._programVisitTypesConfig;
  }
  @Input()
  public set programVisitTypesConfig(v: any) {
    this._programVisitTypesConfig = v;
    this.extractAllowedEncounterTypesForVisit();
    console.log('allowed encounters', this.allowedEncounterTypesUuids);
  }


  constructor(private visitResourceService: VisitResourceService,
    private encounterResService: EncounterResourceService) { }

  ngOnInit() {
  }

  extractCompletedEncounterTypes() {
    this.completedEncounterTypesUuids = [];
    if (this.visit && Array.isArray(this.visit.encounters)) {
      this.completedEncounterTypesUuids = this.visit.encounters.map((a) => {
        return a.encounterType.uuid;
      });
    }
  }

  extractAllowedEncounterTypesForVisit() {
    this.allowedEncounterTypesUuids = [];
    console.log('Determining visit types', this.programVisitTypesConfig);
    if (this.visit && this.visit.visitType
      && this.programVisitTypesConfig &&
      Array.isArray(this.programVisitTypesConfig.visitTypes)) {
      let visitType: any;
      this.programVisitTypesConfig.visitTypes.forEach(element => {
        if (element.uuid === this.visit.visitType.uuid) {
          visitType = element;
        }
      });

      if (visitType && Array.isArray(visitType.encounterTypes)) {
        this.allowedEncounterTypesUuids = visitType.encounterTypes.map((a) => {
          return a.uuid;
        });
      }
    }
  }

  reloadVisit() {
    if (this.visit && this.visit.uuid) {
      this.isBusy = true;
      this.error = '';
      let visitUuid = this.visit.uuid;
      this.visit = undefined;
      let custom = 'custom:(uuid,encounters:(uuid,encounterDatetime,' +
        'form:(uuid,name),location:ref,' +
        'encounterType:ref,provider:ref),patient:(uuid,uuid),' +
        'visitType:(uuid,name),location:ref,startDatetime,' +
        'stopDatetime)';
      this.visitResourceService.getVisitByUuid(visitUuid,
        { v: custom })
        .subscribe((visit) => {
          this.isBusy = false;
          this.visit = visit;
        },
        (error) => {
          this.isBusy = false;
          this.error = 'An error occured while reloading the visit. Refresh page and retry';
          console.error('Error loading visit', error);
        });
    }
  }

  endCurrentVisit() {
    this.isBusy = true;
    this.error = '';
    this.visitResourceService.updateVisit(this.visit.uuid, {
      stopDatetime: new Date()
    }).subscribe(
      (udpatedVisit) => {
        this.isBusy = false;
        this.reloadVisit();
      },
      (error) => {
        this.isBusy = false;
        this.error = 'An error occured while saving visit changes. Refresh page and retry';
        console.error('Error saving visit changes', error);
      }
      );

  }

  cancelCurrenVisit() {
    this.isBusy = true;
    this.error = '';
    this.visitResourceService.updateVisit(this.visit.uuid, {
      voided: true
    }).subscribe(
      (udpatedVisit) => {
        // this.isBusy = false;
        this.voidVisitEncounters();
        if (udpatedVisit.encounters.lenght === 0) {
          this.visitCancelled.next(this.visit);
        }
      },
      (error) => {
        this.isBusy = false;
        this.error = 'An error occured while cancelling visit. Refresh page and retry';
        console.error('Error saving visit changes', error);
      }
      );
  }

  voidVisitEncounters() {
    console.log('voiding visit encounters', this.visit.encounters);
    if (Array.isArray(this.visit.encounters) && this.visit.encounters.length > 0) {
      let observableBatch: Array<Observable<any>> = [];
      for (let encounter of this.visit.encounters) {
        observableBatch.push(
          this.encounterResService.voidEncounter(encounter.uuid)
        );
      }

      // forkjoin all requests
      this.isBusy = true;
      Observable.forkJoin(
        observableBatch
      ).subscribe(
        data => {
          console.log('Voided Encounters');
          this.isBusy = false;
          this.visitCancelled.next(this.visit);
        },
        err => {
          this.isBusy = false;
          this.error = 'An error occured while deleting visit encounters.';
          console.error('Error saving visit changes', err);
          this.showDeleteEncountersButton = true;
        }
        );
    }
  }

  toggleEditLocation() {
    this.editingLocation = !this.editingLocation;
  }

  confirmAction(action) {
    switch (action) {
      case 'cancel-visit':
        this.confirmingCancelVisit = true;
        break;
      case 'end-visit':
        this.confirmingCancelVisit = false;
        break;

      default:
        break;
    }
    this.showConfirmationDialog = true;
  }

  onFormSelected(form) {
    this.formSelected.next(form);
  }

  onEncounterSelected(encounter) {
    this.encounterSelected.next(encounter);
  }

  onVisitLocationEditted(location) {
    this.toggleEditLocation();
    this.reloadVisit();
  }

  onYesDialogConfirmation() {
    this.showConfirmationDialog = false;
    if (this.confirmingCancelVisit) {
      this.cancelCurrenVisit();
    } else {
      this.endCurrentVisit();
    }

  }

  onNoDialogConfirmation() {
    this.showConfirmationDialog = false;
    // Do Nothing
  }

}
