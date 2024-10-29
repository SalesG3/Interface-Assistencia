import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComunsService {

  constructor() { }

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
          let input = (inputs[i] as HTMLInputElement);
          
          input.classList.remove('inputObrigatorio');
          input.value = "";
          if(input.type == "checkbox"){
            input.checked = true;
          }
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
          
          input.classList.remove('inputObrigatorio');
          input.value = "";
          if(input.type == "checkbox"){
            input.checked = true;
          }
        }
      break;
    }
  }
}
