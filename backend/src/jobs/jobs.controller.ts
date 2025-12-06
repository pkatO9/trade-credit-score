import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Controller('api/v1/jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
    constructor(
        private readonly jobsService: JobsService,
        @InjectQueue('reminders') private remindersQueue: Queue,
    ) { }

    @Post('compute-trust')
    computeTrust(@Request() req: any) {
        return this.jobsService.computeTrust(req.user._id);
    }

    @Post('send-due-reminders')
    async sendDueReminders(@Request() req: any) {
        await this.remindersQueue.add('send-due', { userId: req.user._id });
        return { message: 'Reminder job enqueued' };
    }

    @Post('notifications') // Using POST for convenience or GET is fine
    async listNotifications(@Request() req: any) {
        return this.jobsService.listNotifications(req.user._id);
    }
}
