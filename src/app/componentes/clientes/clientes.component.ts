import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {
  dadosTabela : any;

  constructor(private sanitizer : DomSanitizer){

    //Teste de estilização para Tbody:
    let html : string = "";

    for(let i = 0; i < 15; i++){

      html += `<tr><td class="codigo">teste</td><td class="cliente">teste</td><td class="cadastro">teste</td></tr>`
      
    }

    this.dadosTabela = this.sanitizer.bypassSecurityTrustHtml(html);

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
          (inputs[i] as HTMLInputElement).value = "";
        }
      break;
    }
  }

}
