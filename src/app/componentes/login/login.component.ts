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

  mensagem : string = "";

  constructor(private sessao : SessaoService, private router : Router){
    this.entidade = this.sessao.entidade;
    this.versao = this.sessao.versao;
  }

  async login(){

    try {
      let request = await fetch((environment.APIURL || process.env['APIURL']) + '/login',{
        method: "POST",
        headers: {
          TOKEN: environment.TOKEN || process.env['TOKEN'] || "",
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
        this.mensagem = "";
        this.sessao.usuario = data.sucesso[0].nome;
        this.sessao.id_usuario = data.sucesso[0].id_usuario
        this.router.navigate(['']);
        return
      }

      if(data.erro){
        this.mensagem = data.erro;
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
