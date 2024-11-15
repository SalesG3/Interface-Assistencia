import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  headers = { TOKEN: environment.TOKEN, "Content-Type":"application/json"};

  constructor() { }

  async dadosGrid(tabela : string, data : object){

    this.carregamento(tabela)

    try{
      let request = await fetch(environment.APIURL + `/grid/${tabela}`,{
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data)
      });

      if(!request.ok){alert('Inconsistência Interna! Entrar em contato com Suporte.'); console.error(request); return };
      let response = await request.json();

      this.finalizado(tabela);
      return response;
    }
    catch(erro){
      alert('Inconsistência Interna! Entrar em contato com Suporte.');
      console.error(erro); this.finalizado(tabela); return
    }
  }

  async codigoAuto( tabela : string){

    this.carregamento(tabela)

    try{
      let request = await fetch(environment.APIURL + `/codigo/${tabela}`,{
        method: "GET",
        headers: this.headers
      });

      if(!request.ok){alert('Inconsistência Interna! Entrar em contato com Suporte.'); console.error(request); return };
      let response = await request.json();

      this.finalizado(tabela);
      return response;
    }
    catch(erro){
      alert('Inconsistência Interna! Entrar em contato com Suporte.');
      console.error(erro); this.finalizado(tabela); return
    }
  }

  async novoRegistro( tabela : string, data : object ){

    this.carregamento(tabela)

    try{
      let request = await fetch(environment.APIURL + `/novo/${tabela}`,{
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data)
      });

      if(!request.ok){alert('Inconsistência Interna! Entrar em contato com Suporte.'); console.error(request); return };
      let response = await request.json();

      this.finalizado(tabela);
      return response;
    }
    catch (erro){
      
      alert('Inconsistência Interna! Entrar em contato com Suporte.');
      console.error(erro); this.finalizado(tabela); return
    }
  }

  async alterarRegistro(tabela : string, data : object, id : number){

    this.carregamento(tabela);

    try{
      let request = await fetch(environment.APIURL + `/alterar/${tabela}/${id}`,{
        method: "PUT",
        headers: this.headers,
        body: JSON.stringify(data)
      });

      if(!request.ok){alert('Inconsitência Interna! Entrar em contato com Suporte.'); console.error(request); return}
      let response = await request.json();

      this.finalizado(tabela);
      return response
    }
    catch(erro){
      alert('Inconsistência Interna! Entrar em contato com Suporte.');
      console.error(erro); this.finalizado(tabela); return
    }
  }

  async consultarRegistro(tabela : string, id : number){

    this.carregamento(tabela)
    
    try{
      let request = await fetch(environment.APIURL + `/consulta/${tabela}/${id}`,{
        method: "GET",
        headers: this.headers
      });
      
      if(!request.ok){alert('Inconsistência Interna! Entrar em contato com Suporte.'); console.error(request); return };
      let response = await request.json();

      this.finalizado(tabela);
      return response;
    }
    catch(erro){
      alert('Inconsistência Interna! Entrar em contato com Suporte.');
      console.error(erro); this.finalizado(tabela); return
    }
  }

  async excluirRegistro(tabela : string, id : number){

    this.carregamento(tabela);

    try{
      let request = await fetch(environment.APIURL + `/delete/${tabela}/${id}`,{
        method: "DELETE",
        headers: this.headers
      });
      
      if(!request.ok){alert('Inconsistência Interna! Entrar em contato com Suporte.'); console.error(request); return };
      let response = await request.json();

      this.finalizado(tabela);
      return response;
    }
    catch(erro){
      alert('Inconsistência Interna! Entrar em contato com Suporte.');
      console.error(erro); this.finalizado(tabela); return
    }
  }
  
  async lookupSelect(tabela : string){

    try{
      let request = await fetch(environment.APIURL + `/lookup/${tabela}`,{
        method: "GET",
        headers: this.headers
      });

      if(!request.ok){alert('Inconsistência Interna! Entrar em contato com Suporte.'); console.error(request); return };
      let response = await request.json();

      return response;
    }
    catch(erro){
      alert('Inconsistência Interna! Entrar em contato com Suporte.');
      console.error(erro); this.finalizado(tabela); return
    }
  }

  carregamento(tabela : string){
    let loading = document.querySelector(`#${tabela} .loading`) as HTMLElement;
    loading.style.display = "inline-flex"
  }

  finalizado(tabela : string){
    let loading = document.querySelector(`#${tabela} .loading`) as HTMLElement;
    loading.style.display = "none"
  }
}
