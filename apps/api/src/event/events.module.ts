import { forwardRef, Module } from '@nestjs/common';

import { EventListener } from '@/event/listener/event.listener';
import { MailService } from '@/mail/service/mail.service';
import { RedisService } from '@/redis/service/redis.service';
import { UsersModule } from '@/user/user.module';

@Module({
  imports: [
    forwardRef(() => UsersModule)
  ],
  providers: [EventListener, MailService, RedisService],
  exports: [EventListener],
})
export class EventModule { }
