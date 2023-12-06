import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {SignUpComponent} from "../sign-up/sign-up.component";
import {HomeComponent} from "../home/home.component";

const rotes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'signup', component: SignUpComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(rotes)],
  exports: [RouterModule]
})
export class AppRouterModule { }
