import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PatineteAlquiladoNoYoPage } from './patinete-alquilado-no-yo.page';

describe('PatineteAlquiladoNoYoPage', () => {
  let component: PatineteAlquiladoNoYoPage;
  let fixture: ComponentFixture<PatineteAlquiladoNoYoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PatineteAlquiladoNoYoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PatineteAlquiladoNoYoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
