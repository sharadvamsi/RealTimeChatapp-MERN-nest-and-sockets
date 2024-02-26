import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageSchema } from './message.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule .forFeature([{ name: 'message', schema: MessageSchema }]),],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
