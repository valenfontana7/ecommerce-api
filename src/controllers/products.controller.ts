import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  // Res,
  // ParseIntPipe,
} from '@nestjs/common';

import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';

import { ParseIntPipe } from '../common/parse-int.pipe';

//import { Response } from 'express';

import { ProductsService } from './../services/products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  @Get()
  getProducts(
    @Query('limit') limit = 100,
    @Query('offset') offset = 0,
    @Query('brand') brand: string,
  ) {
    return this.productsService.findAll();
  }
  @Get('filter')
  getProductFilter() {
    return { message: `yo soy un filter` };
  }

  // @Get(':productId')
  // @HttpCode(HttpStatus.ACCEPTED)
  // getProduct(@Res() response: Response, @Param('productId') productId: string) {
  //   response.status(200).send({    ---> express
  //     message: `product ${productId}`,
  //   });
  // }

  @Get(':productId')
  @HttpCode(HttpStatus.ACCEPTED)
  getProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.productsService.findOne(productId);
  }

  @Post()
  create(@Body() payload: CreateProductDto) {
    return this.productsService.create(payload);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() payload: UpdateProductDto) {
    return this.productsService.update(+id, payload);
  }
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.productsService.remove(+id);
  }
}
