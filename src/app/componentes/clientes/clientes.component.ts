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
  componente = '#clientes'

  textoModal : string = "";
  mensagem : string = "";
  modoTela : string = "";

  navTabela : Array<number> = [];
  idRegistro : number = 0;
  countTabela : string = "0";
  dadosTabela : any;

  mascaraCodigo : Function;
  mascaraCadastro : Function;
  mascaraContato : Function;

  constructor(private sanitizer : DomSanitizer, private request : RequestService, private comuns : ComunsService){
    this.mascaraCodigo = this.comuns.mascaraCodigo;
    this.mascaraCadastro = this.comuns.mascaraCadatro;
    this.mascaraContato = this.comuns.mascaraContato;
  }

  async pesquisarGrid(){
    let data = {
      pesquisa : (document.querySelector('#pesquisa') as HTMLInputElement).value
    };

    let response = await this.request.dadosGrid('clientes', data);
    this.navTabela = [];
    
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

    this.comuns.alternarTela('Incluindo', this.componente);
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
      this.mensagem = "";
      this.comuns.alternarTela('', this.componente);
      modal.close();
    }
  }

  voltarConsultando(){
    this.comuns.alternarTela('', this.componente);
    this.modoTela = "";
    this.mensagem = "";

    document.querySelector('.trFocus')?.classList.remove('trFocus');
    this.idRegistro = 0;
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

    let response;
    switch(this.modoTela){
      case "Incluindo":
        response = await this.request.novoRegistro('clientes', data);
      break;

      case "Copiando":
        response = await this.request.novoRegistro('clientes', data);
      break;

      case "Alterando":
        response = await this.request.alterarRegistro('clientes', data, this.idRegistro);
      break;
    }

    let modal = document.querySelector('#modalSucesso') as HTMLDialogElement;
    let button = document.querySelector('#modalSucesso button') as HTMLButtonElement;

    if(response.sucesso){
      this.textoModal = "Registro Salvo com Sucesso!"
      modal.showModal();
      button.onclick = function(){
        modal.close()
      }

      if(modo == "Incluindo"){
        await this.incluirRegistro();
      }
      else if(modo == "Copiando"){
        await this.copiarRegistro()
      }
      else {
        this.voltarConsultando();
        this.pesquisarGrid();
      }
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
    if(this.idRegistro == 0){ return }
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
    this.comuns.alternarTela(modo, this.componente)
    this.comuns.navRegistros(this.idRegistro, this.navTabela, this.componente);
  }

  validarInputs(){
    let cadastro = document.querySelector('#cadastro') as HTMLInputElement;
    let contato = document.querySelector('#contato') as HTMLInputElement;
    
    let inputs = ['#codigo', '#cliente', '#tipo', '#cadastro', '#contato'];
    let validarInputs = this.comuns.validarInputs(inputs, this.componente);

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
    this.idRegistro = Number(tr.id);
  }

  async navegarRegistro(funcao : string){
    let index = this.navTabela.indexOf(this.idRegistro);

    switch(funcao){

      case "avancar":
        this.idRegistro = Number(this.navTabela.at(index +1));
        await this.detalhesRegistro('Consultando');
        
      break;

      case "anterior":
        this.idRegistro = Number(this.navTabela.at(index -1));
        await this.detalhesRegistro('Consultando');
      break;

      case "comeco":
        this.idRegistro = Number(this.navTabela.at(0));
        await this.detalhesRegistro('Consultando');
      break;

      case "final":
        this.idRegistro = Number(this.navTabela.at(this.navTabela.length -1));
        await this.detalhesRegistro('Consultando');
      break;
    }
  }

  async copiarRegistro(){
    if(this.idRegistro == 0){ return }
    await this.detalhesRegistro("Copiando");

    let response = await this.request.codigoAuto('clientes');
    let codigo = document.querySelector('#codigo') as HTMLInputElement;
    
    this.modoTela = "Copiando";
    this.mensagem = "";
    
    this.comuns.alternarTela(this.modoTela, this.componente);
    codigo.value = String(response[0].codigo).padStart(codigo.maxLength, '0')
  }

  async excluirRegistro(){
    if(this.idRegistro == 0){ return }

    let modal = document.querySelector('#modalConfirmacao') as HTMLDialogElement;
    let btnSim = document.querySelector('#sim') as HTMLButtonElement;
    let btnNao = document.querySelector('#nao') as HTMLButtonElement;

    this.textoModal = "Deseja apagar esse Registro?"
    modal.showModal();

    btnNao.onclick = function(){
      modal.close()
    }

    btnSim.onclick = async () => {
      await this.request.excluirRegistro('clientes', this.idRegistro);
      this.voltarConsultando();
      this.pesquisarGrid();
      modal.close();
    }
  }

  moverComponente(){
    let componente = document.querySelector(this.componente) as HTMLElement;

    function mover (event : MouseEvent){
      componente.style.left = `${event.movementX + componente.offsetLeft}px`;
      componente.style.top = `${event.movementY + componente.offsetTop}px`;
    }

    document.onmouseup = () => {
      document.removeEventListener('mousemove', mover);
    }

    document.onmouseleave = () => {
      document.removeEventListener('mousemove', mover);
    }

    document.addEventListener('mousemove',mover)
  }
}
