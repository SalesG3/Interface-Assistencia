import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  headers = { TOKEN: environment.TOKEN, "Content-Type":"application/json"};

  constructor() { }

  async novoRegistro( tabela : string, data : object ){

    try{
      let request = await fetch(environment.APIURL + `/novo/${tabela}`,{
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data)
      });

      if(!request.ok){alert('Inconsistência Interna! Entrar em contato com Suporte.'); console.error(request); return };
      let response = await request.json();

      return response;
    }
    catch (erro){
      alert('Inconsistência Interna! Entrar em contato com Suporte.');
      console.error(erro); return
    }
  }
}