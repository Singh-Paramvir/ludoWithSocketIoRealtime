
import {Length, IsEmail, Min,
    Max,} from 'class-validator';
export default class CreateforgotPost {
  
    @IsEmail()  
    email: string = '';

  }

 