import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, NavController } from '@ionic/angular';
import { Usuario } from '../models/usuario.interface';
import { RestProvider } from '../provider/rest.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  formRegistro: FormGroup;
  public usuario:Usuario

  constructor(public proveedor: RestProvider,
    public fb: FormBuilder, 
    public alertController: AlertController,
    public navCtrl:NavController,
    public sanitizer: DomSanitizer) {
    this.formRegistro = this.fb.group({
      'nombres': new FormControl("",Validators.required),
      'apellidos': new FormControl("",Validators.required),
      'correo': new FormControl("",Validators.required),
      'telefono': new FormControl("",Validators.required),
      'password': new FormControl("",Validators.required),
      'confirPassword': new FormControl("",Validators.required)
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
  

    this.usuario = {
      correo: formulario.correo,
      nombres: formulario.nombres,
      apellidos: formulario.apellidos,
      telefono: formulario.telefono,
      foto_perfil: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/7QCEUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAGgcAigAYkZCTUQwYTAwMGE2ZTAxMDAwMDRkMDUwMDAwZmUwOTAwMDBjZDBhMDAwMDhmMGIwMDAwYWUwYzAwMDBjOTEwMDAwMDlmMTEwMDAwOWYxMjAwMDBhYTEzMDAwMGU2MWEwMDAwAP/bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/CABEIAOEA4QMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAEAAIDBQYBB//EABgBAAMBAQAAAAAAAAAAAAAAAAECAwAE/9oADAMBAAIQAxAAAAEFj2zfLimC0WOyBOB0NpX2QL6iwqVNLqM28ve5fm3MrSi22GK0Ho3nHo4YHMabN44+MiEhjnyZWd6tndb3By4sdk1zZ0zQxAlUsyKMsbRWtLdK1FSX+e1Hrjw0mzxm6aWk84tJSmY9DFKQg0V5Sk46GZjZnI+5ZUx+Ca6E56hRG/ZIyNcyCfVURhYRebS3+Z0o1NQ67OhxCOWmLtFA/JlthjdkRZca9CIJeOFvKazf4F5iPic053wS5XxSRtmLqI33U+FM+Po7hmy1b6mKtPPtLT27SmAOjXZMsu0ZpmoYLS7HJaw40gc1HmUnTWs8+9ToivkPbilaD5RpChELo9nJiw9AnDIShVwBbasssUqvR1+rrBswaEcZtlltdqEDcMWmWuLiUGtNLhI72N7MoZ+Eef4X2Ly15Vr+dMXwzQ4NXUdtSqs5Kae1rrEWk4nAtb3qNV8u+DDWUJLLEk7aORLF0bp2UGTlQr2kYRYLPOvTM3SfljSxHh2KaLK1cWF8VSFino91n9Cl11sobvH0aawbkQ83pB3nO6ec8ZQeD2x9nSQgXrpnMte4pjpis7TsvrsWY2cn8roPYfO3nn2EQPBiciFLaSltpqM/fS6ezDTTavwG284ILJqLq0aXf1txz9N+MI2L2Mw07iZR9qgOe1kSNmS9DO8qmya0N3O34yPhRtuNSGRWsVJeSWpFrVNnZV8vJ2PPAnm5Ncd11GnXdmRTyowMFrVhnvqAtXRNqZc5/aAoppjhzenhCgOYjVrTBJ1irz2FaVWSeVhLI20BR5Xcva1OYjTSDTnEP4TWULpWsr2ve6UmZ3wCWxkp1bzd02gr9DbnMkid0cSY5ilQOiBD50VKEodYW0JAtoCkU5PL1HQVoGOgnzNsyXkgk1EfziOmcOiCIGRbQ1VqPPo5Z1pRWwcG6kSoYhtnBhV6veTUdkMahkNeimw15886wB5uoRz3BuzhurM+Si4y6LtaRgWh1jI2AUk2vFrlrcn5I4bSKgTTu6wGAFRzLF1nWFjEqvSHdN5zq4w81qc/C4VgFJG5MDe0mDAfxwMXDHjYxg8OlFIIzAFWJKmqbe8wz6u4jqqY1uAsRvRhZ5iRgVcrLaJvb83K+xiVsky4F5+oeSSQgdhrKTHUncYuzu2jI486aVjzudik2ZARANC2RAs4ogZbAKxafU9PIpJEOaltX0qUemSZJS56VEGalg56W0jktp3JAxvSO5CkCxiR0DEkc6xSpF6SeX//xAAqEAACAgEDBAICAgIDAAAAAAAAAQIDEQQQEgUTITEgMiJBIzMUNCQwQv/aAAgBAQABBQL9z+t3syaR/wAmoWSn+s1cvxgm5qzhC3Up1xqs1Go0mkv09XXlDh03++XqZrif22wY2W/7n9bvY4M0scWTK/rZNIunGQ3hztzFyeNFpLumavpzusu6080dN/2JepGtJfYS+f7n9bva9wRXH87WVv8Aj1tnn9vzt/56dRqHr9BV2Oo9Yv56jp0f5n6kawn9vlkyP3L63+zuNFFjc5eSv+vWwP2NoqXKUpWXFvVtbzo01bUNPCLYzV+p/djYt2PZ+5fXUe/0yj7Jlf01s2m/aOzg01JH1Z/t6b0M45d9GYXVcZz2WyGPZ+5fXU70/ZFX9d9fI7LU5rEtPOMiKWCf+3R6ERiSj46jR+N0XF7owPZ+39dTXkq0vIl07w9M4T/dP9ZdHxb70df5R9SZj/k0eiCEhovr5rqGnxJx842Q/gicDS1R4qES6iLjq6+3Kn+okWUcpwgorOBzyJfz0+kV7tGsoUo6qKg3svgyBGHIqXFRMGr0/Ma4RdjT9xW04yxCEsw0/muDIxZFY+E1yj1bTYUlhiHvJlUvGn94Etmsl9Xi+GJRX4wqbcdOKrx2URgjgcSSwL4a+vnHWQ42/HJUadC+EvKsoTaqwU1ox4wNGN5oSMb2LK6lT+b+KZV70+y3wRiSgQX/AEWz4EtX5jqckZ5GdQqzC6OHs9uZTb+WilnbOyQ3glekf5ESq2MtpL4Iz46jdxUbuRzcVVq1mm1TNXDnXq9NODl4e6ZV9+n7YIxJPBqNRgndklczS6vD09vKL9Mzvnx1WGYVtweovfbjZLl022WYPK11HcWq0vGUoYMHEakimT7nTZZ2W2pswtXqfzo1ES+6vhCz+TQWs7vhzyR3ZqK+Sno/K0WSHT4lenjAisFhqaORZo8n+Gz/AA2cIyK9PHl0+niPwJn61kPGppk7a9LIr0HIr6ZFFdHbP0iIjJkb2hs2ZMkkNDMim0aW389DLMbCKIslFSHpo8o0QRwgho4mNlI5HM5nMUyowNDW7aLTDIaGTKNBiWnh21KfmLExMyZ3SHHxbFkpSQ9Q0Qsyciy1o0zlMpj4MDiSgSRglA7ZGqKOMSYlsjkJ5EjicRCJQyXafK1GlknFOJkjXyelq4qPxkic1A7iZyWzJkV42QiAt1sy6GS6sw86dFYvg2OZYlIxvIyR9MYpEZEfgtskiyOSdfmpYIsTORklInMlYKwTzvb6y+XLxO1krJEHNlWSDMmTJyORyGxkiImZMmScy20dhCRF+M7W+uP5NeO3k7Ao8RM5CkZM75MjkW2YIW+YyORzJWFto5ctoCfjltJEo4JySFNDl4TORO0hf5hbk5HI5DmStRO4sk2Rck42M7x3SVh5YomCI/rkztd6vk+VfkS8EyXkwRsaI3M7w7iV7HNsSyRrO0do7ZwFWKJgaIROOTt7zRfX+UfxO4ZH5WDiOBxMM4sVZGojURrOA4DgcDBgwcTBCJx+F0C1MjAaEhx2wcTgcBREhL4MY9sbRIr4zWVZXgz8HEx8l8GPdyMlZH1j4MuJfZbLZ/BbRHux7MYisjt//8QAIREAAgMAAgICAwAAAAAAAAAAAAECEBEDIBIxEyEiMFH/2gAIAQMBAT8BfRU6Xd0qjUkZ0fbKRo3fiNYPrFGDVbcVTWkl1gqaPEURQHEVzM6Q9dH0SbMwkh9IDEfiTX8ImDQ20KTPY4jRgmQqXr6EmRiKGDRhhJGCickDCJxoaPE8TywjPRJM8CSwlL7FMUkTMIr7IvDTRyNNZDkIy1HNKlSMI+zDB9EQZOsEriyLpmWkIkjDLyuN01WGVpptt4fJUWKRJ1pppvWbNuI/1clf/8QAHhEAAgMAAwADAAAAAAAAAAAAAAECEBESICEDMDH/2gAIAQIBAT8BXZfSuyGb2wVvpK1atmj6O11Q6005HI1ul2Q6dJdH4chdXTMZEl4aJiSY4o0UrwfhpH9OSROY5tkaYn4NjkRkaafJITORyM0cBeHIXpFeEojixUyS0ylEwSJQGsPjj0ZpL8NORG9poj4aabWDJREhdWLozlXyIRF3tYZ0/TjTHEj9LIoy5C+lka//xAAtEAABAgUCBAUEAwAAAAAAAAABAAIDESAhMRAwEhMyQARBYGFxBSJQUXKBsf/aAAgBAQAGPwJFHUIUBCaKEOC3ie42CHN8MHfxcCU10OUjek7RR1CGsqIMR4hvL2mUnfHso3i4o4IcRreFodxYTXDDiXD+zQds0iuCz6hzZOa7gm/4XioTA8QeFpEyZTUaE3DYjv8AaCjtGkVS8lCfEiu4ofSQAJLlc0S/YbfSw1KO0aRRJTU6yjvjX20kraimyvt4WFiqe1YbeFhY0Gs9smSO9KnCwpyrkrdnhYWPwxNY7YlGoIbFtg0kBGdQQ2AENnCwV56mkIUlfcrISQ2LBXC6VYUY1yghQUbLpVwp9nlCaFPSulY7TpQsh2FkJ7WFj07f1lL1f//EACQQAQEBAAMBAAMBAAEFAAAAAAEAERAhMUEgUWFxkYGhseHw/9oACAEBAAE/IeGNeXTlPGCeChb9u/IU6nE9YWNAe/8AYH2aFjAn2fXmDthwZsPhn4h4lkjySDGeN6LD9oOuYDbW/VhQlof/ABt2Y1Z013kBjAD9CJ/5vDg9W4O0nf4g8vBevECfIgNizIM2whe+s9TAb27xva/nxjIdHdGm7iwjNwsP6mC48HphvDJ3eW2xLn45vS3C+RjGyg9LRUn2QTDqcX66kkRdw/8AE/l4uXyn/P8A9QpR231eb2wYEdDgXBzd8y9LZ7nh4HnYgIbqXZOj6vJS88fh/kN2JpvZtBPH8RfgD2j7O5Y3nPuecJepX2CDNijdFubdof8AihhsMSiPaceQBiDKhZekNV2OpGQMM9Py8Gy63zibMTmxdJgM6LeEcHRwdI2/Di0gxhOUvD7HSJOyyGII/wAOyjv7jRAfZBB1Aeu5wi1aBvHiOCB+cZHWU9evwvttjYaQKPHghIlqT4IAR0PDFlPIt7FoA8tXnAOG3ITouus4eJ9/AB2lciM3Y6kH/Z0xKQDqHozKAPFj4Qc8tkuW+d8tY4J8n3h2T8LzYcZbA7rdZZMgWZi1iBFrd8gmTvhl6EMXhnlcHoshNkb4Rs58vsM8HtnUA3qMx1F+kFHV0tf9VWfi/QsMYEO8BHu+lG3bwABOXbZd3rJ2pmd2AsQCw5jJ6iYBFwtnky9kMImxu7bHdw2fxf2XfkPckR5wHjqiVU2KdNh4vJZYYNJ7RA3Xy81N8y/1a/V7N7GzX5w3C3u7oN45XT3J2LNpgfdulDHAc02Jg/Xog+z5pAICQ66mXU/lfyn2i6kkWhPWcHsZwLtzk59WY0ntZADOHufXAn+4Lrb1b1yXVtx9OK099Bhu0m9x53EeT9T5SPAYvhxck4cl/uf64aN3Z6ceUz/b9SHTl/SQ7ioaUm/Ciu1wHBvBbhfNmO7F7PXhjiFkJOpgPA13ury1+r42S8NkOrR2y6MY5VqIMh1B8W1hfUQGN34D5l1LZtnGGczIB85PFt4yMwWNqxKWki2MNzXCwEukcJ28MJf04To2Nl0GTspmQQlpLrhghDkxQDhdD8NPEw+3byjOOiu5DL+xPenj1XTB/BMeAm9y764jjbkXd7Kvs7xt2Q1XpzkPsf68BRv9cBlnhItXtt6hfsX/AHB+7rZlZxzNmy2GJLIXx3zTPs4LD7fQwfUFjpxKFA+Mr1e4hHsL9z/cr9nThYe55NcF6lBYlrgDk+oRzdDwh57Pf2X7WWbl/mcfPwzOZ22/t8L/ADJxucQb7sPTkOt241nFpI38b+Fh8j+IYf1I/Vn9TGlL32f1ymxYtoer7Jw9XEEcGIucfHnGQ5MsT1dm6ud46y9mSDq9gg4ekREETlth6nwbeLtCH4Bw88g84Pl75OXjh9/MfXDwcf/aAAwDAQACAAMAAAAQs/RreCLjSPFWWNMA8/KgH6fNJNxcg/czpeqNEfM+XQYEzEZBfXs3M3hTH1TPFxq6znZfTaCQUjweF55NpnAJkA8cxOYjD7lUxYvEp2SPC5Av2JOtYM0ZFsjxB+pqQLmU45pIdp/pcW6RRh7V4/a76NZKItOwZzT+Lx+OCaioEdmI1ZW/Cd+/IcqfX/XckCkH7owOCsKP/HFwoQKF9PidBig9d9CBCddiD//EAB0RAQEBAQEBAQEBAQAAAAAAAAEAERAhMUEgMFH/2gAIAQMBAT8QFsO2Q9k2+4ekn+SXjgsl2HBZZsP4Xhw5WWkQawM/qG0ZOWDHk65mW/s+Wax4vEv0tgZV/wBYIIB5JbDjOEJlhkJvszfIZdlx4K5tDJ4XxwNl+Nv0hX7ebeA8v3SY9t/k1q0viS0Q59tz2D45ajx7ekPLL7AOnP1eO23GC8IV7xAxC2mX2VYSxyAILIyzfJbIOkw+xx+M7vA5LSxy9HkZnnBn3hQnrZ0pnPS3JXnV8jgbSacZryeWfkm8ixYgC8zuw2230dYNsWlscXgsNsH8Q+3z/hIvy+uf/8QAHBEBAQEAAwEBAQAAAAAAAAAAAQARECExQSBR/9oACAECAQE/EK+cbb+Db+cvXCS5e8K6E6Yb5HfAbx9W2w0ieoe59cbPTjbxaRLCO0tI2TIZjLHd0t43gd8c6ulmYqKMuoe4eCyHHeGXVYQAwbIhFfIbZ5OH8l8ZfEbbGY7svUIYI74XOd/IHqfJGOnGDYzJu9TMG/hOnFnwsm/qVafcpJi9mrLGa+Qoo3c3JFaIFifYJ5AxfJ1fSPJJIY8hI92Hy7RwYl2NjCMY98BpZMVmJLLyUrZeFhwGb0unvJvBZTCIJly/jmdJxhkFllkISnHsvlt3Y4b1eomPyXu88f/EACcQAQEBAQACAgIDAAICAwAAAAEAESExQVFxEGGBkaGx8NHhIMHx/9oACAEBAAE/EHzjv0XgvmDExuWSLHjnixKWQWYfXYFrkNoZnuPvSWSbWc3OqrwAFV5HhxuJB5zjX6FZxQ98AkmW85eD6P8AiGqW6yifud2PVbt9RiD8QMub+HzsPoiv2XXIAxMiYxGv1k/F4t/lPeqRajHwMtp6GtgG7CB61eHj59wT/aJAkBiicDb53BgLn4cGnp09TBfqWj6/+ra46wcttfn8QoQOS7Fh+NI4suk/Vj+WwiLQGZ/cwfq4rbgTuRU2PjZdewQJzgwO/UOga2LlInTiOc9fEYt39iMPedD9WSRi5eZ/1ZLEc8n7vH9S0LEm8A+bypc7DX8Opou3ea/zXH2wtN/BNDW/fnkCHqEx4mnxLsL4gI+ltjirP3LQnvChqIbwHdM0zsxk8jn368B/YJ4ZGquq+1fK3DRj39WytweJunzEh1TbZ/HjDYI8vta1f5LlbpGkdSPv8R2dPxLsTJiLni2vdkWHnkoSKTeXg2JZH4GT4/77nluXbokfC5h6kFQ3zloBPd/ATPMsg9XdkdWSH0zDfQnTr25+Sx/gu5X3TnH9yf7uGQFODDkKcstgRkP1cuf97ZQwJPH3AdTJOHku74TgiottyWyDkA7JatCX2QlCNRUvGKAeNuSy+8gQhMS9jy3VdCGv6ly3FtWQXYGV+5Zf9E9yz67ptg/A5wOXM9zJ4a+IOQBsW7kPAkOebjaLcvPfSt5IWwnhBTHiyDP3dcAiRSHIzjbn6utmOQRKtiB7+JBgfq6QuXYMCG+SM8JB3UR5bqrkbJlc7LJ9rp7HOCexkhYnRHgKI+JOHD4mJvWWp5eyzgwbgtuVGChs4vr6hRsAmHeIRIcIzJ54tk8N0qJvifUZ+B9QxT65+MO75tGPxej92zwvKRx6zDQ8WjasDGEd5Uyc3h+bbAyvcn8WcgXwwuZwfVgzq8gyRGoB+k2Dnmy5dnsWK0+LgR+TrAIe4B+IRMnqMWIufa7sOg4Rx8yQx8EByAeIRiCXq18vbLxEfiT0tQfiyX5TmTww5LTl5v4VesT2/LsvN8LUijR3LB92OOeMqTQ/VjYZ7Q+U9XhZw4+rF2dERgdfMavRtwx7eLlxg0jjbBPDAE+0ZN3lwwGFce3HpaTiR5iP6cGK0gee7DpDnieO/hl3IX+C8LAGzzTb65m3mf8A7hLbkEuqzomr4lS4w57+Aer/ALZP5fNtd/A1wGtgd3OQDIZ+5dUv1BO5J2X1kXDpMXiFvbvmybDK+XMg0Wjwgd83xZFieAX+cuAv5xYL/YSpiMoXJbNXzX9X7X9XkUFHjYhLry5G7HYx/BE+C5s7fuH4c/Nr+e2P5mS1vUHBkcV/E9CGjcOltefqZNX0stD+rCTWxEzCd/VtTtmrw3zl2/8AG/7yD0O/ubuO3Pn4gO8bHL5t6Fz1YA/0hX/DOYH2QgAnekcZ58QIi0by9+R8wHuxnhMOp/cnsJHpKFyY7lo9Nk/V2zm8/wAhp0sfqxkbPTpZGNwvJnlitXv4iAHZtoZYw/xcuDOC04RKW3tmvYgjPu6cUvY/NgE2OXxdXINeTdWt7YOzO6Nlf6N+5C9s+rJ7j8RH4wm5NRkzvI98kuclEIzqdkW3I0Qts8S6gsSsLHXVmuyD7S0bbp38DZhU5Aah2FoHIb6Srz8AUDv9QnC/onxglKePJMD5wC182hyUy1QuMjOiTYFuNAOxpHS3xvmb3MAb0RBPiRLWSS9BONzbQh/V4bP0FjeZ9w05uSerEe8g+c7KdJQMtA0LA7fJunmMeYLpAjDOnqehhE5spE/LjGYXiGDwx7V6W+Ry/RfSehnPxG9ZNfEp1P7lvULMy9bLeebTPtieb2G5cvPIOHbMue9vVQF4Xb7X0t7Nh1OzG28sY0LfxJtpP6jyHudOwNCKaY8+7kgGF7fKk+mBceIbcZ0XZD2z5QgmcwHZfzc4G6bZLMNyP+pw1lz3t+64k4/UrdE7LoZKf/MnEn8tnhqINiAxz+ZHvsFCM1uFkNjHWMekA0ccXpH9wh5P7kH/ALQjw/uTAZx1hbPE+4GL6vqnjsMHgWeWQ/K0VSVaXx1p5iD2P5hiHch//Uk85/cfe3uf9tT/AJLuloPC7iexHTkLwq7lZA6diPmwGSCF+28LbRKLC4Az9IDakZ8lqmfbI97siAbAeZi6gHlmjhEukY6N6btnI4Yr4t+9v0Qn9wzPBti0Ykejv4kkcvLdnUhAnpeYd+4Z7uwPM6dk95IuheCZ1zWfcbzxtyN6+oz/ANYfCBMHj/PwBv8A0koPxaR7qciPBluVOfhDpJB5TgZtkheZFOiYDOsmBG+M2ccgfMlfV9UHwQY8RPFlBC02dEJHyQ+LvzGUwcjhEFLv6/GMstPFqV/aT5NgPSEDIUxBveS15/FHxYcvgLnLkbGT3+NwlAkFhekvHPix+Pd4Xjef6vJeJeH/AOHDyxeP4e7wfmPF4/z+D+HneK9Pv8r/2Q==", 
      password: formulario.password,
    }

    console.log(this.usuario)

    this.proveedor.InsertarUsuario(this.usuario).then(data => {
      console.log(data);
      if(this.proveedor.status){
        this.navCtrl.navigateRoot('login');
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
