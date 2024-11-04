import { Component } from '@angular/core';
import { SessaoService } from '../../servicos/sessao.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterService } from '../../servicos/router.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  entidade : string;
  usuario : string;
  versao : string;

  router;


  constructor(private sessao : SessaoService, private routerService : RouterService){
    this.entidade = this.sessao.entidade;
    this.usuario = this.sessao.usuario;
    this.versao = this.sessao.versao;

    this.router = routerService;
  }

  listDown ( button : HTMLButtonElement ) {

    function listUp(event : MouseEvent){
      if(event.target != button){
        div.style.display = "none"
        document.removeEventListener('mousedown', listUp)
      }
    }

    let div = document.querySelector(`#list-${button.value}`) as HTMLElement;

    div.style.left = button.offsetLeft + 'px';
    div.style.display = "block";

    document.addEventListener('click', listUp);
  }
}
