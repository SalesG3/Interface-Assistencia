import { Component } from '@angular/core';
import { SessaoService } from '../../servicos/sessao.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  entidade : string;
  usuario : string;
  versao : string;

  constructor(private sessao : SessaoService){
    this.entidade = this.sessao.entidade;
    this.usuario = this.sessao.usuario;
    this.versao = this.sessao.versao;
  }
}
