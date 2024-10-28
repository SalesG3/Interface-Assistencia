import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RequestService } from '../../servicos/request.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {
  dadosTabela : any;
  textoModal : string = "";

  constructor(private sanitizer : DomSanitizer, private request : RequestService){

    //Teste de estilização para Tbody:
    let html : string = "";

    for(let i = 0; i < 15; i++){

      html += `<tr><td class="codigo">teste</td><td class="cliente">teste</td><td class="cadastro">teste</td></tr>`
      
    }

    this.dadosTabela = this.sanitizer.bypassSecurityTrustHtml(html);

  }

  async salvarRegistro(){
    let data = {
      codigo: (document.querySelector('#codigo') as HTMLInputElement).value,
      cliente: (document.querySelector('#cliente') as HTMLInputElement).value,
      tipo: (document.querySelector('#tipo') as HTMLInputElement).value,
      cadastro: (document.querySelector('#cadastro') as HTMLInputElement).value,
      contato: (document.querySelector('#contato') as HTMLInputElement).value,
      email: (document.querySelector('#email') as HTMLInputElement).value,
      endereco: (document.querySelector('#endereco') as HTMLInputElement).value,
      historico: (document.querySelector('#historico') as HTMLInputElement).value,
      ativo: (document.querySelector('#ativo') as HTMLInputElement).checked,
      notificar: (document.querySelector('#notificar') as HTMLInputElement).checked
    }

    let response = await this.request.novoRegistro('Clientes', data);
    let modal = document.querySelector('.modalSucesso') as HTMLDialogElement;
    let button = document.querySelector('.modalSucesso button') as HTMLButtonElement;

    if(response.sucesso){
      this.textoModal = "Registro Salvo com Sucesso!"
      modal.showModal();
      button.onclick = function(){
        modal.close()
      }
      this.alternarTela('');
    }

    if(response.duplicado){

    }
  }


  // Função que Alterna entre Telas:
  alternarTela( modo : string ){
    let inputs = document.querySelectorAll('.dados-componente input, textarea, select')

    let grid = document.querySelector('.grid-componente') as HTMLElement;
    let dados = document.querySelector('.dados-componente') as HTMLElement;

    let crud = document.querySelectorAll('.crud button');
    let oper = document.querySelector('.operadores') as HTMLElement;

    let fechar = document.querySelector('.fechar') as HTMLElement;
    let voltar = document.querySelector('.voltar') as HTMLElement;

    switch(modo){
      case 'Incluindo':
        grid.setAttribute('hidden','');
        dados.removeAttribute('hidden');

        fechar.setAttribute('hidden','');
        voltar.setAttribute('hidden','');

        oper.removeAttribute('hidden');
        for(let i = 0; i < crud.length; i++){
          crud[i].setAttribute('disabled','');
        };

        for(let i = 0; i < inputs.length; i++){
          (inputs[i] as HTMLInputElement).value = "";
        }
        
      break;

      default:
        grid.removeAttribute('hidden');
        dados.setAttribute('hidden','');

        fechar.removeAttribute('hidden');
        voltar.setAttribute('hidden','');

        oper.setAttribute('hidden','');
        for(let i = 0; i < crud.length; i++){
          crud[i].removeAttribute('disabled');
        }

        for(let i = 0; i < inputs.length; i++){
          let input = (inputs[i] as HTMLInputElement);
          
          input.value = "";
          if(input.type == "checkbox"){
            input.checked = true;
          }
        }
      break;
    }
  }
}
