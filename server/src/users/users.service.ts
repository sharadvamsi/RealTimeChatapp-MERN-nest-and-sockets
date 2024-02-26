import { Injectable } from '@nestjs/common';
import { User,UserSchema } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { Storage } from '@google-cloud/storage';
import { MulterFile } from 'multer';
import { Readable } from 'stream';



@Injectable()
export class UsersService {
    constructor(@InjectModel ('User') private readonly userModel: Model <User>) {}

    async register(username: string, email: string, password: string,profileImage?: MulterFile) {
        try {
            // Checking if user exists 
            const userExists = await this.userModel.findOne({ username });
            if (userExists) return { status: false, msg: "Username already exists" };
    
            // Checking if email exists
            const emailExists = await this.userModel.findOne({ email });
            if (emailExists) return { status: false, msg: "Email already exists" };
    
            const hashedPassword = await bcrypt.hash(password, 10);

            let imageUrl: string;
            if (profileImage) {
                imageUrl = await this.uploadProfileImage(profileImage, username);
            }

            const newUser = await this.userModel.create({
                username, email, password: hashedPassword,profileImage:imageUrl
            });
    
            // Create a new object excluding the password field
            const { password: omitPassword, ...userWithoutPassword } = newUser.toObject();
    
            return userWithoutPassword;
        } catch (error) {
            return error;
        }
    }
    

    async login(username: string, password: string) {
        try {
            // checking if user exists 
            const user = await this.userModel.findOne({ username });
            if (!user) return { status: false, msg: "Incorrect user name" };
    
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return { status: false, msg: "Incorrect password" };
    
            // Create a new object excluding the password field
            const { password: omitPassword, ...userWithoutPassword } = user.toObject();
    
            return userWithoutPassword;
        } catch (error) {
            return error;
        }
    }

    async getAllUsers(id:string){
        try {
            const users = await this.userModel.find({_id:{$ne:id}}).select([
                "email","username","profileImage","_id"
            ])
        
            return users;
        } catch (error) {
            return error
        }
    }

    private async uploadProfileImage(file: MulterFile, username: string): Promise<string> {
        const storage = new Storage();
        const bucketName = process.env.GCP_BUCKET_NAME; // Replace with your GCP bucket name
        const fileName = `${uuid()}_${file.originalname}`;
    
        // Convert buffer to a readable stream
        const fileStream = new Readable();
        fileStream.push(file.buffer);
        fileStream.push(null);
    
        const writeStream = storage.bucket(bucketName).file(fileName).createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });
    
        fileStream.pipe(writeStream);
    
        await new Promise((resolve, reject) => {
          writeStream
            .on('finish', resolve)
            .on('error', (error) => {
              reject(error);
            });
        });
    
        const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        return imageUrl;
      }
    
}
