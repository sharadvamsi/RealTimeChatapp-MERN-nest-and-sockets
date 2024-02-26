import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  message: {
    text: string;
  };
  users: any[]; // Change this to the appropriate type if needed
  sender: Schema.Types.ObjectId;
}

export const MessageSchema: Schema = new Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    users: [Schema.Types.Mixed], // Change this to the appropriate type if needed
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);



