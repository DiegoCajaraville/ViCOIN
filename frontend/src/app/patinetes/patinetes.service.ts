import { Injectable } from '@angular/core';
import { Patinete } from '../patinete/patinete.model';
@Injectable({
  providedIn: 'root'
})
export class PatinetesService {
  private patinetes: Patinete[]=[
    {
      id: '1',
      coordinates: '',
      location: 'Castrelos',
      battery: 100
    },
    {
      id: '2',
      coordinates: '',
      location: 'Urzaiz',
      battery: 100
    },
    {
      id: '3',
      coordinates: '',
      location: 'Calle Zaragoza',
      battery: 100
    }
  ]
  getPatinetes() {
    return [...this.patinetes]
  }
  constructor() { }
}
