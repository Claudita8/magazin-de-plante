import { Routes } from '@angular/router';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { HomeComponent } from './components/home/home.component';
import { SigninComponent } from './components/auth/signin/signin/signin.component';
import { SignupComponent } from './components/auth/signup/signup/signup.component';
import {
  redirectLoggedInTo,
  redirectUnauthorizedTo,
  canActivate,
} from '@angular/fire/auth-guard';
import { AddProductsComponent } from './components/table-products/add-products/add-products.component';
import { EditProductsComponent } from './components/table-products/edit-products/edit-products.component';
import { editProductResolver } from './components/table-products/edit-products/edit-products.resolver';
import { ProfileComponent } from './components/profile/profile.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { MyFavoritesComponent } from './components/my-favorites/my-favorites.component';
import { ProductInfoComponent } from './components/product-info/product-info.component';
import { AdministratorGuard } from './guard/administrator.guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['signin']); //De adaugat la fiecare ruta noua
const redirectLoggedInToLanding = () => redirectLoggedInTo(['']);
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'administrator',
    component: AdministratorComponent,
    ...canActivate(redirectUnauthorizedToLogin),
    canActivate: [AdministratorGuard],
  },
  {
    path: 'signin',
    component: SigninComponent,
    ...canActivate(redirectLoggedInToLanding),
  },
  {
    path: 'signup',
    component: SignupComponent,
    ...canActivate(redirectLoggedInToLanding),
  },

  {
    path: 'add-product',
    component: AddProductsComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'edit-product/:id',
    component: EditProductsComponent,
    resolve: { product: editProductResolver },
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'profile',
    component: ProfileComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'my-favorites',
    component: MyFavoritesComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'product-info/:id',
    component: ProductInfoComponent,
    resolve: { product: editProductResolver },
    ...canActivate(redirectUnauthorizedToLogin),
  },
];
