import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  headers = { TOKEN: environment.TOKEN, "Content-Type":"application/json"};

  constructor() { }

  async dadosGrid(tabela : string, data : object){

    try{
      let request = await fetch(environment.APIURL + `/grid/${tabela}`,{
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data)
      });

      if(!request.ok){alert('Inconsistência Interna! Entrar em contato com Suporte.'); console.error(request); return };
      let response = await request.json();

      return response;
    }
    catch(erro){
      alert('Inconsistência Interna! Entrar em contato com Suporte.');
      console.error(erro); return
    }
  }

  async codigoAuto( tabela : string){

    try{
      let request = await fetch(environment.APIURL + `/codigo/${tabela}`,{
        method: "GET",
        headers: this.headers
      });

      if(!request.ok){alert('Inconsistência Interna! Entrar em contato com Suporte.'); console.error(request); return };
      let response = await request.json();

      return response;
    }
    catch(erro){
      alert('Inconsistência Interna! Entrar em contato com Suporte.');
      console.error(erro); return
    }
  }

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

  async consultarRegistro(tabela : string, id : string){
    
    try{
      let request = await fetch(environment.APIURL + `/consulta/${tabela}/${id}`,{
        method: "GET",
        headers: this.headers
      });
      
      if(!request.ok){alert('Inconsistência Interna! Entrar em contato com Suporte.'); console.error(request); return };
      let response = await request.json();

      return response;
    }
    catch(erro){
      alert('Inconsistência Interna! Entrar em contato com Suporte.');
      console.error(erro); return
    }
  }
}
