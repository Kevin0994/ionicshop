import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { RestProvider } from '../provider/rest.service';
import { ModalController } from '@ionic/angular';
import { ModalComentPage } from '../modal-coment/modal-coment.page';
import { Post } from '../models/post.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  Items:any;
  post:any;
  Comen:any;
  public idUsuario:any;
  
  constructor(public proveedor: RestProvider,
    public alertController: AlertController,
    public navCtrl:NavController,
    public modalController:ModalController) {
      this.idUsuario=localStorage.getItem('Usuario');
      console.log(this.idUsuario);
  }

  ngOnInit() {
    this.idUsuario=localStorage.getItem('Usuario');
    this.loadInfo();
  }

  ionViewWillEnter(){
    this.loadInfo();
  }

  loadInfo(){
    this.proveedor.loadPost().then(data => {
      this.Items=data;
      console.log(this.Items);
    }).catch(data => {
      console.log(data);
    })
  }

  async openModal(id:any){
    const modal = await this.modalController.create({
      component: ModalComentPage,
      cssClass: 'my-class-modal',
      componentProps:{
        'idPost':id,
      }
    });
    return await modal.present();
  }



  EliminarPost(id:any,iduser:any){
    console.log(iduser+"+"+this.idUsuario);
    this.proveedor.FiltrarComentarios(id).then(data => {
      this.Comen=data;
      this.Comen.forEach((element, index) => {
        this.proveedor.EliminarComent(element.idcomentario).subscribe(data => {
          if(index==this.Comen.length-1){
            console.log("Eliminando");
            this.proveedor.EliminarPost(id).subscribe(data => {
              console.log(data);
              if(this.proveedor.status){
                this.ErrorMensajeServidor();
              }else{
                this.loadInfo();
                this.MensajeExito();
              }
            })
          }
        })
      });
    }).catch(data => {
      console.log(data);
    })
  }

  async salir(){
    console.log('Holi');
    const alert = await this.alertController.create({
      header: 'Salir',
      message: '¿Seguro desea salir?',
      buttons: [
        {
          text: 'No',
          handler: () => {

          }
        }, {
          text: 'Si',
          handler: () => {
            localStorage.clear();
            this.navCtrl.navigateRoot('login');
          }
        }
      ]
    });

    await alert.present();
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
      message: 'Datos borrados con exito',
      buttons: ['OK']
    });

    await alert.present();
  }

}
