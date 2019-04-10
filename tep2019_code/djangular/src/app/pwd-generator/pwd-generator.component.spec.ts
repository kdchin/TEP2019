import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PwdGeneratorComponent } from './pwd-generator.component';

describe('PwdGeneratorComponent', () => {
  let component: PwdGeneratorComponent;
  let fixture: ComponentFixture<PwdGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PwdGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwdGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
