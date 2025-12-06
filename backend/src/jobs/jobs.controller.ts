import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@ApiTags('Jobs')
@ApiBearerAuth()
@Controller('api/v1/jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
    constructor(
        private readonly jobsService: JobsService,
        @InjectQueue('reminders') private remindersQueue: Queue,
    ) { }

    @Post('compute-trust')
    @ApiOperation({ summary: 'Compute trust scores for all contacts' })
    @ApiResponse({ status: 200, description: 'Trust scores computed successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    computeTrust(@Request() req: any) {
        return this.jobsService.computeTrust(req.user._id);
    }

    @Post('send-due-reminders')
    @ApiOperation({ summary: 'Enqueue job to send payment due reminders' })
    @ApiResponse({ status: 200, description: 'Reminder job enqueued', schema: { example: { message: 'Reminder job enqueued' } } })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async sendDueReminders(@Request() req: any) {
        await this.remindersQueue.add('send-due', { userId: req.user._id });
        return { message: 'Reminder job enqueued' };
    }

    @Post('notifications')
    @ApiOperation({ summary: 'List notifications for current user' })
    @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async listNotifications(@Request() req: any) {
        return this.jobsService.listNotifications(req.user._id);
    }
}
