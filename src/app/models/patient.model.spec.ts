/* tslint:disable:no-unused-variable */

//import { TestBed, async, inject, describe, it, expect } from '@angular/core/testing';

import { Patient } from './patient.model';



describe('Model: Patient', () => {

  let existingPatient:any = {
    uuid:'uuid',
    display:'the patient',
    person: {
      uuid:'person uuid'
    },
    identifiers: {
      uuid:' patient identifiers  uuid'
    }

  };

  it('should wrap openmrs patient for display correctly',()=>{
    let wrappedPatient:Patient = new Patient(existingPatient);
    expect(wrappedPatient.uuid).toEqual(existingPatient.uuid);
    expect(wrappedPatient.display).toEqual(existingPatient.display);
    expect(wrappedPatient.person.uuid).toEqual(existingPatient.person.uuid);

  });

  it('should generate update existing payload correctly',()=>{
    let wrappedPatient:Patient = new Patient(existingPatient);
    let newPayload:any = wrappedPatient.toUpdatePayload();
    expect(newPayload).toEqual(null);
  });

  /*it('should generate a new patient new payload correctly', ()=>{


  });*/

  /*it('should generate an existing patient payload correctly', ()=>{


  });*/
});


