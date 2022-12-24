import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { SignUpDto } from './dto/sign-up.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentications')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseInterceptors(TransformInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @UseInterceptors(TransformInterceptor)
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @ApiBearerAuth('bearer-refresh')
  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(TransformInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshToken(@CurrentUserId() userId: string) {
    console.log('userId', userId);
    return this.authService.refreshToken(userId);
  }
}
