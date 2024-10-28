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
    let html : string = "";

    for(let i = 0; i < 15; i++){

      html += `<tr><td class="codigo">teste</td><td class="cliente">teste</td><td class="cadastro">teste</td></tr>`
      
    }

    this.dadosTabela = this.sanitizer.bypassSecurityTrustHtml(html);

  }

}
