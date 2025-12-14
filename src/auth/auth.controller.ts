import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { WechatLoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('wechat-login')
  @Public()
  async wechatLogin(@Body() loginDto: WechatLoginDto) {
    return this.authService.wechatLogin(loginDto);
  }

  @Post('refresh')
  @Public()
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const user = await this.authService.validateUser(req.user.userid);

    return {
      id: user.id,
      openid: user.openid,
      nickname: user.nickname,
      phone: user.phone,
      gender: user.gender,
    };
  }
}
