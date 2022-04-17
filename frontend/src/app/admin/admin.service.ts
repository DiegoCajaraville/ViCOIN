import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  peticion(){
    return this.http.get("https://api-goerli.etherscan.io/api?module=account&action=balance&address=0xe8e781E9F26b21a0319bac6dc7e2843a86b29eaf&tag=latest&apikey=UW9QR3A3CN1QZD5MH1KGGK3ZQ3129IBXZD");
  }

}
