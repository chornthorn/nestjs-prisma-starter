import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UtilityHelper } from '../common/utilities/utility.helper';
import { JwtService } from '@nestjs/jwt';
import { CreateTokenDto } from './dto/create-token.dto';
import { AuthTokenDto } from './dto/auth-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      throw new BadRequestException('Invalid username or password');
    }

    const isPasswordValid = await UtilityHelper.compareString(
      pass,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid username or password');
    }

    const { password, ...result } = user;
    return result;
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.validateUser(
      signInDto.username,
      signInDto.password,
    );
    if (!user) {
      throw new BadRequestException('Invalid username or password');
    }
    const { password, ...result } = user;

    const token = await this.generateToken({
      username: result.username,
      userId: result.id,
      role: result.role,
    });

    if (!token) {
      throw new BadRequestException('Token not generated');
    }

    return token;
  }

  async signUp(signUpDto: SignUpDto) {
    const passwordHash = UtilityHelper.hasString(signUpDto.password);

    if (!passwordHash) {
      throw new BadRequestException('Password not hashed');
    }

    const user = await this.usersService.create({
      username: signUpDto.username,
      password: await passwordHash,
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
    });
    if (!user) {
      return null;
    }
    return user;
  }

  // refresh token
  public async refreshToken(username: string): Promise<AuthTokenDto | null> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      throw new BadRequestException('Invalid refresh token');
    }

    return await this.generateToken({
      username: user.username,
      userId: user.id,
      role: user.role,
    });
  }

  public async generateToken(
    createToken: CreateTokenDto,
  ): Promise<AuthTokenDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          user: {
            ...createToken,
          },
        },
        {
          secret: 'access-token-secret',
          expiresIn: 60 * 60 * 24 * 7, //1 week
        },
      ),
      this.jwtService.signAsync(
        {
          user: {
            ...createToken,
          },
        },
        {
          secret: 'refresh-token-secret',
          expiresIn: 60 * 60 * 24 * 7, //  1 week
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
