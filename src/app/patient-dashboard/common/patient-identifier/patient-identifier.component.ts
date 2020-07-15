import { Component, OnInit, Input, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';

import { takeWhile, isEmpty } from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { EditPatientIdentifierComponent } from './edit-patient-identifier.component';

@Component({
  selector: 'patient-identifier',
  templateUrl: './patient-identifier.component.html',
  styleUrls: ['./patient-identifier.component.css']
})
export class PatientIdentifierComponent implements OnInit, OnDestroy, AfterViewInit {

  public action: string;
  public routeSub: Subscription;

  @ViewChild('editIdentifiers')
  public identifier: EditPatientIdentifierComponent;

  @Input()
  public set identifiers(identifiers: Array<any>) {
    if (!isEmpty(identifiers)) {
      this._identifiers = identifiers;
      const preferredIdentifiers = takeWhile(identifiers, (i: any) => i.preferred);
      if (preferredIdentifiers.length > 0) {
        this.hasPreferredIdentifier = true;
      }
    }
  }

  public get identifiers(): Array<any> {
    return this._identifiers;
  }

  public hasPreferredIdentifier = false;
  private _identifiers: Array<{}> = [];

  constructor(private route: ActivatedRoute) {
  }
  ngAfterViewInit(): void {
    if (this.action === 'add-identifier' && this.identifier) {
      this.identifier.showDialog('add', null);
    }
  }

  public ngOnInit() {
    this.routeSub = this.route.queryParams
      .subscribe((params: any) => {
        if (params.action) {
          this.action = params.action;
        }
      });
  }

  public ngOnDestroy() {
    // tslint:disable-next-line:no-unused-expression
    this.routeSub && this.routeSub.unsubscribe();
  }
}
