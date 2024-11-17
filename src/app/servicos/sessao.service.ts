import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessaoService {
  entidade : string = "Clinica do Smartphone";
  id_usuario : number = 0;
  usuario : string = "";
  versao : string = "v1.0.00";

  constructor() { }
}
