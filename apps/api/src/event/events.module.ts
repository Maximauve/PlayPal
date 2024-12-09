import { Module } from '@nestjs/common';

import { EventListener } from '@/event/listener/event.listener';
import { MailService } from '@/mail/service/mail.service';
import { RedisService } from '@/redis/service/redis.service';

@Module({
  providers: [EventListener, MailService, RedisService],
  exports: [EventListener],
})
export class EventModule { }
