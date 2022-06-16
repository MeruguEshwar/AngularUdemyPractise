import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusTicketBookingComponent } from './bus-ticket-booking.component';

describe('BusTicketBookingComponent', () => {
  let component: BusTicketBookingComponent;
  let fixture: ComponentFixture<BusTicketBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusTicketBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusTicketBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
