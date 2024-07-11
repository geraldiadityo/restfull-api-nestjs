export class AddressResponse {
  id: number;
  street?: string;
  city?: string;
  province?: string;
  country: string;
  postal_code: string;
}

export class CreateAddressRequest {
  contactId: number;
  street?: string;
  city?: string;
  province?: string;
  country: string;
  postal_code: string;
}

export class GetAddressRequest {
  contactId: number;
  address_id: number;
}

export class UpdateAddressRequest {
  id: number;
  contactId: number;
  street?: string;
  city?: string;
  province?: string;
  country: string;
  postal_code: string;
}

export class RemoveAddressRequest {
  contactId: number;
  address_id: number;
}
