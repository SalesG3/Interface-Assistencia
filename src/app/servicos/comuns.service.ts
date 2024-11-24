import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComunsService {
  
  constructor() { }

  // Alterna entre Telas e Modifica Barra de Ferramentas de acordo com Modo:
  alternarTela(componente : string, modo : string, readOnly : Array<string>){
    let inputs = document.querySelectorAll(`#${componente} .dados-componente input, #${componente} textarea, #${componente} select`)

    let grid = document.querySelector(`#${componente} .grid-componente`) as HTMLElement;
    let dados = document.querySelector(`#${componente} .dados-componente`) as HTMLElement;

    let crud = document.querySelectorAll(`#${componente} .crud button`);
    let nav = document.querySelector(`#${componente} .navegadores`) as HTMLElement;
    let oper = document.querySelector(`#${componente} .operadores`) as HTMLElement;

    let fechar = document.querySelector(`#${componente} .fechar`) as HTMLElement;
    let voltar = document.querySelector(`#${componente} .voltar`) as HTMLElement;

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

        for(let i = 0; i < readOnly.length; i++){
          document.querySelector(`#${componente} ${readOnly[i]}`)?.setAttribute('disabled','');
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
        for(let i = 0; i < inputs.length; i++){
          (inputs[i] as HTMLInputElement).removeAttribute('disabled');
        }
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

  // Valida inputs vazios de acordo com Array passada nos Parâmetros:
  validarInputs(componente : string, inputs : Array<string>){
    let mensagem : string = "";

    for(let i = 0; i < inputs.length; i++){
      let input = document.querySelector(`#${componente} ${inputs[i]}`) as HTMLInputElement;

      if(input.value.replaceAll(' ','') == ""){
        input.classList.add('inputObrigatorio');
      }
      else{
        input.classList.remove('inputObrigatorio');
      }
    }

    if(document.querySelector(`.inputObrigatorio`)){
      mensagem = "Campos em vermelho são obrigatórios";
      return mensagem
    };
      
    return true
  }

  // Valida Posição e Navega entre Registros da GRID:
  navRegistros(componente : string, idRegistro : number, navcomponente : Array<number>){
    let ultimo = navcomponente.at(navcomponente.length -1);
    let primeiro = navcomponente.at(0);

    let comeco = document.querySelector(`#${componente} #comeco`) as HTMLButtonElement;
    let anterior = document.querySelector(`#${componente} #anterior`) as HTMLButtonElement;
    let avancar = document.querySelector(`#${componente} #avancar`) as HTMLButtonElement;
    let final = document.querySelector(`#${componente} #final`) as HTMLButtonElement;

    if(idRegistro == primeiro && idRegistro == ultimo){
      comeco.setAttribute('disabled','');
      anterior.setAttribute('disabled','');

      final.setAttribute('disabled','');
      avancar.setAttribute('disabled','');
    }

    else if(idRegistro == primeiro){
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

  // Mascara para o Campo Código:
  mascaraCodigo(componente : string, event : InputEvent){
    let input = document.querySelector(`#${componente} #codigo`) as HTMLInputElement;
    let formatado : string = "";
    
    for( let i = 0; i < input.value.length; i++ ){

      if( i == input.maxLength && input.value[0] == '0' ){
        formatado = formatado.replace('0','');
        formatado += event.data;
      }

      else if ( i < input.maxLength ){
        formatado += input.value[i]
      }
    }

    input.value = formatado.padStart(input.maxLength,'0');
  }

  // Mascara para o Campo Cadastro:
  mascaraCadatro(componente : string){
    let input = document.querySelector(`#${componente} #cadastro`) as HTMLInputElement;
    let valor = input.value.replaceAll('.','').replace('-','').replace('/','');
    let formatado : string = "";
    
    if(valor.length < 12){
      for(let i = 0; i < valor.length; i++){
        if(!(valor[i] in [1,2,3,4,5,6,7,8,9,0])){
          input.value = ""; return
        }

        if(i == 3 || i == 6){
          formatado += "."
        }
  
        if(i == 9){
          formatado += "-"
        }
  
        if(i < input.maxLength){
          formatado += valor[i]
        }
      }
    }
    else{
      for(let i = 0; i < valor.length; i++){
        if(!(valor[i] in [1,2,3,4,5,6,7,8,9,0])){
          input.value = ""; return
        }

        if(i == 2 || i == 5){
          formatado += "."
        }

        if(i == 8){
          formatado += "/"
        }

        if(i == 12){
          formatado += "-"
        }

        if(i < input.maxLength){
          formatado += valor[i]
        }
      }
    }

    input.value = formatado;
    if(input.value.length > input.maxLength){
      input.value = "";
    }
  }

  // Mascara para o Campo Contato:
  mascaraContato(componente : string){
    let input = document.querySelector(`#${componente} #contato`) as HTMLInputElement;
    let valor = input.value.replace('(','').replace(')','');
    let formatado : string = "";

    for(let i = 0; i < valor.length; i++){
      if(!(valor[i] in [1,2,3,4,5,6,7,8,9,0])){
        input.value = ""; return
      }

      if(i == 0){
        formatado += "(";
      }

      if(i == 2){
        formatado += ")"
      }

      if(i < input.maxLength){
        formatado += valor[i]
      }
    }

    input.value = formatado;
    if(input.value.length > input.maxLength){
      input.value = "";
    }
  }

  mascaraDuracao(componente : string){
    let input = document.querySelector(`#${componente} #duracao`) as HTMLInputElement;
    let valor = input.value.replace(':','');
    let formatado : string = "";

    for(let i = 0; i < valor.length; i++){
      if(!(valor[i] in [1,2,3,4,5,6,7,8,9,0])){
        input.value = ""; return
      }

      if(i == 2){
        formatado += ":"
      }

      if(i < input.maxLength){
        formatado += valor[i]
      }
    }
    
    input.value = formatado;
    if(input.value.length > input.maxLength){
      input.value = "";
    }
  }

  mascaraDesconto(input : HTMLInputElement){
    let valor = input.value.replace(',','');
    let formatado : string = "";

    if(Number(valor) > 10000){
      valor = "10000"
    }

    if((event as InputEvent).inputType != "deleteContentBackward" && valor.length < 3){
      valor = "0".repeat(3 - valor.length) + valor;
    }

    for(let i = 0; i < valor.length; i++){

      if(i == (valor.length - 2)){
        formatado += ','
      }

      if(i < input.maxLength){
        formatado += valor[i]
      }
    }

    if(formatado[0] == '0' && valor.length > 3){
      formatado = formatado.replace('0','');
    }

    input.value = formatado;
  }

  mascaraValor(input : HTMLInputElement){
    let valor = input.value.replace(',','').replace('.','');
    let formatado : string = "";

    console.log('ok');

    if((event as InputEvent).inputType != "deleteContentBackward" && valor.length < 3){
      valor = "0".repeat(3 - valor.length) + valor;
    }

    for(let i = 0; i < valor.length; i++){

      if(i == (valor.length - 3)){
        formatado += valor[i] + ','
        continue
      }

      if(i == (valor.length - 6)){
        formatado += valor[i] + ".";
        continue
      }

      if(i < input.maxLength){
        formatado += valor[i]
      }
    }

    if(formatado[0] == '0' && valor.length > 3){
      formatado = formatado.replace('0','');
    }

    input.value = formatado
  }

  alternarSubTela(componente : string, modo : string){
    let inputs = document.querySelectorAll(`#${componente} .sub-dados input, #${componente} .sub-dados select`)

    let subGrid = document.querySelector(`#${componente} .sub-grid`) as HTMLElement;
    let subDados = document.querySelector(`#${componente} .sub-registro`) as HTMLElement;

    switch(modo){

      case "Incluindo":
        subGrid.setAttribute('hidden','');
        subDados.removeAttribute('hidden');

        for(let i = 0; i < inputs.length; i++){
          (inputs[i] as HTMLInputElement).value = "";
        }
      break;
      default:
        subGrid.removeAttribute('hidden');
        subDados.setAttribute('hidden','');
      break;
    }


  }
}
