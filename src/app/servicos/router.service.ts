import { Injectable } from '@angular/core';
import { ClientesComponent } from '../componentes/clientes/clientes.component';
import { ServicosComponent } from '../componentes/servicos/servicos.component';
import { CategoriasComponent } from '../componentes/categorias/categorias.component';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor() { }

  componetes : Record<string, any> = {
    clientes: ClientesComponent,
    servicos: ServicosComponent,
    categorias : CategoriasComponent
  }

  outlet01 : any;
  outlet02 : any;
  outlet03 : any;
  outlet04 : any;
  outlet05 : any;

  outletStatus : Record<string, boolean> = {
    outlet01: false,
    outlet02: false,
    outlet03: false,
    outlet04: false,
    outlet05: false
  }

  abrirComponente(componente : string){

    for(let i in this.outletStatus){
      if(this.outletStatus[i] == false){
        
        this[i as keyof RouterService] = this.componetes[componente];
        this.outletStatus[i] = true;
        break
      }
    }
    setTimeout(() => {
      let docComponente = document.querySelector(`#${componente}`) as HTMLElement;
      docComponente.style.zIndex = '2';
  
      docComponente.addEventListener('mousedown', () => {
        let docComponentes = document.querySelectorAll('.componente');
  
        for(let i = 0; i < docComponentes.length; i++){
          (docComponentes[i] as HTMLElement).style.zIndex = '0'
        };
  
        docComponente.style.zIndex = '1';
      })
    }, 100)
  }
}
