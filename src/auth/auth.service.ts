import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);

    if (!user || user.password !== password) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }
  // generate jwt token
  async generateToken(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: 'secret',
        expiresIn: '1h',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: 'secret-refresh',
        expiresIn: '1w',
      }),
    };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.validateUser(
      signInDto.username,
      signInDto.password,
    );
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    return this.generateToken(user);
  }

  async signUp(signUpDto: SignUpDto) {
    // find user by username
    const user = await this.usersService.findOneByUsername(signUpDto.username);
    if (user) {
      throw new BadRequestException('Username already exists');
    }
    const userEntity = await this.usersService.create(signUpDto);
    return this.generateToken(userEntity);
  }

  // refresh token
  async refreshToken(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return this.generateToken(user);
  }
}
