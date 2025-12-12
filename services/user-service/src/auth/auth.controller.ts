import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() body) {
        return this.authService.signup(body);
    }

    @Post('login')
    login(@Body() body) {
        return this.authService.login(body);
    }

    @Post('logout') 
    logout() {
        return { message: 'Logged out successfully' };
    }

}
