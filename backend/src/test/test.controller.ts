import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Test')
@Controller('test')
export class TestController {
    @Get('error')
    @ApiOperation({ summary: 'Test error handling (development only)' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    throwError() {
        throw new Error('This is a test error to verify logging and error handling');
    }
}
