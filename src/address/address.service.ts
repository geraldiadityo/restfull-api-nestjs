import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaServices } from '../common/prisma.service';
import { Logger } from 'winston';
import { ValidationService } from '../common/validation.service';
import { Address, User } from '@prisma/client';
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest,
} from 'src/model/address.model';
import { AddressValidation } from './address.validation';
import { ContactService } from '../contact/contact.service';

@Injectable()
export class AddressService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaServices,
    private validationService: ValidationService,
    private contactService: ContactService,
  ) {}

  async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    const createRequest: CreateAddressRequest = this.validationService.validate(
      AddressValidation.CREATE,
      request,
    );

    await this.contactService.contactMustBeExists(
      user.username,
      createRequest.contactId,
    );

    const address = await this.prismaService.address.create({
      data: createRequest,
    });

    return this.toAddressResponse(address);
  }

  toAddressResponse(address: Address): AddressResponse {
    return {
      id: address.id,
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      postal_code: address.postal_code,
    };
  }

  async checkAddressMustExists(
    contactId: number,
    address_id: number,
  ): Promise<Address> {
    const address = await this.prismaService.address.findFirst({
      where: {
        id: address_id,
        contactId: contactId,
      },
    });

    if (!address) {
      throw new HttpException('Address is not found!', 404);
    }

    return address;
  }

  async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    const getRequest = this.validationService.validate(
      AddressValidation.GET,
      request,
    );

    await this.contactService.contactMustBeExists(
      user.username,
      getRequest.contactId,
    );

    const address = await this.checkAddressMustExists(
      getRequest.contactId,
      getRequest.address_id,
    );

    return this.toAddressResponse(address);
  }

  async update(
    user: User,
    request: UpdateAddressRequest,
  ): Promise<AddressResponse> {
    const updateRequest = this.validationService.validate(
      AddressValidation.UPDATE,
      request,
    );

    await this.contactService.contactMustBeExists(
      user.username,
      updateRequest.contactId,
    );

    let address = await this.checkAddressMustExists(
      updateRequest.contactId,
      updateRequest.id,
    );

    address = await this.prismaService.address.update({
      where: {
        id: address.id,
        contactId: address.contactId,
      },
      data: updateRequest,
    });

    return this.toAddressResponse(address);
  }

  async remove(
    user: User,
    request: RemoveAddressRequest,
  ): Promise<AddressResponse> {
    const removeRequest = this.validationService.validate(
      AddressValidation.REMOVE,
      request,
    );

    await this.contactService.contactMustBeExists(
      user.username,
      removeRequest.contactId,
    );

    await this.checkAddressMustExists(
      removeRequest.contactId,
      removeRequest.address_id,
    );

    const address = await this.prismaService.address.delete({
      where: {
        id: removeRequest.address_id,
        contactId: removeRequest.contactId,
      },
    });

    return this.toAddressResponse(address);
  }

  async list(user: User, contactId: number): Promise<AddressResponse[]> {
    await this.contactService.contactMustBeExists(user.username, contactId);

    const addresses = await this.prismaService.address.findMany({
      where: {
        contactId: contactId,
      },
    });

    return addresses.map((address) => this.toAddressResponse(address));
  }
}
