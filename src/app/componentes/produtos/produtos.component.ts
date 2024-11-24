import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RequestService } from '../../servicos/request.service';
import { ComunsService } from '../../servicos/comuns.service';
import { RouterService } from '../../servicos/router.service';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.css'
})
export class ProdutosComponent {
  componente = 'produtos';
  comuns : any;
  router : any;

  textoModal : string = "";
  mensagem : string = "";
  modoTela : string = "";

  navTabela : Array<number> = [];
  idRegistro : number = 0;
  countTabela : string = "0";
  dadosTabela : any;

  readOnly : Array<string> = [];


  constructor(private sanitizer : DomSanitizer, private request : RequestService, private comunsService : ComunsService, private routerService : RouterService){
    this.comuns = this.comunsService;
    this.router = this.routerService;
  }

  // Pega o Valor do campo Pesquisa, envia para o serviço Requisição e envia dados para GRID:
  // Grava o ID dos Registros para função navegarRegistro:
  async pesquisarGrid(){
    let data = {
      pesquisa : (document.querySelector(`#${this.componente} #pesquisa`) as HTMLInputElement).value
    };

    let response = await this.request.dadosGrid(this.componente, data);
    this.navTabela = [];
    
    let html : string = "";
    for(let i = 0; i < response.length; i++){
      html += `<tr id="${response[i].id_produto}">
      <td class="codigo">${response[i].codigo}</td>
      <td class="produto">${response[i].produto}</td>
      <td class="marca">${response[i].marca}</td>
      <td class="valor">${Number(response[i].valor).toFixed(2).replace('.',',')}</td></tr>`;

      this.navTabela.push(response[i].id_produto);
    }

    this.dadosTabela = this.sanitizer.bypassSecurityTrustHtml(html);
    this.countTabela = response.length;
  }

  // Solicita código disponível pelo serviço de Requisição. Lança o valor no campo.
  // Altera o modoTela e solicita o serviço comuns para Alternar Tela
  async incluirRegistro(){
    let response = await this.request.codigoAuto(this.componente);
    let codigo = document.querySelector(`#${this.componente} #codigo`) as HTMLInputElement;

    this.modoTela = "Incluindo";
    this.comuns.alternarTela(this.componente, this.modoTela, this.readOnly);

    codigo.value = String(response[0].codigo).padStart(codigo.maxLength, '0');
  }

  // Chama modal de Confirmação e de acordo com a resposta Alterna a Tela.
  cancelarRegistro(){
    let modal = document.querySelector(`#${this.componente} #modalConfirmacao`) as HTMLDialogElement;
    let btnSim = document.querySelector(`#${this.componente} #sim`) as HTMLButtonElement;
    let btnNao = document.querySelector(`#${this.componente} #nao`) as HTMLButtonElement;

    this.textoModal = "Realmente deseja sair?"
    modal.showModal();

    btnNao.onclick = function(){
      modal.close()
    }

    btnSim.onclick = () => {
      this.modoTela = "";
      this.mensagem = "";
      this.comuns.alternarTela(this.componente, this.modoTela, this.readOnly);
      modal.close();
    }
  }

  // Exclusiva para modo: Consultando. Retorna para a tela GRID
  voltarConsultando(){
    this.modoTela = "";
    this.mensagem = "";
    this.comuns.alternarTela(this.componente, this.modoTela, this.readOnly);

    document.querySelector('.trFocus')?.classList.remove('trFocus');
    this.idRegistro = 0;
  }

  // Valida os Inputs, Salva dados e, de acordo com ModoTela, Utiliza Serviço de Resquisição para Incluir ou Alterar.
  // De acordo com Modo do Parâmetro, continua na tela para Incluir mais ou volta para GRID.
  async salvarRegistro(modo : string){

    if(this.validarInputs() != true){ return }

    let data = {
      codigo: (document.querySelector(`#${this.componente} #codigo`) as HTMLInputElement).value,
      produto: (document.querySelector(`#${this.componente} #produto`) as HTMLInputElement).value,
      marca: (document.querySelector(`#${this.componente} #marca`) as HTMLInputElement).value,
      categoria: (document.querySelector(`#${this.componente} #categoria`) as HTMLInputElement).value,
      custo: (document.querySelector(`#${this.componente} #custo`) as HTMLInputElement).value.replace('.','').replace(',','.'),
      desconto: Number((document.querySelector(`#${this.componente} #desconto`) as HTMLInputElement).value.replace(',','.')) /100 ,
      valor: (document.querySelector(`#${this.componente} #valor`) as HTMLInputElement).value.replace('.','').replace(',','.'),
      descricao: (document.querySelector(`#${this.componente} #descricao`) as HTMLInputElement).value,
      ativo: (document.querySelector(`#${this.componente} #ativo`) as HTMLInputElement).checked,
    }

    let response;
    switch(this.modoTela){
      case "Incluindo":
        response = await this.request.novoRegistro(this.componente, data);
      break;

      case "Copiando":
        response = await this.request.novoRegistro(this.componente, data);
      break;

      case "Alterando":
        response = await this.request.alterarRegistro(this.componente, data, this.idRegistro);
      break;
    }

    let modal = document.querySelector(`#${this.componente} #modalSucesso`) as HTMLDialogElement;
    let button = document.querySelector(`#${this.componente} #modalSucesso button`) as HTMLButtonElement;

    if(response.sucesso){
      this.textoModal = "Registro Salvo com Sucesso!"
      modal.showModal();
      button.onclick = function(){
        modal.close()
      }

      if(modo == "Incluindo"){
        this.pesquisarGrid();
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
        (document.querySelector(`#${this.componente} ${inputs[i].duplicado}`) as HTMLElement).classList.add('inputObrigatorio')
      }
    }
  }

  // Solicita ao Serviço de Requisição dados de um Registro específico.
  // Alterna a Tela de acordo com parâmetro Modo pelo serviço Comuns.
  async detalhesRegistro(modo : string){
    if(this.idRegistro == 0){ return }
    let response = await this.request.consultarRegistro(this.componente, this.idRegistro);
    
    for(let i in response[0]){
      if(document.querySelector(`#${this.componente} #${i}`)){
        let input = document.querySelector(`#${this.componente} #${i}`) as HTMLInputElement;
        input.value = response[0][i];

        if(i == "desconto"){
          input.value = Number((response[0][i]) * 100).toFixed(2).replace('.',',');
        }

        if(i == "valor" || i == "custo"){
          input.value = Number(response[0][i]).toFixed(2).replace('.',',');
        }

        if(input.type == "select-one"){
          response[0][i] ? input.innerHTML = `<option value="${response[0][`id_${i}`]}" hidden>${response[0][i]}</option>`: "";
        }

        if(input.type == "checkbox"){
          input.checked = response[0][i];
        }
      }
    }
    
    this.modoTela = modo;
    this.comuns.alternarTela(this.componente, this.modoTela, this.readOnly);
    this.comuns.navRegistros(this.componente, this.idRegistro, this.navTabela);
  }

  // Valida os inputs Cadastro e Contato, exclusivos desse componente.
  // Envia array com id de inputs obrigatórios para Serviço Comuns para validar e tratar;
  validarInputs(){
    let valor = document.querySelector(`#${this.componente} #cadastro`) as HTMLInputElement;
    
    let inputs = ['#codigo', '#produto', '#valor'];
    let validarInputs = this.comuns.validarInputs(this.componente, inputs);

    if(validarInputs != true){
      this.mensagem = validarInputs;
      return false
    }

    return true
  }

  // Destaca a Linha Registro clica por último
  trFocus(event : MouseEvent){
    if((document.querySelector(`#${this.componente} .grid-tabela`)) == (event.target as HTMLElement).parentElement){
      return
    }

    let tr = (event.target as HTMLElement).parentElement as HTMLTableRowElement;
    if(document.querySelector('.trFocus')){
      document.querySelector('.trFocus')?.classList.remove('trFocus');
    }
    
    tr.classList.add('trFocus');
    this.idRegistro = Number(tr.id);
  }

  // Navega entre os Registros da GRID. Parêmtro Função é passada no Button HTML
  // Exclusivo para ModoTela Consultando
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

  // Aciona Serviço de Requisições para obter Dados de Registro Específico.
  // Aciona Serviço Comuns para Alternar Tela no modo Copiando.
  async copiarRegistro(){
    if(this.idRegistro == 0){ return }
    await this.detalhesRegistro("Copiando");

    let response = await this.request.codigoAuto(this.componente);
    let codigo = document.querySelector(`#${this.componente} #codigo`) as HTMLInputElement;
    
    this.modoTela = "Copiando";
    this.mensagem = "";
    
    this.comuns.alternarTela(this.componente, this.modoTela, this.readOnly);
    codigo.value = String(response[0].codigo).padStart(codigo.maxLength, '0')
  }

  // Aciona o Modal e Confirma Exclusão que é feita pelos serviço de Requisições.
  async excluirRegistro(){
    if(this.idRegistro == 0){ return }

    let modal = document.querySelector(`#${this.componente} #modalConfirmacao`) as HTMLDialogElement;
    let btnSim = document.querySelector(`#${this.componente} #sim`) as HTMLButtonElement;
    let btnNao = document.querySelector(`#${this.componente} #nao`) as HTMLButtonElement;

    this.textoModal = "Deseja apagar esse Registro?"
    modal.showModal();

    btnNao.onclick = function(){
      modal.close()
    }

    btnSim.onclick = async () => {
      modal.close();
      await this.request.excluirRegistro(this.componente, this.idRegistro);
      this.voltarConsultando();
      this.pesquisarGrid();
    }
  }

  // Move o componente como arrasta e solta pela tela
  moverComponente(){
    let componente = document.querySelector(`#${this.componente}`) as HTMLElement;

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

  // Lookup: Pega Valores de uma tabela e insere em um Select
  async lookupSelect(input : HTMLSelectElement){
    let response = await this.request.lookupSelect(input.id);
    input.innerHTML = `<option value="" hidden></option>`

    for(let i = 0; i < response.length; i++){
      input.innerHTML += `<option value="${response[i][`id_${input.id}`]}">${response[i].codigo} - ${response[i][input.id]}</option>`
    }
  }
}
