import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { User } from '@prisma/client';
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest,
} from '../model/address.model';
import { WebResponse } from '../model/web.model';
import { Auth } from '../common/auth.decorator';

@Controller('/api/contacts/:contactId/address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() request: CreateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    request.contactId = contactId;
    const result = await this.addressService.create(user, request);

    return {
      data: result,
    };
  }

  @Get('/:address_id')
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('address_id', ParseIntPipe) address_id: number,
  ): Promise<WebResponse<AddressResponse>> {
    const request: GetAddressRequest = {
      address_id: address_id,
      contactId: contactId,
    };

    const result = await this.addressService.get(user, request);

    return {
      data: result,
    };
  }

  @Put('/:address_id')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('address_id', ParseIntPipe) address_id: number,
    @Body() request: UpdateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    request.contactId = contactId;
    request.id = address_id;
    const result = await this.addressService.update(user, request);

    return {
      data: result,
    };
  }

  @Delete('/:address_id')
  @HttpCode(200)
  async remove(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('address_id', ParseIntPipe) address_id: number,
  ): Promise<WebResponse<boolean>> {
    const request: RemoveAddressRequest = {
      address_id: address_id,
      contactId: contactId,
    };

    await this.addressService.remove(user, request);

    return {
      data: true,
    };
  }

  @Get()
  @HttpCode(200)
  async list(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<WebResponse<AddressResponse[]>> {
    const result = await this.addressService.list(user, contactId);

    return {
      data: result,
    };
  }
}
