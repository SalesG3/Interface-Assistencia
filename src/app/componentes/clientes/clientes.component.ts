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
  dadosTabela : any;

  constructor(private sanitizer : DomSanitizer, private request : RequestService, private comuns : ComunsService){

    //Teste de estilização para Tbody:
    let html : string = "";

    for(let i = 0; i < 15; i++){

      html += `<tr><td class="codigo">teste</td><td class="cliente">teste</td><td class="cadastro">teste</td></tr>`
      
    }

    this.dadosTabela = this.sanitizer.bypassSecurityTrustHtml(html);

  }

  async incluirRegistro(){
    let response = await this.request.codigoAuto('clientes');
    let codigo = document.querySelector('#codigo') as HTMLInputElement;

    this.comuns.alternarTela('Incluindo');
    this.mensagem = "";

    codigo.value = String(response[0].codigo).padStart(codigo.maxLength, '0');
  }

  cancelarRegistro(){
    let modal = document.querySelector('#modalConfirmacao') as HTMLDialogElement;
    let btnSim = document.querySelector('#sim') as HTMLButtonElement;
    let btnNao = document.querySelector('#nao') as HTMLButtonElement;

    let alternarTela = this.comuns.alternarTela;
    this.textoModal = "Realmente deseja sair?"
    modal.showModal();

    btnNao.onclick = function(){
      modal.close()
    }

    btnSim.onclick = function(){
      alternarTela('');
      modal.close();
    }
  }

  async salvarRegistro(modo : string){
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
}
