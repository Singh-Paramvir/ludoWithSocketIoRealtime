
import {Length, IsEmail, Min,
    Max,} from 'class-validator';
export default class CreateloginPost {
  
    @IsEmail()  
    email: string = '';

    @Length(6, 12)
    password:string='';

  }