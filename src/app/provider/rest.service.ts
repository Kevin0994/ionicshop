import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class RestProvider {

  public img:any;
  public error:any;
  public status:any=false;

  constructor(public http: HttpClient,) { 

  }

  BuscarUsuario(cliente:any){
    var api_url="http://127.0.0.1:8000/usuarios/?search="+cliente;
    return new Promise(resolve => {
      this.http.get(api_url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  BuscarPost(post:any){
    var api_url="http://127.0.0.1:8000/posts/?search="+post;
    return new Promise(resolve => {
      this.http.get(api_url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  InsertarUsuario(form:any){
    var api_url="http://127.0.0.1:8000/usuarios/"
    return new Promise(resolve => {
      this.http.post(api_url,form).subscribe(data => {
        resolve(data);
        return this.status=true;
      }, err => {
        this.status=false;
        resolve(err);
        if(err.status == 400){
          return this.error=400
        }else{
          return this.error=0
        }
      }).closed;
    });
  }

  ActualizarUsuario(form:any){
    var api_url="http://127.0.0.1:8000/usuarios/"+localStorage.getItem('Usuario')+"/"
    return new Promise(resolve => {
      this.http.put(api_url,form).subscribe(data => {
        resolve(data);
        return this.status=true;
      }, err => {
        this.status=false;
        resolve(err);
        if(err.status == 400){
          return this.error=400
        }else{
          return this.error=0
        }
      }).closed;
    });
  }

  InsertarPost(form:any){
    var api_url="http://127.0.0.1:8000/posts/"
    return new Promise(resolve => {
      this.http.post(api_url,form).subscribe(data => {
        resolve(data);
        return this.status=true;
      }, err => {
        this.status=false;
        resolve(err);
        if(err.status == 400){
          return this.error=400
        }else{
          return this.error=0
        }
      }).closed;
    });
  }

  InsertarComen(form:any){
    var api_url="http://127.0.0.1:8000/comentarios/"
    return new Promise(resolve => {
      this.http.post(api_url,form).subscribe(data => {
        resolve(data);
        return this.status=true;
      }, err => {
        this.status=false;
        resolve(err);
        if(err.status == 400){
          return this.error=400
        }else{
          return this.error=0
        }
      }).closed;
    });
  }

  EliminarPost(form:any):Observable<any>{
    var api_url="http://127.0.0.1:8000/posts/"+form+"/";
    var Options = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      }),
      body: form,
    }
    return this.http.delete<any>(api_url,Options)
  }

  EliminarComent(form:any):Observable<any>{
    var api_url="http://127.0.0.1:8000/comentarios/"+form+"/";
    var Options = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      }),
      body: form,
    }
    return this.http.delete<any>(api_url,Options)
  }

  loadPost(){
    var api_url="http://127.0.0.1:8000/vista_posts/";
    return new Promise(resolve => {
      this.http.get(api_url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  loadComentarios(id:any){
    var api_url="http://127.0.0.1:8000/vista_comen/?search="+id;
    return new Promise(resolve => {
      this.http.get(api_url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  FiltrarComentarios(id:any){
    var api_url="http://127.0.0.1:8000/comentarios/?search="+id;
    return new Promise(resolve => {
      this.http.get(api_url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

}
