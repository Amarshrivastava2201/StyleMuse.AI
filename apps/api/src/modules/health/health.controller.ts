import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'API status check' })
  check() {
    return {
      status: 'ok',
      service: 'StyleMuse API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
