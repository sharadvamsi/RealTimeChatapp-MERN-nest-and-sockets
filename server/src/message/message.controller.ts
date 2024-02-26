import { Body, Controller, Post } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService:MessageService){}


    @Post('addmsg')
    async addmsg(@Body() body:{from:string,to:string,message:string}){
        const {from,to,message} = body;
        const response = await this.messageService.addMessage(from,to,message);
        return response
    }

    @Post('getmsg')
    async getmsg(@Body() body:{from:string,to:string}){
        const {from,to} = body;
        const response =await  this.messageService.getAllMessages(from,to)
        return response
    }
}
