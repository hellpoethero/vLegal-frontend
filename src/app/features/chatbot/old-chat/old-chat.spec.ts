import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldChat } from './old-chat';

describe('OldChat', () => {
  let component: OldChat;
  let fixture: ComponentFixture<OldChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OldChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
