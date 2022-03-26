import { Injectable } from '@angular/core';
import { Patinete } from '../patinete/patinete.model';
@Injectable({
  providedIn: 'root'
})
export class PatinetesService {

  private patinetes: Patinete[]=[]
  getPatinetes() {
    return [...this.patinetes]
  }
  constructor() {}
}
