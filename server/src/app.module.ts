import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { MessageModule } from './message/message.module';
import { ChatGateway } from './chat.gateway';



@Module({
  imports: [
    
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI), 
    UsersModule, MessageModule, 
    
  ],
  controllers: [AppController,],
  providers: [AppService,ChatGateway], // Ensure MessagesModel is provided
})
export class AppModule {}
