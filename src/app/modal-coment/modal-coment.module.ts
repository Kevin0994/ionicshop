import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalComentPageRoutingModule } from './modal-coment-routing.module';

import { ModalComentPage } from './modal-coment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModalComentPageRoutingModule
  ],
  declarations: [ModalComentPage]
})
export class ModalComentPageModule {}
