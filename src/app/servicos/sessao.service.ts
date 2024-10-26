import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessaoService {
  entidade : string = "Clinica do Smartphone";
  usuario : string = "";
  versao : string = "v1.0.00";

  constructor() { }
}
