import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RequestService } from '../../servicos/request.service';
import { ComunsService } from '../../servicos/comuns.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {
  textoModal : string = "";
  mensagem : string = "";
  modoTela : string = "";

  navTabela : Array<string> = [];
  idRegistro : string = "";
  countTabela : string = "0";
  dadosTabela : any;

  constructor(private sanitizer : DomSanitizer, private request : RequestService, private comuns : ComunsService){  }

  async pesquisarGrid(){
    let data = {
      pesquisa : (document.querySelector('#pesquisa') as HTMLInputElement).value
    };

    let response = await this.request.dadosGrid('clientes', data);

    let html : string = "";

    for(let i = 0; i < response.length; i++){
      html += `<tr id="${response[i].id_cliente}">
      <td class="codigo">${response[i].codigo}</td>
      <td class="cliente">${response[i].cliente}</td>
      <td class="cadastro">${response[i].cadastro}</td></tr>`;

      this.navTabela.push(response[i].id_cliente);
    }

    this.dadosTabela = this.sanitizer.bypassSecurityTrustHtml(html);
    this.countTabela = response.length;
  }

  async incluirRegistro(){
    let response = await this.request.codigoAuto('clientes');
    let codigo = document.querySelector('#codigo') as HTMLInputElement;

    this.comuns.alternarTela('Incluindo');
    this.mensagem = "";
    this.modoTela = "Incluindo";

    codigo.value = String(response[0].codigo).padStart(codigo.maxLength, '0');
  }

  cancelarRegistro(){
    let modal = document.querySelector('#modalConfirmacao') as HTMLDialogElement;
    let btnSim = document.querySelector('#sim') as HTMLButtonElement;
    let btnNao = document.querySelector('#nao') as HTMLButtonElement;

    this.textoModal = "Realmente deseja sair?"
    modal.showModal();

    btnNao.onclick = function(){
      modal.close()
    }

    btnSim.onclick = () => {
      this.modoTela = "";
      this.comuns.alternarTela('')
      modal.close();
    }
  }

  voltarConsultando(){
    this.comuns.alternarTela('');
    this.modoTela = "";
  }

  async salvarRegistro(modo : string){

    if(this.validarInputs() != true){ return }

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

    //TRATAMENTO PARA THIS.MODOTELA QUANDO O METODO ESTIVER COMO ALTERANDO;
    //CRIAR PROCEDURE, ROTA E REQUEST PARA ALTERAÇÃO DO REGISTRO;

    let response = await this.request.novoRegistro('clientes', data);

    let modal = document.querySelector('#modalSucesso') as HTMLDialogElement;
    let button = document.querySelector('#modalSucesso button') as HTMLButtonElement;

    if(response.sucesso){
      this.textoModal = "Registro Salvo com Sucesso!"
      modal.showModal();
      button.onclick = function(){
        modal.close()
      }
      this.mensagem = "";
      this.comuns.alternarTela(modo);
    }

    if(response.duplicado){
      this.mensagem = "Campos em vermelho já está sendo utilizado em outro Registro!";
      let inputs = response.duplicado;
      for(let i = 0; i < inputs.length; i++){
        (document.querySelector(inputs[i].duplicado) as HTMLElement).classList.add('inputObrigatorio')
      }
    }
  }

  async detalhesRegistro(modo : string){
    if(this.idRegistro == ""){return}
    let response = await this.request.consultarRegistro('clientes', this.idRegistro);
    
    for(let i in response[0]){
      if(document.getElementById(i)){
        let input = document.getElementById(i) as HTMLInputElement;
        input.value = response[0][i];
        
        if(input.type == "checkbox"){
          input.checked = response[0][i];
        }
      }
    }
    
    this.modoTela = modo;
    this.comuns.alternarTela(modo)
  }

  validarInputs(){
    let cadastro = document.querySelector('#cadastro') as HTMLInputElement;
    let contato = document.querySelector('#contato') as HTMLInputElement;
    
    let inputs = ['#codigo', '#cliente', '#tipo', '#cadastro', '#contato'];
    let validarInputs = this.comuns.validarInputs(inputs);

    if(validarInputs != true){ this.mensagem = validarInputs; return}

    if(cadastro.value.length != 14 && cadastro.value.length != 18){
      cadastro.classList.add('inputObrigatorio');
      this.mensagem = "Campo CPF/CNPJ é inválido!";
      return false
    };

    if(contato.value.length != 13){
      contato.classList.add('inputObrigatorio');
      this.mensagem = "Campo Contato é inválido!";
      return false
    };

    return true
  }

  trFocus(event : MouseEvent){
    if(document.querySelector('.trFocus')){
      document.querySelector('.trFocus')?.classList.remove('trFocus');
    }
    
    let tr = (event.target as HTMLElement).parentElement as HTMLTableRowElement;
    tr.classList.add('trFocus');
    this.idRegistro = tr.id;
  }
}
