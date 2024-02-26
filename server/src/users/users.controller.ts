import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { MulterFile } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('users')
export class UsersController {
    constructor(private readonly userService:UsersService){}

    @Post('register')
    @UseInterceptors (FileInterceptor ('profileImage'))
    async createUser(@Body() body:{username:string,email:string,password:string}, @UploadedFile () profileImage: MulterFile){
        const {username,email,password} = body;
        const response = await this.userService.register(username,email,password,profileImage);
        return response

    }

    @Post('login')
    async login(@Body() body:{username:string,password:string}){
        const {username,password} = body;
        const response = await this.userService.login(username,password);
        return response

    }


    @Get('/allusers/:id')
    async getAllUsers(@Param('id') id:string){
        const response = await this.userService.getAllUsers(id)
        return response
    }
}
