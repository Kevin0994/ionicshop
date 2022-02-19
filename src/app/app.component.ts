import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  public Perfil:any=localStorage.getItem('perfil');
  public img:any=localStorage.getItem('img');

  constructor(public alertController: AlertController,
    public navCtrl:NavController) {
      this.Perfil=localStorage.getItem('perfil');
      this.img=localStorage.getItem('img');
    }

    ionViewWillEnter(){
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
