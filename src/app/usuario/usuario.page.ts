/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable max-len */

import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { RestProvider } from '../provider/rest.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UsuarioPut } from '../models/usuarioPut.interface';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  formRegistro: FormGroup;
  public formulario:any;
  public Usuario:any="init";
  public usuarioPost:UsuarioPut;
  img: string;
  inputDisabled: boolean;
  public base64TrimmedURL:any;
  public base64DefaultURL:any;

  constructor(public proveedor: RestProvider,
    public fb: FormBuilder, 
    public alertController: AlertController,
    public navCtrl:NavController,
    public sanitizer: DomSanitizer,) {  
      
      this.formRegistro = this.crateForm();
    }

  ngOnInit() {
    this.formRegistro = this.crateForm();
    this.loadInfo();
    this.img=localStorage.getItem('img');
    this.getImage(this.img);
    this.inputDisabled = true;
  }

  loadInfo(){
    this.proveedor.BuscarUsuario(localStorage.getItem('Usuario')).then(data => {
      this.Usuario=data;
      console.log(this.Usuario);
      this.formRegistro = this.crateForm();
    }).catch(data => {
      console.log(data);
    })
  }

  async saveProfile(){
    this.formulario = this.formRegistro.value;
    if(this.formRegistro.invalid){
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Tienes que llenar todos los datos',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }
  
    var cadena= this.img;
    var convert= cadena.substring(0,4);

    if(convert === 'http'){
      this.crearUsuario(this.base64DefaultURL);
      localStorage.setItem('img',this.base64DefaultURL);
    }else{
      this.crearUsuario(this.img);
      localStorage.setItem('img',this.img);
    }

    this.proveedor.ActualizarUsuario(this.usuarioPost).then(data => {
      console.log(data);
      
      if(this.proveedor.status){ 
        this.proveedor.usr=true;
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

  crateForm() {
    return this.fb.group({
      correo: [{value: this.Usuario[0].correo, disabled: true}, Validators.required],
      nombres: [{value: this.Usuario[0].nombres, disabled: true}, Validators.required],
      apellidos: [{value: this.Usuario[0].apellidos, disabled: true}, Validators.required],
      telefono: [{value: this.Usuario[0].telefono, disabled: true}, Validators.required],
    });
    
  }

  crearUsuario(img:any){
    this.usuarioPost = {
      idusuario: parseInt(localStorage.getItem('Usuario')),
      correo: this.formulario.correo,
      nombres: this.formulario.nombres,
      apellidos: this.formulario.apellidos,
      telefono: this.formulario.telefono,
      foto_perfil:img,
      password: this.Usuario[0].password,
    }
  }


  cancelEditProfile() {
    this.inputDisabled = true;
    this.formRegistro.controls.correo.disable();
    this.formRegistro.controls.nombres.disable();
    this.formRegistro.controls.apellidos.disable();
    this.formRegistro.controls.telefono.disable();
    this.formRegistro = this.crateForm();
  }

  editProfile() {
    this.inputDisabled = false;
    this.formRegistro.controls.correo.enable();
    this.formRegistro.controls.nombres.enable();
    this.formRegistro.controls.apellidos.enable();
    this.formRegistro.controls.telefono.enable();
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

  getImage(imageUrl: string) {
    this.getBase64ImageFromURL(imageUrl).subscribe((base64Data: string) => {
      this.base64TrimmedURL = base64Data;
      
    });
  }

  /* Method to fetch image from Url */
  getBase64ImageFromURL(url: string): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = err => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  /* Method to create base64Data Url from fetched image */
  getBase64Image(img: HTMLImageElement): string {
    // We create a HTML canvas object that will create a 2d image
    var canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    // This will draw image
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    let dataURL: string = canvas.toDataURL("image/png");
    this.base64DefaultURL = dataURL;
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
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
