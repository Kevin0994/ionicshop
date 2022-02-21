import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Comentario } from '../models/comentario.interface';
import { RestProvider } from '../provider/rest.service';

@Component({
  selector: 'app-modal-coment',
  templateUrl: './modal-coment.page.html',
  styleUrls: ['./modal-coment.page.scss'],
})
export class ModalComentPage implements OnInit {

  @Input() idPost: any;
  Items:any;
  public User:any=localStorage.getItem('Usuario');

  formRegistro: FormGroup;
  public comen:Comentario;

  constructor(public proveedor: RestProvider,
    public modalController:ModalController,
    public fb: FormBuilder, 
    public alertController: AlertController,
    public navCtrl:NavController,) { 
      this.formRegistro = this.fb.group({
        'comentario': new FormControl("",Validators.required),
      })
  }

  ngOnInit() {
    this.loadComen(this.idPost)
  }

  closeModal(){
    this.modalController.dismiss();
  }

  loadComen(id:any){
    this.proveedor.loadComentarios(id).then(data => {
      this.Items=data;
      console.log(this.Items)
    }).catch(data => {
      console.log(data);
    })
  }

  EliminarComen(id:any){

    this.proveedor.EliminarComent(id).subscribe(data => {
      console.log(data);
      if(this.proveedor.status){
        this.loadComen(this.idPost);
        this.MensajeExito();
      }else{
        this.ErrorMensajeServidor();
      }
    })
  }
  
  
  async Registrar(){
    var formulario = this.formRegistro.value;
    if(this.formRegistro.invalid){
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Tienes que llenar todos los datos',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }
  

    this.comen = {
      idusuario: parseInt(localStorage.getItem('Usuario')),
      idpost: this.idPost,
      contenido: formulario.comentario,
    }

    this.proveedor.InsertarComen(this.comen).then(data => {
      
      if(this.proveedor.status){
        this.loadComen(this.idPost);
      }else{
        var result=this.proveedor.error;
        if(result == 400){
          this.ErrorMensajeServidor();
          return;
        }else{
          this.ErrorMensajeServidor();
          return;
        }
      }
    }).catch(data => {
      console.log(data);
    });
  }

  async ErrorMensajeServidor(){
    const alert = await this.alertController.create({
      header: 'Error del servidor',
      message: 'error al conectarse con el servidor',
      buttons: ['OK']
    });

    await alert.present();
  }

  async MensajeExito(){
    const alert = await this.alertController.create({
      header: 'Accion',
      message: 'Se ha borrado con exito',
      buttons: ['OK']
    });

    await alert.present();
  }

}
