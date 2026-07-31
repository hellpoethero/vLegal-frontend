import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Datasources } from './datasources';

describe('Datasources', () => {
  let component: Datasources;
  let fixture: ComponentFixture<Datasources>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Datasources]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Datasources);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
