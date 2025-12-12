import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    @ApiOperation({ 
        summary: 'Register a new user',
        description: 'Create a new user account with email, password and optional name'
    })
    @ApiBody({ type: SignUpDto })
    @ApiResponse({ 
        status: 201, 
        description: 'User successfully created',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'User created successfully' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                        email: { type: 'string', example: 'user@example.com' },
                        name: { type: 'string', example: 'John Doe' }
                    }
                }
            }
        }
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Bad request - Invalid input data',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Invalid email format' },
                statusCode: { type: 'number', example: 400 }
            }
        }
    })
    @ApiResponse({ 
        status: 409, 
        description: 'Conflict - User already exists',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'User with this email already exists' },
                statusCode: { type: 'number', example: 409 }
            }
        }
    })
    signup(@Body() body: SignUpDto) {
        return this.authService.signup(body);
    }

    @Post('login')
    @ApiOperation({ 
        summary: 'Authenticate user',
        description: 'Login with email and password to get access token'
    })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ 
        status: 200, 
        description: 'Login successful',
        schema: {
            type: 'object',
            properties: {
                access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                        email: { type: 'string', example: 'user@example.com' },
                        name: { type: 'string', example: 'John Doe' }
                    }
                }
            }
        }
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Unauthorized - Invalid credentials',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Invalid email or password' },
                statusCode: { type: 'number', example: 401 }
            }
        }
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Bad request - Missing required fields',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Email and password are required' },
                statusCode: { type: 'number', example: 400 }
            }
        }
    })
    login(@Body() body: LoginDto) {
        return this.authService.login(body);
    }

    @Post('logout')
    @ApiOperation({ 
        summary: 'Logout user',
        description: 'Logout the current user (invalidate session/token)'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Logout successful',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Logged out successfully' }
            }
        }
    })
    logout() {
        return { message: 'Logged out successfully' };
    }

}
