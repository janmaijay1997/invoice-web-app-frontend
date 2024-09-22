import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CommonDetailsService {

 
  constructor(private httpClient:HttpClient) { }

  getAllOtherDetails(){
    return this.httpClient.get(environment.otherDetailsUrl);
  }
}
