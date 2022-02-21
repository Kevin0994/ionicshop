import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { RestProvider } from '../provider/rest.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  Usuario:any;
  formLogin: FormGroup;


  constructor(public proveedor: RestProvider,
    public fb: FormBuilder, 
    public alertController: AlertController,
    public navCtrl:NavController) {
    this.formLogin = this.fb.group({
      'correo': new FormControl("",Validators.required),
      'password': new FormControl("",Validators.required)
    })
  }

  ngOnInit() {
  }

  async ingresar(id:any){
    var form = this.formLogin.value;
    if(this.formLogin.invalid){
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Tienes que llenar todos los datos',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }
    
    if(this.Usuario.length != 0){
      if(this.Usuario[0].correo == form.correo && this.Usuario[0].password == form.password){
        localStorage.setItem('ingresado','true');
        localStorage.setItem('Usuario',id);
        localStorage.setItem('perfil',this.Usuario[0].nombres+' '+this.Usuario[0].apellidos);
        localStorage.setItem('img',this.Usuario[0].foto_perfil);
        this.navCtrl.navigateRoot('home');
        window.location.reload();
      }else{
        const alert = await this.alertController.create({
          header: 'Datos incorrectos',
          message: 'Los datos no son correctos',
          buttons: ['OK']
        });
  
        await alert.present();
        return;
      }
    }else{
      const alert = await this.alertController.create({
        header: 'Datos incorrectos',
        message: 'Los datos no son correctos',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }
  }

  BuscarUsuario() {
    var form = this.formLogin.value;
    this.proveedor.BuscarUsuario(form.correo).then(data => {
      this.Usuario=data;
      console.log(this.Usuario[0].idusuario);
      this.ingresar(this.Usuario[0].idusuario);
    }).catch(data => {
      console.log(data);
    });
  }
}
