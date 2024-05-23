
import {Length, IsEmail, Min,
    Max,} from 'class-validator';
export default class CreateRegistrationPost {
  
    @IsEmail()  
    email: string = '';
    

    @Length(6, 12)
    password:string='';

    @Length(6)
    referredBy:string='';

    @Length(2)
    location:string='';
  }

 