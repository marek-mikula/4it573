import { Controller, Get } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor() {}

  @Get('/login')
  login(): string {
    return 'Login'
  }

  @Get('/register')
  register(): string {
    return 'Register'
  }
}
