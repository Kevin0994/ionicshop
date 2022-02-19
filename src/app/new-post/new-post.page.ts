import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, NavController } from '@ionic/angular';

import { Post } from '../models/post.interface';
import { RestProvider } from '../provider/rest.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.page.html',
  styleUrls: ['./new-post.page.scss'],
})
export class NewPostPage implements OnInit {

  formRegistro: FormGroup;
  public post:Post;
  public img:any;

  constructor(public proveedor: RestProvider,
    public fb: FormBuilder, 
    public alertController: AlertController,
    public navCtrl:NavController,
    public sanitizer: DomSanitizer) { 
      this.formRegistro = this.fb.group({
      'titulo': new FormControl("",Validators.required),
      'contenido': new FormControl("",Validators.required),
    })
  }

  ngOnInit() {
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
  

    this.post = {
      titulo: formulario.titulo,
      imagen: this.img,
      contenido: formulario.contenido,
      idusuario: parseInt(localStorage.getItem('Usuario')),
    }

    console.log(this.post)

    this.proveedor.InsertarPost(this.post).then(data => {
      console.log(data);
      if(this.proveedor.status){
        this.navCtrl.navigateRoot('home');
      }else{
        var result=this.proveedor.error;
        if(result == 400){
          this.ErrorMensajeCorreo();
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

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
          resolve({
            blod: $event,
            image,
            base: reader.result
          });
        };
        reader.onerror = error => {
          resolve({
            blod: $event,
            image,
            base:null
          });
        };
      }catch(e){
        return null;
      }
  })

  capturarFile(event): any {
    const archivoCapturado = event.target.files[0]
    this.extraerBase64(archivoCapturado).then((imagen:any) => {
      this.img= imagen.base;
    })
    
 }


  async ErrorMensajeServidor(){
    const alert = await this.alertController.create({
      header: 'Error del servidor',
      message: 'error al conectarse con el servidor',
      buttons: ['OK']
    });

    await alert.present();
  }

  async ErrorMensajeCorreo(){
    const alert = await this.alertController.create({
      header: 'Error del servidor',
      message: 'ya existe un correo con este nombre',
      buttons: ['OK']
    });

    await alert.present();
  }


}
