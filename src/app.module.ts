import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './controllers/products.controller';
import { CategoriesController } from './controllers/categories.controller';
import { CustomersController } from './controllers/customers.controller';
import { BrandsController } from './controllers/brands.controller';
import { UsersController } from './controllers/users.controller';
import { OrdersController } from './controllers/orders.controller';
import { ProductsService } from './services/products.service';
import { CategoriesService } from './services/categories.service';
import { CustomersService } from './services/customers.service';
import { BrandsService } from './services/brands.service';
import { UsersService } from './services/users.service';
import { OrdersService } from './services/orders.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    ProductsController,
    CategoriesController,
    CustomersController,
    BrandsController,
    UsersController,
    OrdersController,
  ],
  providers: [
    AppService,
    ProductsService,
    CategoriesService,
    CustomersService,
    BrandsService,
    UsersService,
    OrdersService,
  ],
})
export class AppModule {}
