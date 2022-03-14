import { Injectable } from '@angular/core';
import { Patinete } from '../patinete/patinete.model';
@Injectable({
  providedIn: 'root'
})
export class PatinetesService {

  private patinetes: Patinete[]=[
    {
      id: '0',
      latitude: '42.23826971200683',
      longitude: '-8.719505616037408',
      battery: 100
    },
    {
      id: '1',
      latitude: '42.23495405588338',
      longitude: '-8.73021883869674',
      battery: 100
    },
    {
      id: '2',
      latitude: '42.227836213281826',
      longitude: '-8.720090817296557',
      battery: 100
    }
  ]
  getPatinetes() {
    return [...this.patinetes]
  }
  constructor() {}
}
