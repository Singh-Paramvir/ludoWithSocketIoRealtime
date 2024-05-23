import { Request, Response } from 'express';
import bcrypt from 'bcrypt'

class CommonController {
  
   
    generateOtp(){
        return Math.floor(100000 + Math.random() * 900000);
    }
    cryptPassword ( password) {
       bcrypt.genSalt(10, function(err, salt) {
        if (err) 
          return err;
    
        bcrypt.hash(password, salt, function(err, hash) {
          return  hash;
        });
      });
    };
    
    comparePassword = function(plainPass, hashword) {
       bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {   
           return err == null ?
               isPasswordMatch:
               err;
       });
    };
    successMessage(data: any, msg: string, res: Response) {
        try{
        return res.status(200).send({
            message: msg,
            data
        });}catch(e){
            console.log(e);
        }
    }
    errorMessage(msg: string, res: Response) {
       try{
        return res.status(400).send({
            error: {
                message: msg
            }
        });}catch(e){
            console.log(e);
        }
    }
    
}
export default new CommonController();