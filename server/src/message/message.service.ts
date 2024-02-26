import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMessage } from './message.schema';

@Injectable()
export class MessageService {
    constructor(@InjectModel('message') private readonly messageModel: Model<IMessage>){}

    async addMessage(from:string,to:string,message:string){
        try {
            const data = await this.messageModel.create({
                message:{text:message},
                users:{from,to},
                sender:from,
            });
            if(data) return {"msg":"Message added successfully."};
            return {"msg":"Failed to add message to database"}
        } catch (error) {
                return(error)
            
        }

    }

    
    async getAllMessages(user1: string, user2: string) {
        try {
            const messages = await this.messageModel.find({
                $or: [
                    { 
                        users: {
                            $elemMatch: {
                                from: user1,
                                to: user2
                            }
                        }
                    },
                    { 
                        users: {
                            $elemMatch: {
                                from: user2,
                                to: user1
                            }
                        }
                    }
                ]
            }).sort({ updatedAt: 1 });
    
            const projectMessages = messages.map((msg) => {
                return {
                    fromSelf: msg.sender.toString() === user1,
                    message: msg.message.text,
                };
            });
    
            return projectMessages;
        } catch (error) {
            return error;
        }
    }
    



}
