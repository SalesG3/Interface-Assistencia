import { Component } from '@angular/core';
import { ComunsService } from '../../../servicos/comuns.service';
import { RequestService } from '../../../servicos/request.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-executados',
  standalone: true,
  imports: [],
  templateUrl: './executados.component.html',
  styleUrl: './executados.component.css'
})
export class ExecutadosComponent {

  // ** VARIÁVEIS **
  componente: string = "executados";
  mensagem: string = "";
  metodo: string = "";
  id: number = 0;
  
  registros : Array<any> = [];

  innerTabela : any;
  leitura : Array<string> = ['sub-unitBruto', 'sub-unitDesconto', 'sub-unitLiquido', 'sub-totalBruto', 'sub-totalDesconto', 'sub-totalLiquido'];

  constructor(private comuns : ComunsService, private request : RequestService, private sanitizer : DomSanitizer){ }

  // ** MÉTODOS FERRAMENTAS: ** 

  incluir(){
    this.comuns.alternarSubTela(this.componente, "Incluindo", this.leitura);
    this.metodo = "Incluindo";
  }

  alterar(){
    let data = this.registros.find(data => data.id == this.id);
    if(!data){ return }

    let tipo = document.querySelector(`#${this.componente} #sub-tipo`) as HTMLInputElement;
    let exec = document.querySelector(`#${this.componente} #sub-executado`) as HTMLInputElement;
    let desconto = document.querySelector(`#${this.componente} #sub-desconto`) as HTMLInputElement;
    let quantidade = document.querySelector(`#${this.componente} #sub-quantidade`) as HTMLInputElement;
    let brutoUn = document.querySelector(`#${this.componente} #sub-unitBruto`) as HTMLInputElement;
    
    tipo.value = data.tipo;
    exec.innerHTML = `<option value="${data.executado}">${data.codigo} - ${data.descricao}</option>`;
    desconto.value = data.desconto
    quantidade.value = data.quantidade
    brutoUn.value = data.valor

    this.calcular()
    this.metodo = "Alterando";
    this.comuns.alternarSubTela(this.componente, "Alterando", this.leitura);
  }

  consultar(){
    let data = this.registros.find(data => data.id == this.id);
    if(!data){ return }
    
    let tipo = document.querySelector(`#${this.componente} #sub-tipo`) as HTMLInputElement;
    let exec = document.querySelector(`#${this.componente} #sub-executado`) as HTMLInputElement;
    let desconto = document.querySelector(`#${this.componente} #sub-desconto`) as HTMLInputElement;
    let quantidade = document.querySelector(`#${this.componente} #sub-quantidade`) as HTMLInputElement;
    let brutoUn = document.querySelector(`#${this.componente} #sub-unitBruto`) as HTMLInputElement;
    
    tipo.value = data.tipo;
    exec.innerHTML = `<option value="${data.executado}">${data.codigo} - ${data.descricao}</option>`;
    desconto.value = data.desconto
    quantidade.value = data.quantidade
    brutoUn.value = data.valor

    this.calcular()
    this.metodo = "Consultando";
    this.comuns.alternarSubTela(this.componente, "Consultando", this.leitura);
  }

  excluir(){
    let data = this.registros.find(data => data.id == this.id);
    if(!data){ return }

    if(data.status == "Incluindo"){
      this.registros.splice(this.registros.findIndex(obj => obj.id == data.id), 1);
    }
    else{
      data.status = "Delete";
    }
    
    this.dadosGrid();
  }

  // ** REQUISIÇÕES PARA SELECT'S: **
  async selectExecutado(){
    let tipo = document.querySelector(`#${this.componente} #sub-tipo`) as HTMLInputElement;
    let exec = document.querySelector(`#${this.componente} #sub-executado`) as HTMLInputElement;
    let brutoUn = document.querySelector(`#${this.componente} #sub-unitBruto`) as HTMLInputElement;


    if(tipo.value == ""){
      tipo.classList.add('inputObrigatorio');
      return
    }
    else{
      tipo.classList.remove('inputObrigatorio')
    }

    let response : Array<any> = await this.request.lookupSelect(tipo.value);

    exec.innerHTML = '<option value="" hidden></option>';
    brutoUn.value = Number(0).toFixed(2);
    this.calcular()
    
    for(let i = 0; i < response.length; i++){
       exec.innerHTML += `<option value="${response[i].id_servico || response[i].id_produto}">${response[i].codigo} - ${response[i].servico || response[i].produto}</option>`;
    }

    tipo.onchange = () => {
      exec.innerHTML = '<option value="" hidden></option>';
      brutoUn.value = Number(0).toFixed(2);
      this.calcular()
    }
    
    exec.onchange = () => {
      let data = response.find(data => data.id_produto == exec.value || data.id_servico == exec.value)
      exec.dataset['codigo'] = data.codigo
      exec.dataset['descricao'] = data.produto || data.servico
      brutoUn.value = data.valor.toFixed(2)
      this.calcular()
    }
  }

  // ** MÉTODOS OPERADORES: **
  salvarRegistro(){
    if(!this.validacao()){ return }

    let id = 0;
    this.registros.find(data => {
      if(data.id > id){id = data.id}
    })

    if(this.metodo == "Incluindo"){
      this.registros.push({
        id: id +1,
        tipo: (document.querySelector(`#${this.componente} #sub-tipo`) as HTMLInputElement).value,
        executado: (document.querySelector(`#${this.componente} #sub-executado`) as HTMLInputElement).value,
        codigo: (document.querySelector(`#${this.componente} #sub-executado`) as HTMLInputElement).dataset['codigo'],
        descricao: (document.querySelector(`#${this.componente} #sub-executado`) as HTMLInputElement).dataset['descricao'],
        desconto: (document.querySelector(`#${this.componente} #sub-desconto`) as HTMLInputElement).value,
        quantidade: (document.querySelector(`#${this.componente} #sub-quantidade`) as HTMLInputElement).value,
        valor: (document.querySelector(`#${this.componente} #sub-unitBruto`) as HTMLInputElement).value,
        status: this.metodo
      });
    }

    if(this.metodo == "Alterando"){
      let data = this.registros.find(data => data.id == this.id);
      if(data){
        data.tipo = (document.querySelector(`#${this.componente} #sub-tipo`) as HTMLInputElement).value;
        data.executado = (document.querySelector(`#${this.componente} #sub-executado`) as HTMLInputElement).value;
        data.codigo = (document.querySelector(`#${this.componente} #sub-executado`) as HTMLInputElement).dataset['codigo'];
        data.descricao = (document.querySelector(`#${this.componente} #sub-executado`) as HTMLInputElement).dataset['descricao'];
        data.desconto = (document.querySelector(`#${this.componente} #sub-desconto`) as HTMLInputElement).value;
        data.quantidade = (document.querySelector(`#${this.componente} #sub-quantidade`) as HTMLInputElement).value;
        data.valor = (document.querySelector(`#${this.componente} #sub-unitBruto`) as HTMLInputElement).value;

        if(data.status == "Consultando"){data.status = "Alterando"}
      }
    }

    this.dadosGrid();
  }

  cancelar(){
    this.comuns.alternarSubTela(this.componente, "", this.leitura);
  }

  // ** MÉTODOS COMUNS **

  dadosGrid(){

    let html : string = "";
    let desconto : number;
    for(let i = 0; i < this.registros.length; i++){
      if(this.registros[i].status == "Delete"){ continue }

      desconto = this.registros[i].valor * this.registros[i].desconto / 100;

      html += `<tr id="${this.registros[i].id}"><td class="sub-tipo">${this.registros[i].tipo}</td>
              <td class="sub-executado">${this.registros[i].descricao}</td>
              <td class="sub-quantidade">${this.registros[i].quantidade}</td>
              <td class="sub-desconto">${this.registros[i].desconto}%</td>
              <td class="sub-valor">${((this.registros[i].valor - desconto) * this.registros[i].quantidade).toFixed(2)}</td></tr>`
    }

    this.innerTabela = this.sanitizer.bypassSecurityTrustHtml(html);
    this.comuns.alternarSubTela(this.componente, "", this.leitura);
  }

  selecaoTabela(event : MouseEvent){
    if((document.querySelector(`#${this.componente} table`)) == (event.target as HTMLElement).parentElement){
      return
    }

    let tr = (event.target as HTMLElement).parentElement as HTMLTableRowElement;
    if(document.querySelector('.trFocus')){
      document.querySelector('.trFocus')?.classList.remove('trFocus');
    }
    
    tr.classList.add('trFocus');
    this.id = Number(tr.id);
  }

  validacao(){
    let inputs = document.querySelectorAll('.sub-dados input, .sub-dados select');

    for(let i = 0; i < inputs.length; i++){
      if((inputs[i] as HTMLInputElement).value == ""){
        inputs[i].classList.add('inputObrigatorio');
      }
      else{
        inputs[i].classList.remove('inputObrigatorio');
      }
    }

    if(document.querySelector('#andamento .sub-dados .inputObrigatorio')){
      this.mensagem = "Campos em vermelho são obrigatórios";
      return false
    }
    else{
      this.mensagem = "";
      return true
    }
  }

  calcular(){
    let desconto = document.querySelector(`#${this.componente} #sub-desconto`) as HTMLInputElement;
    let quantidade = document.querySelector(`#${this.componente} #sub-quantidade`) as HTMLInputElement;

    let brutoUn = document.querySelector(`#${this.componente} #sub-unitBruto`) as HTMLInputElement;
    let descontoUn = document.querySelector(`#${this.componente} #sub-unitDesconto`) as HTMLInputElement;
    let totalUn = document.querySelector(`#${this.componente} #sub-unitLiquido`) as HTMLInputElement;

    let brutoTo = document.querySelector(`#${this.componente} #sub-totalBruto`) as HTMLInputElement;
    let descontoTo = document.querySelector(`#${this.componente} #sub-totalDesconto`) as HTMLInputElement;
    let totalTo = document.querySelector(`#${this.componente} #sub-totalLiquido`) as HTMLInputElement;

    descontoUn.value = (Number(brutoUn.value) * Number(desconto.value) / 100).toFixed(2)
    totalUn.value = (Number(brutoUn.value) - Number(descontoUn.value)).toFixed(2)

    brutoTo.value = (Number(brutoUn.value) * Number(quantidade.value)).toFixed(2)
    descontoTo.value = (Number(descontoUn.value) * Number(quantidade.value)).toFixed(2)
    totalTo.value = (Number(totalUn.value) * Number(quantidade.value)).toFixed(2)
  }
}
