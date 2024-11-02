import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  headers = { TOKEN: environment.TOKEN, "Content-Type":"application/json"};

  constructor() { }

  async dadosGrid(tabela : string, data : object){

    this.carregamento()

    try{
      let request = await fetch(environment.APIURL + `/grid/${tabela}`,{
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data)
      });

      if(!request.ok){alert('Inconsistência Interna! Entrar em contato com Suporte.'); console.error(request); return };
      let response = await request.json();

      this.finalizado();
      return response;
    }
    catch(erro){
      alert('Inconsistência Interna! Entrar em contato com Suporte.');
      console.error(erro); this.finalizado(); return
    }
  }

  async codigoAuto( tabela : string){

    this.carregamento()

    try{
      let request = await fetch(environment.APIURL + `/codigo/${tabela}`,{
        method: "GET",
        headers: this.headers
      });

      if(!request.ok){alert('Inconsistência Interna! Entrar em contato com Suporte.'); console.error(request); return };
      let response = await request.json();

      this.finalizado();
      return response;
    }
    catch(erro){
      alert('Inconsistência Interna! Entrar em contato com Suporte.');
      console.error(erro); this.finalizado(); return
    }
  }

  async novoRegistro( tabela : string, data : object ){

    this.carregamento()

    try{
      let request = await fetch(environment.APIURL + `/novo/${tabela}`,{
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data)
      });

      if(!request.ok){alert('Inconsistência Interna! Entrar em contato com Suporte.'); console.error(request); return };
      let response = await request.json();

      this.finalizado();
      return response;
    }
    catch (erro){
      
      alert('Inconsistência Interna! Entrar em contato com Suporte.');
      console.error(erro); this.finalizado(); return
    }
  }

  async consultarRegistro(tabela : string, id : number){

    this.carregamento()
    
    try{
      let request = await fetch(environment.APIURL + `/consulta/${tabela}/${id}`,{
        method: "GET",
        headers: this.headers
      });
      
      if(!request.ok){alert('Inconsistência Interna! Entrar em contato com Suporte.'); console.error(request); return };
      let response = await request.json();

      this.finalizado();
      return response;
    }
    catch(erro){
      alert('Inconsistência Interna! Entrar em contato com Suporte.');
      console.error(erro); this.finalizado(); return
    }
  }

  carregamento(){
    let loading = document.querySelector('.loading') as HTMLElement;
    loading.style.display = "inline-flex"
  }

  finalizado(){
    let loading = document.querySelector('.loading') as HTMLElement;
    loading.style.display = "none"
  }
}
