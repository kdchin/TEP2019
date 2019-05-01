import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDbComponent } from './delete-db.component';

describe('DeleteDbComponent', () => {
  let component: DeleteDbComponent;
  let fixture: ComponentFixture<DeleteDbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteDbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
