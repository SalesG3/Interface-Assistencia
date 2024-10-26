import { Component } from '@angular/core';
import { SessaoService } from '../../servicos/sessao.service';
import { environment } from '../../../environments/environment';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  entidade : string;
  versao : string;

  aviso : string = "";

  constructor(private sessao : SessaoService, private router : Router){
    this.entidade = this.sessao.entidade;
    this.versao = this.sessao.versao;
  }

  avisoShow(){
    let modal = (document.querySelector('dialog') as HTMLDialogElement);
    let button = (document.querySelector('dialog button') as HTMLButtonElement);

    modal.showModal();

    button.onclick = function(){
      modal.close();
    }
    
  }

  async login(){

    try {
      let request = await fetch(environment.APIURL + '/login',{
        method: "POST",
        headers: {
          TOKEN: environment.TOKEN,
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          usuario: (document.querySelector('#usuario') as HTMLInputElement).value,
          senha: (document.querySelector('#senha') as HTMLInputElement).value
        })
      });

      if(!request.ok){console.error(request); return}
      let data = await request.json();

      if(data.sucesso){
        this.sessao.usuario = data.sucesso[0].nome;
        this.router.navigate(['']);
        return
      }

      if(data.erro){
        this.aviso = data.erro;
        this.avisoShow();
        return
      }

      else {
        alert('Inconsistência Interna! Entrar em contato com Suporte.');
        console.error(data); return
      }
    }

    catch(err){
      alert('Inconsistência Interna! Entrar em contato com Suporte.');
      console.error(err); return
    }
  }
}
