import { Component } from '@angular/core';
import { SessaoService } from '../../servicos/sessao.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientesComponent } from '../clientes/clientes.component';
import { ServicosComponent } from '../servicos/servicos.component';

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

  constructor(private sessao : SessaoService){
    this.entidade = this.sessao.entidade;
    this.usuario = this.sessao.usuario;
    this.versao = this.sessao.versao;
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

  componetes : Record<string, any> = {
    clientes: ClientesComponent,
    servicos: ServicosComponent
  }

  outlet01 : any;
  outlet02 : any;
  outlet03 : any;
  outlet04 : any;
  outlet05 : any;

  outletStatus : Record<string, boolean> = {
    outlet01: false,
    outlet02: false,
    outlet03: false,
    outlet04: false,
    outlet05: false
  }

  abrirComponente(componente : string){

    for(let i in this.outletStatus){
      if(this.outletStatus[i] == false){

        this[i as keyof IndexComponent] = this.componetes[componente];
        this.outletStatus[i] = true;
        return
      }
    }
  }
}
