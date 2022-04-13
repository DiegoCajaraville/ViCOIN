import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { KeyboardStyle } from '@capacitor/keyboard';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(public http:HttpClient, private router: Router) { }
  /*
  curl 
  -G 'http://ec2-44-201-180-246.compute-1.amazonaws.com:8086/query?pretty=true' 
  -H "Authorization: Token admin:lproPassword" 
  --data-urlencode "db=ViCOIN" 
  --data-urlencode "q=SELECT * FROM patinetes WHERE idPatinete='1' ORDER BY time DESC LIMIT 1"
  */

  getDatosBBDD(patinete){

    console.log("Realizar busqueda BBDD")
    console.log('SELECT * FROM patinetes WHERE idPatinete=\'' + patinete + '\' ORDER BY time DESC LIMIT 1')

    var headers = new HttpHeaders({ 'Authorization': 'Token admin:lproPassword' })

    var params = new HttpParams();
    params=params.set('db', 'ViCOIN');
    params=params.set('q', 'SELECT * FROM patinetes WHERE idPatinete=\'' + patinete + '\' ORDER BY time DESC LIMIT 1');

    this.http.get<any>("http://ec2-44-201-180-246.compute-1.amazonaws.com:8086/query?pretty=true", {
        params, 
        headers
    }).subscribe({
        next: data => {

            if(data.results[0].series == null)
                console.log("No hay registros de este patinete")
            else{
                
                var keys = data.results[0].series[0].columns;
                var values = data.results[0].series[0].values[0];
                
                for(var i=0; i<keys.length; i++){
                    console.log(keys[i] + " = " + values[i]);
                }
                return values;
            } 
        },
        error: error => {
            console.error('Ha ocurrido un error al obtener la información de la BBDD', error);
        }
    })
  }
}