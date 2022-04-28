import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(public http:HttpClient, private router: Router) { }
  
  /*
  curl 
  -G 'http://lpro.diegocajaraville.cyou:8086/query?pretty=true' 
  -H "Authorization: Token admin:lproPassword" 
  --data-urlencode "db=ViCOIN" 
  --data-urlencode "q=SELECT * FROM servicioPatinetes WHERE idPatinete='1' ORDER BY time DESC LIMIT 1"
  */

  async getDatosBBDD(patinete){

    //console.log("Realizar busqueda BBDD")
    //console.log('SELECT * FROM servicioPatinetes WHERE idPatinete=\'' + patinete + '\' ORDER BY time DESC LIMIT 1')

    var headers = new HttpHeaders({ 'Authorization': 'Token admin:lproPassword' })

    var params = new HttpParams();
    params=params.set('db', 'ViCOIN');
    params=params.set('q', 'SELECT * FROM servicioPatinetes WHERE idPatinete=' + patinete + ' ORDER BY time DESC LIMIT 1');
  
    var data= await this.http.get<any>("http://lpro.diegocajaraville.cyou:8089/query?pretty=true", {
        params, 
        headers
    }).toPromise();

    if(data.results[0].series == null)
        console.log("No hay registros de este patinete");
    else{
        
        var keys = data.results[0].series[0].columns;
        var values = data.results[0].series[0].values[0];
        
        //for(var i=0; i<keys.length; i++){
          //  console.log(keys[i] + " = " + values[i]);
        //}
        return values;
    } 
  }
}