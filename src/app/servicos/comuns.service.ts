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
    let nav = document.querySelector('.navegadores') as HTMLElement;
    let oper = document.querySelector('.operadores') as HTMLElement;

    let fechar = document.querySelector('.fechar') as HTMLElement;
    let voltar = document.querySelector('.voltar') as HTMLElement;

    switch(modo){
      case 'Incluindo':
        grid.setAttribute('hidden','');
        dados.removeAttribute('hidden');

        fechar.setAttribute('hidden','');
        voltar.setAttribute('hidden','');
        nav.setAttribute('hidden','');

        oper.removeAttribute('hidden');
        for(let i = 0; i < crud.length; i++){
          crud[i].setAttribute('disabled','');
        };

        for(let i = 0; i < inputs.length; i++){
          let input = (inputs[i] as HTMLInputElement);
          
          input.removeAttribute('disabled');
          input.classList.remove('inputObrigatorio');
          input.value = "";
          if(input.type == "checkbox"){
            input.checked = true;
          }
        }
      break;

      case "Alterando":
        grid.setAttribute('hidden','');
        dados.removeAttribute('hidden');

        fechar.setAttribute('hidden','');
        voltar.setAttribute('hidden','');
        nav.setAttribute('hidden','');

        oper.removeAttribute('hidden');
        for(let i = 0; i < crud.length; i++){
          crud[i].setAttribute('disabled','');
        };
      break;

      case 'Consultando':
        grid.setAttribute('hidden','');
        dados.removeAttribute('hidden');

        fechar.setAttribute('hidden','');
        voltar.removeAttribute('hidden');
        nav.removeAttribute('hidden');

        oper.setAttribute('hidden','');
        for(let i = 0; i < inputs.length; i++){
          (inputs[i] as HTMLInputElement).setAttribute('disabled','');
        }
      break;

      case "Copiando":
        grid.setAttribute('hidden','');
        dados.removeAttribute('hidden');

        fechar.setAttribute('hidden','');
        voltar.setAttribute('hidden','');
        nav.setAttribute('hidden','');

        oper.removeAttribute('hidden');
        for(let i = 0; i < crud.length; i++){
          crud[i].setAttribute('disabled','');
        };
        for(let i = 0; i < inputs.length; i++){
          (inputs[i] as HTMLInputElement).removeAttribute('disabled');
        }
      break;

      default:
        grid.removeAttribute('hidden');
        dados.setAttribute('hidden','');

        fechar.removeAttribute('hidden');
        voltar.setAttribute('hidden','');
        nav.setAttribute('hidden','');

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

  validarInputs( inputs : Array<string> ){
    let mensagem : string = "";

    for(let i = 0; i < inputs.length; i++){
      let input = document.querySelector(inputs[i]) as HTMLInputElement;

      if(input.value.replaceAll(' ','') == ""){
        input.classList.add('inputObrigatorio');
      }
      else{
        input.classList.remove('inputObrigatorio');
      }
    }

    if(document.querySelector('.inputObrigatorio')){
      mensagem = "Campos em vermelho são obrigatórios";
      return mensagem
    };
      
    return true
  }

  navRegistros( idRegistro : Number, navTabela : Array<number>){
    let ultimo = navTabela.at(navTabela.length -1);
    let primeiro = navTabela.at(0);

    let comeco = document.querySelector('#comeco') as HTMLButtonElement;
    let anterior = document.querySelector('#anterior') as HTMLButtonElement;
    let avancar = document.querySelector('#avancar') as HTMLButtonElement;
    let final = document.querySelector('#final') as HTMLButtonElement;

    if(idRegistro == primeiro){
      comeco.setAttribute('disabled','');
      anterior.setAttribute('disabled','');

      final.removeAttribute('disabled');
      avancar.removeAttribute('disabled');
    }
    else if(idRegistro == ultimo){
      final.setAttribute('disabled','');
      avancar.setAttribute('disabled','');

      comeco.removeAttribute('disabled');
      anterior.removeAttribute('disabled');
    }
    else {
      comeco.removeAttribute('disabled');
      anterior.removeAttribute('disabled');
      avancar.removeAttribute('disabled');
      final.removeAttribute('disabled');
    }
  }
}
