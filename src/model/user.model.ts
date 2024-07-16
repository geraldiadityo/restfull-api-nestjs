export class RegisterUserRequest {
  username: string;
  password: string;
  name: string;
  role: string;
}

export class UserResponse {
  username: string;
  name: string;
  role:  string;
  token?: string;
}

export class LoginUserRequest {
  username: string;
  password: string;
}

export class UpdateUserRequest {
  name?: string;
  password?: string;
}
