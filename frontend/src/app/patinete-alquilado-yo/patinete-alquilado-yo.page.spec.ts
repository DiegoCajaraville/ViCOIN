import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PatineteAlquiladoYoPage } from './patinete-alquilado-yo.page';

describe('PatineteAlquiladoYoPage', () => {
  let component: PatineteAlquiladoYoPage;
  let fixture: ComponentFixture<PatineteAlquiladoYoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PatineteAlquiladoYoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PatineteAlquiladoYoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
