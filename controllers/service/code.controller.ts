import { hash, hashSync } from 'bcryptjs';
import { Request, Response } from 'express';
let referralCodeGenerator = require('referral-code-generator');
var otpGenerator = require('otp-generator');
const QRCode = require('qrcode');
const multer = require('multer');

import { v4 as uuidv4 } from "uuid";

import bcryptjs = require("bcryptjs");
bcryptjs.genSalt(10, function (err, salt) {
    bcryptjs.hash("B4c0/\/", salt, function (err, hash) {
        // Store hash in your password DB.
    });
});

import db from "../../models"
const MyQuery = db.sequelize;
const { QueryTypes } = require('sequelize');
const { SECRET_KEY } = require('../../appconfig')
const jwt = require('jsonwebtoken')
import commonController from '../common/common.controller';
import { body, Result } from 'express-validator';
import { exists } from 'fs';
import { Encrypt } from '../common/encryptpassword';
import { error } from 'console';
import { TokenExpiredError } from 'jsonwebtoken';
class CodeController {

    ///Section User Start

    async addNewUser(payload: any, res: Response) {
        const { firstname,lastname,city,state,email,password} = payload;

        //Check If Email Exists
        var checkEmail = await db.Users.findOne({
            where: {
                email
            }
        })

        if (checkEmail) {
            commonController.errorMessage("Email Already Exists", res)
        } else {
            var hash = await Encrypt.cryptPassword(password.toString());
            // console.log("HASH PASSWIORD",hash)
            // return;
            var result = await db.Users.create({
                firstname,lastname,city,state,email,password:hash
            })
            //Generate Code
            var otp = commonController.generateOtp();
            console.log(otp);

            await db.UserOtps.create({
                userId: result.id,
                otpType: 1,
                otpValue: otp,
                active: true
            })

            // await commonController.sendEmail(emailId, 'Vefication Email', `Welcome Trice Pay <br/><br/>Dear ${fullName},<br/> Welcome to Trice Pay , <br/><br/> your verfication cod is ${otp}, <br/></br> Thanks, <br/><br/>Team Trice Pay`)

            // generate token

            const token = jwt.sign({
                email,
               
               

            }, process.env.TOKEN_SECRET);

            commonController.successMessage(token, "Code send on Email", res)
        }
    }
    
}
  
  

export default new CodeController();
// export default new hello();
