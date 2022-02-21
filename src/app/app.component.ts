import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { RestProvider } from './provider/rest.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  
  public Perfil:any;
  public img:any;

  constructor(public alertController: AlertController,
    public navCtrl:NavController,
    public proveedor: RestProvider,) {
      this.Perfil=localStorage.getItem('perfil');
      this.img=localStorage.getItem('img');
    }

    ionViewWillEnter(){
      this.Perfil=localStorage.getItem('perfil');
      this.img=localStorage.getItem('img');
    }

    ngOnInit() {
      
      this.Perfil=localStorage.getItem('perfil');
      this.img=localStorage.getItem('img');
    }

  async salir(){
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
}
