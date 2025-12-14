import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as axios from 'axios';

import { AppConfig } from 'src/config/configuration';
import { User } from 'src/database/entities/user.entity';

import { WechatLoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfig>,
  ) {}

  async wechatLogin(loginDto: WechatLoginDto) {
    const { code } = loginDto;

    const appId = process.env.WECHAT_APP_ID || 'your_app_id';
    const appSecret = process.env.WECHAT_APP_SECRET || 'your_app_secret';

    try {
      const response = await axios.get(
        'https://api.weixin.qq.com/sns/jscode2session',
        {
          params: {
            appid: appId,
            secret: appSecret,
            js_code: code,
            grant_type: 'authorization_code',
          },
        },
      );

      const { openid, unionid, session_key, errcode, errmsg } = response.data;

      if (errcode) {
        throw new BadRequestException(`WeChat Login Error: ${errmsg}`);
      }

      if (!openid) {
        throw new BadRequestException('Missing openid');
      }

      let user = await this.userRepository.findOne({ where: { openid } });

      if (!user) {
        user = this.userRepository.create({ openid, unionid });
        user = await this.userRepository.save(user);
      } else if (unionid && !user.unionid) {
        user.unionid = unionid;
        await this.userRepository.save(user);
      }

      const tokens = await this.generateTokens(user);

      return {
        ...tokens,
        user: {
          id: user.id,
          openid: user.openid,
          nickname: user.nickname,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException('WeChat Login Failed');
    }
  }

  private async generateTokens(user: User) {
    const payload = {
      userId: user.id,
      openid: user.openid,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return await this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
