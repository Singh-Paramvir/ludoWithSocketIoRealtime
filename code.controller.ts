import { hash, hashSync } from 'bcryptjs';
import { Request, Response } from 'express';
let referralCodeGenerator = require('referral-code-generator');
var otpGenerator = require('otp-generator');

import { v4 as uuidv4 } from "uuid";

import bcryptjs = require("bcryptjs");
bcryptjs.genSalt(10, function (err, salt) {
    bcryptjs.hash("B4c0/\/", salt, function (err, hash) {
        // Store hash in your password DB.
    });
});

// var bcryptjs= require('bcryptjs');

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
import { DATE } from 'sequelize/types';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { combineTableNames } from 'sequelize/types/lib/utils';
const otp = require('otp-generator')



class CodeController {

    ///Section User Start

    async addNewUser(payload: any, res: Response) {
        const { name, email, phone, createProfileFor, dateOfBirth, gender, password, wishlist } = payload;
        console.log(payload, "pa")

        //Check If Email Exists
        var checkEmail = await db.Users.findOne({
            where: {
                email
            }
        })

        if (checkEmail) {
            commonController.errorMessage2("Email Already Exists", res)
        } else {
            var hash = await Encrypt.cryptPassword(password.toString());

            var result = await db.Users.create({
                name, email, phone, createProfileFor, dateOfBirth, password: hash, gender, wishlist, isHide: 1, nameHide: 1, phoneHide: 1, emailHide: 1, dobHide: 1

            })
            var getdate = await db.Users.findOne({
                where: {
                    email
                }
            })
            if (getdate) {
                // var sun1 = new Date()
                let yourDate = new Date()
                let today = yourDate.getFullYear()
                let today1 = yourDate.getMonth()
                let today11 = yourDate.getDate()
                var sun = today + today1 + today11
                var date = "" + today + "-" + today1 + "-" + today11

                var sun11 = getdate.dateOfBirth

                var moon = (sun11.toISOString())

                var sql = ` SELECT DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(),'${moon}')), '%Y') + 0 AS age;`


                var result1 = await MyQuery.query(sql, { type: QueryTypes.SELECT });
                let sunnn = result1[0].age
                var sss = await db.UserDetails.findOne({
                    where: {
                        userId: getdate.id
                    }
                })
                if (sss) {
                    await sss.update({ age: sunnn })
                    const token = jwt.sign({
                        id: result.id,
                        email,
                        admin: false,


                    }, process.env.TOKEN_SECRET);
                    var welcomeMessage = `<Section class="otp" style="float: left; width: 100%;display: flex; justify-content: center; padding: 100px 0px;">
        
        
                    <div class="main-otp" style="    float: left;
                    width: auto;
                    height: auto;
                    border: 1px solid #afafaf;">
            <div class="top-image" style="text-align: center;    margin-top: 17px;">
                <img src="https://i.ibb.co/R3390Sd/welcome.jpg" alt="welcome" border="0">
            </div>
            
            
                        <div class="padding-min" style="padding: 30px;">
                            <div class="head">
                                <h3 style="
                text-align: center;
                font-size: 26px;
                font-weight: 600; color: 
            #F88A15;
                ">Welcome to the Orthodox Matrimonial</h3>
                            </div>
            
                            <div class="inner" style="
                        margin-top: 40px;
                    ">
                                <p style="margin: 0;
                            font-size: 18px;
                            font-weight: 400;">Hello ${name}
            
                                </p>
                                <p style="font-size: 18px;
                            font-weight: 600;">
                                    Thank you for joing the Orthodox Matrimonial
                                </p>
                            </div>
            
            
                            <div class="bottom-part">
                                <p style="margin-top: 170px;
                            font-size: 18px;
                            font-weight: 400;">Have questions about Orthodox Matrimonial ? We'd love to help! Just hit reply.</p>
            
            
                                <p style="margin: 0;
                            font-size: 18px;
                            font-weight: 400;">Our Best,</p>
            
                                <p style="margin: 0;
                            font-size: 18px;
                            font-weight: 400;">Orthodox Matrimonial Team</p>
                            </div>
                        </div>
            
                        <div class="footer"
                            style="text-align: center; background-color: black; padding: 30px;">
                            <img src="https://i.ibb.co/dj2Lkg4/Group-101.png">
                        </div>
            
            
                    </div>
            
            
                </Section>`
                    commonController.sendEmail(email, "Welcome to Orthodox Matrimony", welcomeMessage);
                    commonController.successMessage(token, "", res)

                } else {

                    var star = await db.UserDetails.create({
                        userId: result.id,
                        age: sunnn
                    })
                    const token = jwt.sign({
                        id: result.id,
                        email,
                        admin: false,


                    }, process.env.TOKEN_SECRET);
                    var welcomeMessage = `<Section class="otp" style="float: left; width: 100%;display: flex; justify-content: center; padding: 100px 0px;">
        
        
                    <div class="main-otp" style="    float: left;
                    width: auto;
                    height: auto;
                    border: 1px solid #afafaf;">
            <div class="top-image" style="text-align: center;    margin-top: 17px;">
                <img src="https://i.ibb.co/R3390Sd/welcome.jpg" alt="welcome" border="0">
            </div>
            
            
                        <div class="padding-min" style="padding: 30px;">
                            <div class="head">
                                <h3 style="
                text-align: center;
                font-size: 26px;
                font-weight: 600; color: 
            #F88A15;
                ">Welcome to the Orthodox Matrimonial</h3>
                            </div>
            
                            <div class="inner" style="
                        margin-top: 40px;
                    ">
                                <p style="margin: 0;
                            font-size: 18px;
                            font-weight: 400;">Hello ${name}
            
                                </p>
                                <p style="font-size: 18px;
                            font-weight: 600;">
                                    Thank you for joing the Orthodox Matrimonial
                                </p>
                            </div>
            
            
                            <div class="bottom-part">
                                <p style="margin-top: 170px;
                            font-size: 18px;
                            font-weight: 400;">Have questions about Orthodox Matrimonial ? We'd love to help! Just hit reply.</p>
            
            
                                <p style="margin: 0;
                            font-size: 18px;
                            font-weight: 400;">Our Best,</p>
            
                                <p style="margin: 0;
                            font-size: 18px;
                            font-weight: 400;">Orthodox Matrimonial Team</p>
                            </div>
                        </div>
            
                        <div class="footer"
                            style="text-align: center; background-color: black; padding: 30px;">
                            <img src="https://i.ibb.co/dj2Lkg4/Group-101.png">
                        </div>
            
            
                    </div>
            
            
                </Section>`
                    commonController.sendEmail(email, "Welcome to Orthodox Matrimony", welcomeMessage);
                    commonController.successMessage(token, "", res)
                }



            }

        }
    }



    async adminLogin(payload: any, res: Response) {
        const { email, password } = payload;

        //Check If Email Exists
        var checkdata = await db.admin.findOne({
            where: {
                email

            }
        })

        if (checkdata) {
            if (await Encrypt.comparePassword(password.toString(), checkdata.password.toString())) {

                const token = jwt.sign({
                    id: checkdata.id,
                    email,
                    admin: true,


                }, process.env.TOKEN_SECRET);

                commonController.successMessage(token, "Admin login", res)
            } else {
                commonController.errorMessage("INvalid Password", res)
            }
        }
        else {
            commonController.errorMessage1("Email Not Found", res)
            console.log("no");


        }
    }
    async userLogin(payload: any, res: Response) {
        const { email, password } = payload;

        //Check If Email Exists
        var checkdata = await db.Users.findOne({
            where: {
                email

            }
        })

        if (checkdata) {
            if (await Encrypt.comparePassword(password.toString(), checkdata.password.toString())) {

                const token = jwt.sign({
                    id: checkdata.id,
                    email,
                    admin: false,
                    profileFor: checkdata.profileFor,
                    emailVerfied: checkdata.isEmailVerfied,

                }, process.env.TOKEN_SECRET);

                commonController.successMessage(token, "User login", res)
            } else {
                commonController.errorMessage("INvalid Password", res)
            }
        }
        else {
            commonController.errorMessage1("Email Not Found", res)
            console.log("no");


        }
    }
    async forgotPasswordn(payload: any, res: Response) {
        try {
            const { email } = payload;
            console.log(payload, "sd")

            var data = await db.Users.findOne({
                where: {
                    email
                }
            })
            if (data) {

                console.log(data, "assd")
                var Otp = commonController.generateOtp()
                console.log(Otp, "oo")

                var moon = await db.UserOtps.findOne({
                    where: {
                        userId: data.id
                    }
                })
                if (moon) {
                    await moon.update({
                        otp: Otp,
                        active: true

                    })
                    var data1 = Otp.toString()
                    var welcomeMessage = ` <Section class="otp" style="float: left; width: 100%;display: flex; justify-content: center; padding: 100px 0px;">
        
       
                    <div class="main-otp" style="    float: left;
                   
                   
                    border: 1px solid #afafaf;">
            
            
            
            <div class="padding-min" style="padding: 30px;">
                        <div class="head">
                            <h3 style="
                text-align: center;
                font-size: 26px;
                ">You have requested to reset your password</h3>
                        </div>
            
                        <div class="inner" style="
                        margin-top: 60px;
                    ">
                            <p style="margin: 0;
                            font-size: 18px;
                            font-weight: 600;">Hello ${data.email},
            
                            </p>
                            <p style="font-size: 18px;
                            font-weight: 600;">
                                Please use the verification code below on the Orthodox Matrimonial Website:
                            </p>
                        </div>
                        <div class="otp-flex">
                            <div class="span-box" style="text-align: center;">
                                <span style="    border: 1px solid #ababab;
                            padding: 6px;
                            font-size: 18px;
                            font-weight: 700;
                            margin: 3px;">${data1[0]}</span><span style="    border: 1px solid #ababab;
                padding: 6px;
                font-size: 18px;
                font-weight: 700;
                margin: 3px;">${data1[1]}</span><span style="border: 1px solid #ababab;
                padding: 6px;
                font-size: 18px;
                font-weight: 700;
                margin: 3px;">${data1[2]}</span><span style="border: 1px solid #ababab;
                padding: 6px;
                font-size: 18px;
                font-weight: 700;
                margin: 3px;">${data1[3]}</span>
                            </div>
                            <p style="    text-align: center;
                            margin-top: 13px;
                            font-size: 18px;
                            font-weight: 600;">OTP</p>
                        </div>
            
                        <div class="bottom-part">
                            <p style="margin-top: 30px;
                            font-size: 18px;
                            font-weight: 600;">If you didn't request this, you can ignore this email or let us Know. </p>
            
            
                            <p style="margin: 0;
                            font-size: 18px;
                            font-weight: 600;">Thanks</p>
            
                            <p style="margin: 0;
                            font-size: 18px;
                            font-weight: 600;">Orthodox Matrimonial Team</p>
                        </div>
                    </div>
            
                        <div class="footer" style="text-align: center; margin-top: 50px; margin-bottom: 100px; background-color: black; padding: 30px;">
                            <img  src="https://i.ibb.co/dj2Lkg4/Group-101.png" alt="Group-101" border="0"> alt="">
                        </div>
            
            
                    </div>
            
            
                </Section>`
                    commonController.sendEmail(email, "Forgot Password OTP", welcomeMessage);
                    commonController.successMessage({}, "Email Verification Code On Email Successfully", res)
                } else {
                    var sun = await db.UserOtps.create({
                        userId: data.id,
                        otp: Otp,
                        active: true
                    })
                    var data1 = Otp.toString()
                    var welcomeMessage = ` <Section class="otp" style="float: left; width: 100%;display: flex; justify-content: center; padding: 100px 0px;">
        
       
                    <div class="main-otp" style="    float: left;
                   
                   
                    border: 1px solid #afafaf;">
            
            
            
            <div class="padding-min" style="padding: 30px;">
                        <div class="head">
                            <h3 style="
                text-align: center;
                font-size: 26px;
                ">You have requested to reset your password</h3>
                        </div>
            
                        <div class="inner" style="
                        margin-top: 60px;
                    ">
                            <p style="margin: 0;
                            font-size: 18px;
                            font-weight: 600;">Hello ${data.email},
            
                            </p>
                            <p style="font-size: 18px;
                            font-weight: 600;">
                                Please use the verification code below on the Orthodox Matrimonial Website:
                            </p>
                        </div>
                        <div class="otp-flex">
                            <div class="span-box" style="text-align: center;">
                                <span style="    border: 1px solid #ababab;
                            padding: 6px;
                            font-size: 18px;
                            font-weight: 700;
                            margin: 3px;">${data1[0]}</span><span style="    border: 1px solid #ababab;
                padding: 6px;
                font-size: 18px;
                font-weight: 700;
                margin: 3px;">${data1[1]}</span><span style="border: 1px solid #ababab;
                padding: 6px;
                font-size: 18px;
                font-weight: 700;
                margin: 3px;">${data1[2]}</span><span style="border: 1px solid #ababab;
                padding: 6px;
                font-size: 18px;
                font-weight: 700;
                margin: 3px;">${data1[3]}</span>
                            </div>
                            <p style="    text-align: center;
                            margin-top: 13px;
                            font-size: 18px;
                            font-weight: 600;">OTP</p>
                        </div>
            
                        <div class="bottom-part">
                            <p style="margin-top: 30px;
                            font-size: 18px;
                            font-weight: 600;">If you didn't request this, you can ignore this email or let us Know. </p>
            
            
                            <p style="margin: 0;
                            font-size: 18px;
                            font-weight: 600;">Thanks</p>
            
                            <p style="margin: 0;
                            font-size: 18px;
                            font-weight: 600;">Orthodox Matrimonial Team</p>
                        </div>
                    </div>
            
                        <div class="footer" style="text-align: center; margin-top: 50px; margin-bottom: 100px; background-color: black; padding: 30px;">
                            <img  src="https://i.ibb.co/dj2Lkg4/Group-101.png" alt="Group-101" border="0"> alt="">
                        </div>
            
            
                    </div>
            
            
                </Section>`
                    commonController.sendEmail(email, "Forgot Password OTP", welcomeMessage);
                    commonController.successMessage({}, "Email Verification Code On Email Successfully", res)
                }

            } else {
                commonController.errorMessage4("User Not Find", res)
            }
        } catch (e) {
            console.log(e)
        }
    }
    async verifyCode(payload: any, res: Response) {
        try {
            const { email, otp } = payload;

            var sun = await db.Users.findOne({
                where: {
                    email
                }
            })
            if (sun) {

                var checkOtp = await db.UserOtps.findOne({
                    where: {
                        userId: sun.id,
                        active: 1
                    }
                })

                if (checkOtp.otp == otp) {
                    await checkOtp.update({ active: false })
                    commonController.successMessage(checkOtp, "Otp Verify Successfully", res)
                } else {
                    commonController.errorMessage("Please Provide Another Otp", res)
                }

            } else {
                commonController.errorMessage("Can't Find User", res)
            }
        } catch (e) {
            console.log(e)
        }
    }
    async chagngePassword(payload: any, res: Response) {
        try {
            const { email, password } = payload;

            var check = await db.Users.findOne({
                where: {
                    email
                }
            })
            if (check) {
                var hash = await Encrypt.cryptPassword(password.toString());
                await check.update({ password: hash })
                const token = jwt.sign({
                    id: check.id,
                    email,
                    admin: false,


                }, process.env.TOKEN_SECRET);

                commonController.successMessage(token, "Password Change successfully", res)

            } else {
                commonController.errorMessage("Can't Find Users", res)
            }
        } catch (e) {
            console.log(e)
        }
    }
    async getCity(payload: any, res: Response) {
        try {
            var sql = `select * from Citys `;
            var result = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            commonController.successMessage(result, "citys find", res)
        } catch (e) {
            console.log(e)
        }
    }
    async getUserRefById(payload: any, res: Response) {
        try {
            const { id } = payload;
            var sql = `select * from UserRefs where userId=${id} `;
            var result = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            commonController.successMessage(result, "Refers  find", res)
        } catch (e) {
            console.log(e)
        }
    }
    async showHappyCouples(payload: any, res: Response) {
        try {
            const { id } = payload;
            var sql = `select * from HappyCouples where active = 0`;
            var result = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            commonController.successMessage(result, "Refers  find", res)
        } catch (e) {
            console.log(e)
        }
    }
    async getHideData(payload: any, res: Response) {
        try {
            const { id } = payload;
            var sql = `select a.nameHide,a.phoneHide,a.emailHide,a.dobHide,
            ifnull((select ifnull(ac.isHide,0) as profileHide from ProfilePhotos ac where ac.userId=${id} ),0) as profileHide from Users a where id=${id} `;
            var result = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            commonController.successMessage(result, "Data  find", res)
        } catch (e) {
            console.log(e)
        }
    }
    async sendRequest(payload: any, res: Response) {
        try {
            const { id, receiverId } = payload;
            console.log(payload, "pa")

            var check = await db.Requests.findOne({
                where: {
                    senderId: id,
                    receiverId
                }
            })
            console.log("yes")
            if (!check) {
                var data = await db.Requests.create({
                    senderId: id,
                    receiverId,
                    active: true, acceptStatus: true
                })

                commonController.successMessage(data, "Request Send Successfully", res)
            } else {
                commonController.errorMessage("Already Send Request", res)
            }


        } catch (e) {
            console.log(e)
        }
    }
    async getAllRequest(payload: any, res: Response) {
        try {
            const { userId } = payload;
            var sql = `select receiverId from Requests where senderId=${userId} and acceptStatus=1`;
            var result = await MyQuery.query(sql, { type: QueryTypes.SELECT });
            console.log(result, "aa")

            let arra: any = []
            result.map((item) => {
                console.log(item.receiverId)
                arra.push(item.receiverId)
            })
            let test = [...arra]
            console.log(test, "tes")
            var sql = `select ud.userId,ud.age,ud.city,ud.state,ud.country,ud.summary,
            (select b.avatar from ProfilePhotos b where b.userId=ud.userId limit 1) as ProfilePic,
            (select e.work from Educations e where e.userId=ud.userId limit 1) as work,
            (select e.profession from Educations e where e.userId=ud.userId limit 1) as profession,
            (select u.gender from Users u where u.id=ud.userId limit 1) as gender,
             (select u.name from Users u where u.id=ud.userId limit 1) as name
             from UserDetails ud where  ud.userId in (${test})`;
            var result1 = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            commonController.successMessage(result1, "Requests find", res)
        } catch (e) {
            console.log(e)
        }
    }
    async receiveRequest(payload: any, res: Response) {
        try {
            const { userId } = payload;

            var sql = `select r.id,r.senderId,r.receiverId,r.acceptStatus,ud.userId,ud.age,ud.gender,ud.city,ud.state,ud.country,ud.summary,
            ifnull((select ifnull(av.avatar,null) as avatar from ProfilePhotos av where av.userId=r.senderId and av.isHide=1 limit 1),null) as ProfilePic,
            (select e.work from Educations e where e.userId=r.senderId limit 1) as work,
            (select u.gender from Users u where u.id=ud.userId limit 1) as gender,
            (select u.name from Users u where u.id=ud.userId limit 1) as name,
                      (select e.profession from Educations e where e.userId=r.senderId limit 1) as profession
           from Requests r,UserDetails ud where acceptStatus =1 and r.receiverId=${userId} and ud.userId=r.senderId`;
            var result1 = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            commonController.successMessage(result1, "Requests find", res)
        } catch (e) {
            console.log(e)
        }
    }
    async acceptedRequest(payload: any, res: Response) {
        try {
            const { userId, id } = payload;
            console.log(payload, "pa")
            var check = await db.Requests.findOne({
                where: {
                    id
                }
            })

            if (check) {

                await check.update({ acceptStatus: false })
                var takeId = await db.Users.findOne({
                    where: {
                        id: check.senderId
                    }
                })
                var senderEmail = takeId.email

                var takeId1 = await db.Users.findOne({
                    where: {
                        id: check.receiverId
                    }
                })
                var receiverEmail = takeId1.email

                var welcomeMessage = ` <Section class="otp" style="float: left; width: 100%;display: flex; justify-content: center; padding: 100px 0px;">
        
       
                <div class="main-otp" style="    float: left;
               
               
                border: 1px solid #afafaf;">
        
        
        
        <div class="padding-min" style="padding: 30px;">
                    <div class="head">
                        <h3 style="
            text-align: center;
            font-size: 26px;
            "></h3>
                    </div>
        
                    <div class="inner" style="
                    margin-top: 60px;
                ">
                        <p style="margin: 0;
                        font-size: 18px;
                        font-weight: 600;">Hello ${takeId.name},
        
                        </p>
                        <p style="font-size: 18px;
                        font-weight: 600;">
                            Welcome to Orthodox Matrimonial
                        </p>
                    </div>
               
        
                    <div class="bottom-part">
                        <p style="margin-top: 30px;
                        font-size: 18px;
                        font-weight: 600;">${takeId.name}  and  ${takeId1.name}  Now You are  Connected Successfully.   </p>
        
        
                        <p style="margin: 0;
                        font-size: 18px;
                        font-weight: 600;">Thanks</p>
        
                        <p style="margin: 0;
                        font-size: 18px;
                        font-weight: 600;">Orthodox Matrimonial Team</p>
                    </div>
                </div>
        
                    <div class="footer" style="text-align: center; margin-top: 50px; margin-bottom: 100px; background-color: black; padding: 30px;">
                        <img  src="https://i.ibb.co/dj2Lkg4/Group-101.png" alt="Group-101" border="0"> alt="">
                    </div>
        
        
                </div>
        
        
            </Section>`
                commonController.sendEmail(senderEmail, "Welcome to Orthodox MatriMony", welcomeMessage);
                var welcomeMessage = ` <Section class="otp" style="float: left; width: 100%;display: flex; justify-content: center; padding: 100px 0px;">
        
       
                <div class="main-otp" style="    float: left;
               
               
                border: 1px solid #afafaf;">
        
        
        
        <div class="padding-min" style="padding: 30px;">
                    <div class="head">
                        <h3 style="
            text-align: center;
            font-size: 26px;
            "></h3>
                    </div>
        
                    <div class="inner" style="
                    margin-top: 60px;
                ">
                        <p style="margin: 0;
                        font-size: 18px;
                        font-weight: 600;">Hello ${takeId1.name},
        
                        </p>
                        <p style="font-size: 18px;
                        font-weight: 600;">
                            Welcome to Orthodox Matrimonial
                        </p>
                    </div>
               
        
                    <div class="bottom-part">
                        <p style="margin-top: 30px;
                        font-size: 18px;
                        font-weight: 600;"> ${takeId1.name}  and ${takeId.name}   Now You are  Connected Successfully.   </p>
        
        
                        <p style="margin: 0;
                        font-size: 18px;
                        font-weight: 600;">Thanks</p>
        
                        <p style="margin: 0;
                        font-size: 18px;
                        font-weight: 600;">Orthodox Matrimonial Team</p>
                    </div>
                </div>
        
                    <div class="footer" style="text-align: center; margin-top: 50px; margin-bottom: 100px; background-color: black; padding: 30px;">
                        <img  src="https://i.ibb.co/dj2Lkg4/Group-101.png" alt="Group-101" border="0"> alt="">
                    </div>
        
        
                </div>
        
        
            </Section>`
                commonController.sendEmail(receiverEmail, "Welcome to Orthodox MatriMony", welcomeMessage);
                commonController.successMessage(check, "Accepted Successfully", res)

            } else {
                commonController.errorMessage("Can't find data", res)
            }




        } catch (e) {
            console.log(e)
        }
    }
    async userAcceptedRequest(payload: any, res: Response) {
        try {
            const { userId } = payload;
            var sql = `select r.id,r.senderId,r.receiverId,r.acceptStatus,ud.userId,ud.age,ud.gender,ud.city,ud.state,ud.country,ud.summary,
            ifnull((select ifnull(av.avatar,null) as avatar from ProfilePhotos av where av.userId=r.receiverId and av.isHide=1 limit 1),null) as ProfilePic,
            (select e.work from Educations e where e.userId=r.receiverId limit 1) as work,
                      (select e.profession from Educations e where e.userId=r.receiverId limit 1) as profession,  (select u.gender from Users u where u.id=ud.userId limit 1) as gender,
                      (select u.name from Users u where u.id=ud.userId limit 1) as name
           from Requests r,UserDetails ud where acceptStatus =0 and r.senderId=${userId} and ud.userId=r.receiverId
           union
           select r.id,r.senderId,r.receiverId,r.acceptStatus,ud.userId,ud.age,ud.gender,ud.city,ud.state,ud.country,ud.summary,
            ifnull((select ifnull(av.avatar,null) as avatar from ProfilePhotos av where av.userId=r.senderId and av.isHide=1 limit 1),null) as ProfilePic,
            (select e.work from Educations e where e.userId=r.senderId limit 1) as work,
                      (select e.profession from Educations e where e.userId=r.senderId limit 1) as profession,  (select u.gender from Users u where u.id=ud.userId limit 1) as gender,
                      (select u.name from Users u where u.id=ud.userId limit 1) as name
           from Requests r,UserDetails ud where acceptStatus =0 and r.receiverId=${userId} and ud.userId=r.senderId`;
            var result = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            commonController.successMessage(result, "Requests find", res)
        } catch (e) {
            console.log(e)
        }
    }
    async sendDataRequest(payload: any, res: Response) {
        try {
            const { userId } = payload;
            var sql = `select r.id,r.senderId,r.receiverId,r.acceptStatus,ud.userId,ud.age,ud.gender,ud.city,ud.state,ud.country,ud.summary,
            ifnull((select ifnull(av.avatar,null) as avatar from ProfilePhotos av where av.userId=r.receiverId and av.isHide=1 limit 1),null) as ProfilePic,
            (select e.work from Educations e where e.userId=r.receiverId limit 1) as work,
                      (select e.profession from Educations e where e.userId=r.receiverId limit 1) as profession,
                      (select u.gender from Users u where u.id=ud.userId limit 1) as gender,
                      (select u.name from Users u where u.id=ud.userId limit 1) as name
           from Requests r,UserDetails ud where acceptStatus =1 and r.senderId=${userId} and ud.userId=r.receiverId `;
            var result = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            commonController.successMessage(result, "Requests find", res)
        } catch (e) {
            console.log(e)
        }
    }
    async checkConnection(payload: any, res: Response) {
        try {
            const { userId, id } = payload;
            var checkConnections = await db.Requests.findOne({
                where: {
                    senderId: userId,
                    receiverId: id
                }
            })
            if (checkConnections) {
                if (checkConnections.acceptStatus == 0) {
                    let connected = "connected"
                    commonController.successMessage(connected, "Already Friends", res)
                } else {
                    let connected = "Pending"
                    commonController.successMessage(connected, "Pending", res)
                }


            } else {
                let connected = "false"
                commonController.successMessage(connected, "", res)

            }

        } catch (e) {
            console.log(e)
        }
    }
    async declineRequest(payload: any, res: Response) {
        try {
            const { userId, id } = payload;

            var data = await db.Requests.findOne({
                where: {
                    id,
                    acceptStatus: true
                }
            })
            if (data) {

                var result = data.destroy({
                    where: {
                        id: id
                    }
                }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                    if (rowDeleted === 1) {
                        console.log('Deleted successfully');
                    }
                }, function (err) {
                    console.log(err);
                });
                var sun = false
                commonController.successMessage(sun, "data delete  sucessfully", res)
                console.log("data delete  sucessfully");


            } else {
                commonController.errorMessage("data not delete", res)
                console.log("not found");
            }



        } catch (e) {
            console.log(e)
        }
    }
    async getstate(payload: any, res: Response) {
        try {
            var sql = `select * from States `;
            var result = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            commonController.successMessage(result, "States find", res)
        } catch (e) {
            console.log(e)
        }
    }
    async getcountry(payload: any, res: Response) {
        try {
            var sql = `select * from Countrys `;
            var result = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            commonController.successMessage(result, "States find", res)
        } catch (e) {
            console.log(e)
        }
    }
    async getMotherTounge(payload: any, res: Response) {
        try {
            var sql = `select * from MotherTounges `;
            var result = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            commonController.successMessage(result, "MotherTounges find", res)
        } catch (e) {
            console.log(e)
        }
    }
    async getCollege(payload: any, res: Response) {
        try {
            var sql = `select * from Colleges `;
            var result = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            commonController.successMessage(result, "Colleges find", res)
        } catch (e) {
            console.log(e)
        }
    }
    async getDegree(payload: any, res: Response) {
        try {
            var sql = `select * from Qualifications `;
            var result = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            commonController.successMessage(result, "Qualifications find", res)
        } catch (e) {
            console.log(e)
        }
    }
    async getProfession(payload: any, res: Response) {
        try {
            var sql = `select * from Professions `;
            var result = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            commonController.successMessage(result, "Professions find", res)
        } catch (e) {
            console.log(e)
        }
    }
    async getMyProfile(payload: any, res: Response) {
        const { id } = payload;
        console.log(payload)
        try {
            var sql = `select a.id,a.name,a.gender,a.wishlist,
            ifnull((select ifnull(b.maritalStatus,null) as maritalStatus from UserDetails b where b.userId=a.id limit 1),null) as maritalStatus,
               ifnull((select ifnull(b.motherTongue,null) as motherTongue from UserDetails b where b.userId=a.id limit 1),null) as motherTongue,
            ifnull((select ifnull(b.motherTongue,null) as motherTongue from UserDetails b where b.userId=a.id limit 1),null) as UserDetails,
            ifnull((select ifnull(b.height,null) as height from UserDetails b where b.userId=a.id limit 1),null) as height,
            ifnull((select ifnull(b.summary,null) as summary from UserDetails b where b.userId=a.id limit 1),null) as summary,
            ifnull((select ifnull(b.zipCode,null) as zipCode from UserDetails b where b.userId=a.id limit 1),null) as zipCode,
            ifnull((select ifnull(b.weight,null) as weight from UserDetails b where b.userId=a.id limit 1),null) as weight,
            ifnull((select ifnull(b.city,null) as city from UserDetails b where b.userId=a.id limit 1),null) as city,
            ifnull((select ifnull(b.state,null) as state from UserDetails b where b.userId=a.id limit 1),null) as state,
            ifnull((select ifnull(b.country,null) as country from UserDetails b where b.userId=a.id limit 1),null) as country,
            ifnull((select ifnull(b.age,null) as age from UserDetails b where b.userId=a.id limit 1),null) as age,
            ifnull((select ifnull(av.avatar,null) as avatar from ProfilePhotos av where av.userId=a.id and av.isHide=1 limit 1),null) as avatar,
            ifnull((select ifnull(e.college,null) as college from Educations e where e.userId=a.id limit 1),null) as college,
            ifnull((select ifnull(e.degree,null) as degree from Educations e where e.userId=a.id limit 1),null) as degree,
            ifnull((select ifnull(e.work,null) as work from Educations e where e.userId=a.id limit 1),null) as work,
              ifnull((select ifnull(e.profession,null) as profession from Educations e where e.userId=a.id limit 1),null) as profession,
                ifnull((select ifnull(p.name,null) as parishName from Parishs p where p.userId=a.id limit 1),null) as parishName,
                     ifnull((select ifnull(p.city,null) as parishCity from Parishs p where p.userId=a.id limit 1),null) as parishCity,
                          ifnull((select ifnull(p.state,null) as parishState from Parishs p where p.userId=a.id limit 1),null) as parishState,
                               ifnull((select ifnull(p.country,null) as parishcountry from Parishs p where p.userId=a.id limit 1),null) as parishcountry,
			 ifnull((select ifnull(pa.gender,null) as parishGender from Partners pa where pa.userId=a.id limit 1),null) as parishGender,
           case when nameHide is null or nameHide=1 then name else null end as name,
             case when phoneHide is null or phoneHide=1 then phone else null end as phone,
             case when emailHide is null or emailHide=1 then email else null end as email,
             case when dobHide is null or dobHide=1 then dateOfBirth else null end as dateOfBirth
             from Users a where a.id=${id}`;
            var result = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            var getREf = await db.UserRefs.findAll({
                where: {
                    userId: id
                }
            })


            commonController.successMessage({ result, getREf }, "Profile find", res)
        } catch (e) {
            console.log(e)
        }
    }
    async filterData(payload: any, res: Response) {
        const { id, ageFrom, ageTo, gender } = payload;
        console.log(payload, "pay")
        try {
            var sql = `SELECT a.id,a.name,a.email,a.phone,a.dateOfBirth,a.wishlist,a.gender,b.college,b.degree,b.profession,b.work,aa.avatar,c.age,c.city,c.state,c.country,
            c.motherTongue,c.maritalStatus,c.height,c.weight FROM Users a,Educations b,avatars aa,UserDetails c WHERE a.id=b.userId AND a.id=aa.userId and
             a.id=c.userId and a.isHide=1;`;
            var moon = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            var aa: any = [];
            var sun = moon.map(item => {
                if (!(item.id == payload.id)) {

                    aa.push(item)
                    return item
                }

            })
            var len = gender.length
            //   console.log(len,"aa")
            if (len >= 1) {
                var bb: any = [];
                var star = aa.map(item => {
                    if (item.gender == payload.gender) {
                        console.log(item.gender, "ho")
                        bb.push(item)
                        return item
                    }
                })
                commonController.successMessage(bb, "", res)

            }


            // commonController.successMessage(aa, "data", res)


            // commonController.successMessage(moon, "Profile find", res)
        } catch (e) {
            console.log(e)
        }
    }
    async addUserEducation(payload: any, res: Response) {
        try {
            const { id, college, degree, profession, work } = payload;

            var uploadEdu = await db.Educations.findOne({
                where: {
                    userId: id
                }
            })
            if (uploadEdu) {
                await uploadEdu.update({
                    college, degree, profession, work
                })
                commonController.successMessage(uploadEdu, "Education Uploaded successfully", res)
            } else {
                var sun = await db.Educations.create({
                    userId: id,
                    college, degree, profession, work
                })
                commonController.successMessage(sun, "Education Created Successfully", res)
            }
        } catch (e) {
            console.log(e)
        }
    }
    async addParish(payload: any, res: Response) {
        try {
            const { id, name, city, state, country } = payload;
            var chck = await db.Parishs.findOne({
                where: {
                    userId: id
                }
            })
            if (chck) {
                await chck.update({
                    name, city, state, country
                })
                commonController.successMessage(sun, "Parish Updated Successfully", res)
            } else {
                var sun = await db.Parishs.create({
                    userId: id,
                    name, city, state, country
                })
                commonController.successMessage(sun, "Parish Created Successfully", res)
            }
        } catch (e) {
            console.log(e)
        }
    }
    async uploadProfile(payload: any, res: Response) {
        try {
            const { id, motherTongue, maritalStatus, height, weight, city, state, country, data, zipCode } = payload;
            var check = await db.UserDetails.findOne({
                where: {
                    userId: id
                }
            })

            if (check) {
                await check.update({
                    motherTongue, maritalStatus, height, weight, city, state, country, zipCode
                })

                var sun = await db.UserRefs.findOne({
                    where: {
                        userId: id
                    }
                })

                var sun = data.map(async item => {
                    console.log(item)
                    var check = await db.UserRefs.create({
                        userId: id,
                        name: item.name,
                        email: item.email,
                        phone: item.phone,
                        summary: item.summary,
                        fieldNo: item.fieldNo
                    })
                    commonController.successMessage(check, "", res)
                })

            } else {

                var sun = await db.UserDetails.create({
                    userId: id,
                    motherTongue, maritalStatus, height, weight, city, state, country, zipCode
                })
                var sun = await db.UserRefs.findOne({
                    where: {
                        userId: id
                    }
                })

                var sun = data.map(async item => {
                    console.log(item)
                    var check = await db.UserRefs.create({
                        userId: id,
                        name: item.name,
                        email: item.email,
                        phone: item.phone,
                        summary: item.summary,
                        fieldNo: item.fieldNo
                    })
                    commonController.successMessage(check, "", res)
                })


                commonController.successMessage(check, "User Detail create Successfully", res)

            }
        }
        catch (e) {
            console.log(e)
        }
    }
    async getUserPhotos(payload: any, res: Response) {
        try {
            const { id } = payload;
            var sql = `select a.userId,a.avatar,a.createdAt ,
            (select avatar from ProfilePhotos where userId=a.userId limit 1) as ProfilePic
            from avatars a where a.userId=${id} order by createdAt desc`;
            var moon = await MyQuery.query(sql, { type: QueryTypes.SELECT });



            commonController.successMessage(moon, "Data Get Successfully", res)

        } catch (e) {
            console.log(e)
        }
    }
    async addUserRef(payload: any, res: Response) {
        try {
            const { id, data } = payload;
            // let dataa = JSON.stringify(payload)
            console.log(payload.data, "req.body")

            var sun = await db.UserRefs.findOne({
                where: {
                    userId: id
                }
            })
            if (sun) {
                commonController.errorMessage("Please Update Refere By Id", res)
            } else {
                var sun = data.map(async item => {
                    console.log(item)
                    var check = await db.UserRefs.create({
                        userId: id,
                        name: item.name,
                        email: item.email,
                        phone: item.phone,
                        summary: item.summary,
                        fieldNo: item.fieldNo
                    })
                    commonController.successMessage(check, "", res)
                })
            }
        } catch (e) {
            console.log(e)
        }
    }
    async updateUserRef(payload: any, res: Response) {
        try {
            const { id, name, email, phone, summary, refId } = payload
            console.log(payload, "pa")

            var sun = await db.UserRefs.findOne({
                where: {
                    id: refId
                }
            })

            if (sun) {

                await sun.update({
                    name, email, phone, summary,
                })
                commonController.successMessage(sun, "Data UPdated successfully", res)
            } else {
                var moon = await db.UserRefs.create({
                    userId: id, name, email, phone, summary
                })
                commonController.successMessage(moon, "User Ref Created Successfully", res)
            }

        } catch (e) {
            console.log(e)
        }
    }
    async addProfilePic(payload: any, res: Response) {
        try {
            const { id, avatar } = payload;

            var createRef = await db.ProfilePhotos.findOne({
                where: {
                    userId: id
                }
            })
            if (createRef) {
                await createRef.update({ avatar })
                commonController.successMessage(createRef, "data Updated successfully", res)

            } else {
                var sun = await db.ProfilePhotos.create({
                    userId: id, avatar,
                    isHide: true
                })
                commonController.successMessage(sun, "Image Created successfully", res)
            }
            commonController.successMessage(createRef, "Reference Created Successfully", res)

        } catch (e) {
            console.log(e)
        }
    }
    async addCms(payload: any, res: Response) {
        try {
            const { id, pageName, description } = payload;
            console.log(payload, "pa")

            var createRef = await db.Cmss.create({
                userId: id, pageName, description
            })

            commonController.successMessage(createRef, "CMS Created Successfully", res)

        } catch (e) {
            console.log(e)
        }
    }
    async addToFav(payload: any, res: Response) {
        try {
            const { id, favouriteId, active } = payload;


            var fav = await db.Favourites.findOne({
                where: {
                    userId: id,
                    favouriteId
                }
            })
            if (!fav) {
                var sun = await db.Favourites.create({
                    userId: id,
                    favouriteId, active: true
                })
                commonController.successMessage(sun, "Fav Created Successfully", res)
            } else {
                await fav.update({
                    active
                })
                commonController.successMessage(fav, "Fav Updated Successfully", res)

            }



        } catch (e) {
            console.log(e)
        }
    }
    async addContactFil(payload: any, res: Response) {
        try {
            const { id, ageFrom, ageTo, heightFrom, heightTo, motherTongue, maritalStatus, country } = payload;


            var fav = await db.contactFillters.findOne({
                where: {
                    userId: id
                }
            })
            if (!fav) {
                var sun = await db.contactFillters.create({
                    userId: id, ageFrom, ageTo, heightFrom, heightTo, motherTongue, maritalStatus, country

                })
                commonController.successMessage(sun, "contactFilter Created Successfully", res)
            } else {
                await fav.update({
                    ageFrom, ageTo, heightFrom, heightTo, motherTongue, maritalStatus, country
                })
                commonController.successMessage(fav, "contactFilter Updated Successfully", res)

            }
        } catch (e) {
            console.log(e)
        }
    }
    async getContactFil(payload: any, res: Response) {
        try {
            const { id } = payload;
            var sql = `select * from contactFillters where userId=${id}`;
            var moon = await MyQuery.query(sql, { type: QueryTypes.SELECT });



            commonController.successMessage(moon, "Data Get Successfully", res)

        } catch (e) {
            console.log(e)
        }
    }
    async add(payload: any, res: Response) {
        try {
            const { id } = payload;

            var sql = `SELECT id,(DATEDIFF(CURRENT_DATE, STR_TO_DATE(dateOfBirth, '%Y-%m-%d'))/365) as age FROM Users`;
            var moon = await MyQuery.query(sql, { type: QueryTypes.SELECT });


        } catch (e) {
            console.log(e)
        }
    }
    async notification(payload: any, res: Response) {
        try {
            const { id } = payload;
            console.log(payload)

            var sql = `select receiverId from Requests where senderId=${id} and acceptStatus=0`;
            var moon = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            if(moon.length == 0){
                var sql = `select senderId from Requests where receiverId=${id} and acceptStatus=1`;
                var moon11 = await MyQuery.query(sql, { type: QueryTypes.SELECT });
                // console.log(moon1, "aa")
                if(moon11 == 0){
                    commonController.successMessage({},"",res)
                }else{
                    let arra2: any = []
                    moon11.map((item => {
                        console.log(item.senderId)
                        arra2.push(item.senderId)
                    }))
                    var sql = `select name,id,updatedAt,
                    (select avatar from ProfilePhotos where userId in (${arra2})  limit 1) as avatar
                    from Users where id in (${arra2})`;
                    var invitation1 = await MyQuery.query(sql, { type: QueryTypes.SELECT });
                    var Invitation = {invitation1}
        
                    commonController.successMessage(Invitation, "", res)
                }
            }else{

                let arra: any = []
                moon.map((item => {
                    console.log(item.receiverId)
                    arra.push(item.receiverId)
                }))
    
                arra.map((item =>{
                    console.log(item.receiverId)
                }))
                var sql = `select name,id,updatedAt,
                (select avatar from ProfilePhotos where userId in (${arra})  limit 1) as avatar
                from Users where id in (${arra})`;
                var acceptedRequest = await MyQuery.query(sql, { type: QueryTypes.SELECT });
                console.log(acceptedRequest,"moon1")
    
    
                var sql = `select senderId from Requests where receiverId=${id} and acceptStatus=1`;
                var moon11 = await MyQuery.query(sql, { type: QueryTypes.SELECT });
                console.log(moon11, "aa")
    
                if(moon11 == 0){
                    commonController.successMessage({acceptedRequest},"",res)
                }else{
                    let arra2: any = []
                    moon11.map((item => {
                        console.log(item.senderId)
                        arra2.push(item.senderId)
                    }))
                    var sql = `select name,id,updatedAt,
                    (select avatar from ProfilePhotos where userId in (${arra2})  limit 1) as avatar
                    from Users where id in (${arra2})`;
                    var invitation = await MyQuery.query(sql, { type: QueryTypes.SELECT });
        
                    commonController.successMessage({ acceptedRequest,invitation}, "", res)
                }
                
               
            }

         
        } catch (e) {
            console.log(e)
        }
    }
    async getAllFav(payload: any, res: Response) {
        try {
            const { id } = payload;
            var sql = `select f.userId,f.favouriteId,f.active,a.id,a.gender,a.wishlist,
            ifnull((select ifnull(b.maritalStatus,null) as maritalStatus from UserDetails b where b.userId=f.favouriteId limit 1),null) as maritalStatus,
              (select name as name from Users where id=a.id and nameHide = 1  limit 1) as name,
                          (select phone as phone from Users where id=a.id and phoneHide = 1  limit 1) as phone,
                            (select email as email from Users where id=a.id and emailHide = 1  limit 1) as email,
                              (select dateOfBirth as dateOfBirth from Users where id=a.id and dobHide = 1  limit 1) as dateOfBirth,
                                ifnull((select ifnull(b.motherTongue,null) as motherTongue from UserDetails b where b.userId=a.id limit 1),null) as motherTongue,
                       ifnull((select ifnull(b.height,null) as height from UserDetails b where b.userId=a.id limit 1),null) as height,
                       ifnull((select ifnull(b.weight,null) as weight from UserDetails b where b.userId=a.id limit 1),null) as weight,
                       ifnull((select ifnull(b.city,null) as city from UserDetails b where b.userId=a.id limit 1),null) as city,
                       ifnull((select ifnull(b.state,null) as state from UserDetails b where b.userId=a.id limit 1),null) as state,
                       ifnull((select ifnull(b.country,null) as country from UserDetails b where b.userId=a.id limit 1),null) as country,
                       ifnull((select ifnull(b.age,null) as age from UserDetails b where b.userId=a.id limit 1),null) as age,
                       ifnull((select ifnull(av.avatar,null) as avatar from ProfilePhotos av where av.userId=a.id and av.isHide=1 limit 1),null) as avatar,
                       ifnull((select ifnull(e.college,null) as college from Educations e where e.userId=a.id limit 1),null) as summary,
                       ifnull((select ifnull(e.degree,null) as degree from Educations e where e.userId=a.id limit 1),null) as degree,
                         ifnull((select ifnull(e.profession,null) as profession from Educations e where e.userId=a.id limit 1),null) as profession,
                                   ifnull((select ifnull(acceptStatus,null) as acceptStatus from Requests ee where ee.senderId=${id} and ee.receiverId=a.id and ee.acceptStatus=0 limit 1),null) as connectStatus,
     ifnull((select ifnull(acceptStatus,null) as acceptStatus1 from Requests ee where ee.receiverId=${id} and ee.senderId=a.id and ee.acceptStatus=0 limit 1),null) as connectStatus1,               
                   case when (select acceptStatus from Requests au where au.senderId=${id} and au.receiverId=a.id and acceptStatus=1 )>0 then "1" end as pendingStatus
            from Favourites f,Users a where userId=${id} and active=1 and a.id=f.favouriteId`;
            var moon = await MyQuery.query(sql, { type: QueryTypes.SELECT });



            commonController.successMessage(moon, "Data Get Successfully", res)

        } catch (e) {
            console.log(e)
        }
    }

    async addPartnerPref(payload: any, res: Response) {
        try {
            const { id, profession, ageFrom, ageTo, heightFrom, heightTo, motherTongue, maritalStatus, height, gender } = payload;

            var checkpp = await db.Partners.findOne({
                where: {
                    userId: id
                }
            })
            if (!checkpp) {

                var sun = await db.Partners.create({
                    userId: id, profession, ageFrom, ageTo, heightFrom, heightTo, motherTongue, maritalStatus, height, gender
                })
                commonController.successMessage(checkpp, "Data created Succssfully", res)
            } else {
                await checkpp.update({
                    profession, ageFrom, ageTo, heightFrom, heightTo, motherTongue, maritalStatus, height, gender
                })
                commonController.successMessage(checkpp, "Data Updated Succssfully", res)
            }



        } catch (e) {
            console.log(e)
        }
    }
    async getPartnerPref(payload: any, res: Response) {
        try {
            const { id } = payload;

            var sql = `SELECT * from Partners where userId=${id}`;
            var sun = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            commonController.successMessage(sun, "Data Get Successfully", res)
        } catch (e) {
            console.log(e)
        }
    }
    async updatePartnerPref(payload: any, res: Response) {
        try {
            const { id, profession, ageFrom, ageTo, heightFrom, heightTo, gender, name, city, state, country } = payload;

            var check = await db.Partners.findOne({
                where: {
                    userId: id
                }
            })
            if (check) {

                await check.update({
                    profession, ageFrom, ageTo, heightFrom, heightTo, gender
                })
                console.log("yes")

                var checkParish = await db.Parishs.findOne({
                    where: {
                        userId: id
                    }
                })
                console.log("yes1")

                if (checkParish) {

                    await checkParish.update({
                        name, city, state, country
                    })
                    commonController.successMessage(checkParish, "", res)
                } else {
                    var moon = await db.Parishs.create({
                        userId: id, name, city, state, country
                    })
                    commonController.successMessage(moon, "", res)
                }
            } else {
                var sun = await db.Partners.create({
                    userId: id, profession, ageFrom, ageTo, heightFrom, heightTo, gender
                })
                var checkParish = await db.Parishs.findOne({
                    where: {
                        userId: id
                    }
                })
                if (checkParish) {

                    await checkParish.update({
                        name, city, state, country
                    })
                    commonController.successMessage(checkParish, "", res)
                } else {
                    var moon = await db.Parishs.create({
                        userId: id, name, city, state, country
                    })
                    commonController.successMessage(moon, "", res)
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
    async getCms(payload: any, res: Response) {
        try {
            const { id } = payload;

            var sql = `SELECT * from Cmss where userId=${id}`;
            var sun = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            commonController.successMessage(sun, "Data Get Successfully", res)
        } catch (e) {
            console.log(e)
        }
    }
    async deleteCms(payload: any, res: Response) {
        try {
            const { id, userId } = payload;
            var moon = await db.Cmss.findOne({
                where: {
                    id,
                    userId
                }
            })
            if (moon) {
                console.log("ues")

                var result1 = moon.destroy({
                    where: {
                        id
                    }
                }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                    if (rowDeleted === 1) {
                        console.log('Deleted successfully');
                    }
                }, function (err) {
                    console.log(err);
                });

                commonController.successMessage(result1, "data delete  sucessfully", res)
                console.log("data delete  sucessfully");


            } else {
                return commonController.errorMessage("Invalid Attempt", res)
            }


        } catch (e) {
            console.log(e)
        }
    }
    async getAllUserRef(payload: any, res: Response) {
        try {
            const { id } = payload;
            var sql = `SELECT * from UserRefs where userId=${id}`;
            var moon = await MyQuery.query(sql, { type: QueryTypes.SELECT });

            commonController.successMessage(moon, "Data Get Successfully", res)

        } catch (e) {
            console.log(e)
        }
    }
    async hideData(payload: any, res: Response) {
        try {
            const { id, isHide, nameHide, phoneHide, emailHide, dobHide } = payload;
            console.log(payload, "pa")

            var data = await db.Users.findOne({
                where: {
                    id
                }
            })
            if (data) {
                await data.update({
                    nameHide, phoneHide, emailHide, dobHide
                })
                console.log(data, "yes")
                var sun = await db.ProfilePhotos.findOne({
                    where: {
                        userId: id
                    }
                })
                if (!sun) {
                    commonController.successMessage(data, "Please Upload Image First", res)
                } else {
                    console.log(sun, "l")
                    await sun.update({
                        isHide
                    })
                    commonController.successMessage(data, "Hide Process Done", res)
                }

            } else {
                commonController.errorMessage("can't find data", res)
            }


        } catch (e) {
            console.log(e)
        }
    }

    async lookingPartner(payload: any, res: Response) {
        try {
            const { id, profession, ageFrom, ageTo, heightFrom, heightTo, motherTongue, maritalStatus, height } = payload;

            var uploadEdu = await db.Partners.findOne({
                where: {
                    userId: id
                }
            })
            if (uploadEdu) {
                await uploadEdu.update({
                    profession, ageFrom, ageTo, heightFrom, heightTo, motherTongue, maritalStatus, height
                })
                commonController.successMessage(uploadEdu, "detail for looking partner is Uploaded successfully", res)
            } else {
                var sun = await db.Partners.create({
                    userId: id,
                    profession, ageFrom, ageTo, heightFrom, heightTo, motherTongue, maritalStatus, height
                })
                commonController.successMessage(sun, "detail for looking partner is Created Successfully", res)
            }
        } catch (e) {
            console.log(e)
        }
    }
    async getAllUser(payload: any, res: Response) {
        try {
            const { id } = payload;
            console.log(payload, "pa")
            var sql = `
            select a.id,a.gender,a.wishlist,
            ifnull((select ifnull(b.maritalStatus,null) as maritalStatus from UserDetails b where b.userId=a.id limit 1),null) as maritalStatus,
            ifnull((select active as active from Favourites f where f.userId=${id} and f.favouriteId = a.id  limit 1),0) as active ,
             (select name as name from Users where id=a.id and nameHide = 1  limit 1) as name,
               (select phone as phone from Users where id=a.id and phoneHide = 1  limit 1) as phone,
                 (select email as email from Users where id=a.id and emailHide = 1  limit 1) as email,
                   (select dateOfBirth as dateOfBirth from Users where id=a.id and dobHide = 1  limit 1) as dateOfBirth,
            ifnull((select ifnull(b.motherTongue,null) as motherTongue from UserDetails b where b.userId=a.id limit 1),null) as motherTongue,
            ifnull((select ifnull(b.height,null) as height from UserDetails b where b.userId=a.id limit 1),null) as height,
            ifnull((select ifnull(b.zipCode,null) as zipCode from UserDetails b where b.userId=a.id limit 1),null) as zipCode,
            ifnull((select ifnull(b.weight,null) as weight from UserDetails b where b.userId=a.id limit 1),null) as weight,
            ifnull((select ifnull(b.city,null) as city from UserDetails b where b.userId=a.id limit 1),null) as city,
            ifnull((select ifnull(b.state,null) as state from UserDetails b where b.userId=a.id limit 1),null) as state,
            ifnull((select ifnull(b.country,null) as country from UserDetails b where b.userId=a.id limit 1),null) as country,
            ifnull((select ifnull(b.age,null) as age from UserDetails b where b.userId=a.id limit 1),null) as age,
            ifnull((select ifnull(av.avatar,null) as avatar from ProfilePhotos av where av.userId=a.id and av.isHide=1 limit 1),null) as avatar,
            ifnull((select ifnull(e.college,null) as college from Educations e where e.userId=a.id limit 1),null) as summary,
            ifnull((select ifnull(e.degree,null) as degree from Educations e where e.userId=a.id limit 1),null) as degree,
              ifnull((select ifnull(e.profession,null) as profession from Educations e where e.userId=a.id limit 1),null) as profession,
                  ifnull((select ifnull(e.work,null) as work from Educations e where e.userId=a.id limit 1),null) as work,
              ifnull((select ifnull(name,null) as parishName from Parishs  where userId=a.id limit 1),null) as parishName,
              ifnull((select ifnull(city,null) as parishCity from Parishs where userId=a.id limit 1),null) as parishCity,
              ifnull((select ifnull(state,null) as parishState from Parishs e where e.userId=a.id limit 1),null) as parishState,
              ifnull((select ifnull(country,null) as parishCountry from Parishs e where e.userId=a.id limit 1),null) as parishCountry,
                ifnull((select ifnull(acceptStatus,null) as acceptStatus from Requests ee where ee.senderId=${id} and ee.receiverId=a.id and ee.acceptStatus=0 limit 1),null) as connectStatus,
     ifnull((select ifnull(acceptStatus,null) as acceptStatus1 from Requests ee where ee.receiverId=${id} and ee.senderId=a.id and ee.acceptStatus=0 limit 1),null) as connectStatus1,               
                   case when (select acceptStatus from Requests au where au.senderId=${id} and au.receiverId=a.id and acceptStatus=1 )>0 then "1" end as pendingStatus
          
             from Users a where a.isHide=1
    `;
            var moon = await MyQuery.query(sql, { type: QueryTypes.SELECT });


            var aa: any = [];
            var sun = moon.map(item => {
                if (!(item.id == payload.id)) {

                    aa.push(item)
                    return item
                }

            })




            commonController.successMessage(aa, "Users find", res)
        } catch (e) {
            console.log(e)
        }
    }
    async hideProfile(payload: any, res: Response) {
        try {
            const { id, days } = payload;
            console.log(payload, "pa")
            var startDate = new Date();
            var endDate = new Date();

            var check = await db.Users.findOne({
                where: {
                    id,
                    isHide: 1
                }
            })
            if (check) {


                var sun = await db.ProfileHides.findOne({
                    where: {
                        userId: id
                    }
                })
                if (sun) {
                    endDate.setDate(startDate.getDate() + days);
                    await check.update({ isHide: 0 })
                    await sun.update({
                        days,
                        startTime: startDate,
                        endTime: endDate,
                        status: 1
                    })

                    commonController.successMessage(sun, "Profile Hide Updaed Successfully", res)


                } else {

                    endDate.setDate(startDate.getDate() + days);

                    var moon = await db.ProfileHides.create({
                        userId: id,
                        days,
                        startTime: startDate,
                        endTime: endDate,
                        status: 1
                    })
                    await check.update({ isHide: 0 })
                    commonController.successMessage("hide", "", res)
                }

            } else {
                commonController.errorMessage("Can't Find Users", res)
            }

        } catch (e) {
            console.log(e)
        }
    }
    async unhideProfile(payload: any, res: Response) {
        try {
            const { id } = payload;
            console.log(id)

            var checkHide = await db.ProfileHides.findOne({
                where: {
                    userId: id
                }
            })

            var star = await db.Users.findOne({
                where: {
                    id,
                    isHide: 0
                }
            })

            if (star) {
                // console.log(checkHide)
                var sun = new Date()
                console.log(sun, "aa")

                if (sun > checkHide.endTime) {

                    await star.update({ isHide: 1 })
                    commonController.successMessage(star, "Unhide User Successfully", res)

                } else {
                    console.log("no")
                }

            } else {
                commonController.errorMessage("No User Hide Data Avalable", res)
            }



            // commonController.successMessage(aa, "Users find", res)
        } catch (e) {
            console.log(e)
        }
    }
    async deleteProfile(payload: any, res: Response) {
        try {
            const { id } = payload;
            console.log(payload, "pa")

            var result = await db.Users.findOne({
                where: {
                    id
                }
            })

            if (result) {
                await result.update({
                    isHide: 0
                })
                commonController.successMessage(result, "Data Deleted Successfully", res)

            } else {
                commonController.errorMessage("Can't Find User", res)
            }


            return commonController.successMessage(result, "", res)

        } catch (e) {
            console.log(e)
            return commonController.errorMessage(e, res);
        }
    }

    async updateAge(payload: any, res: Response) {
        try {
            const { id, days } = payload;
            var getdate = await db.Users.findOne({
                where: {
                    id
                }
            })
            if (getdate) {
                // var sun1 = new Date()
                let yourDate = new Date()
                let today = yourDate.getFullYear()
                let today1 = yourDate.getMonth()
                let today11 = yourDate.getDate()
                var sun = today + today1 + today11
                var date = "" + today + "-" + today1 + "-" + today11

                var sun11 = getdate.dateOfBirth

                var moon = (sun11.toISOString())

                var sql = ` SELECT DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(),'${moon}')), '%Y') + 0 AS age;`


                var result = await MyQuery.query(sql, { type: QueryTypes.SELECT });
                let sunnn = result[0].age
                var sss = await db.UserDetails.findOne({
                    where: {
                        userId: id
                    }
                })

                await sss.update({ age: sunnn })
                commonController.successMessage(result, "Get Age of User", res)


            } else {
                commonController.errorMessage("Can't find User", res)
            }

        } catch (e) {
            console.log(e)
        }
    }
    async updateProfile(payload: any, res: Response) {
        try {
            const { id, dateOfBirth, gender, maritalStatus, motherTongue, height, weight, city, state, country, summary, wishlist, userSummary,zipCode } = payload;
            console.log(payload, "pa")
            var getdate = await db.Users.findOne({
                where: {
                    id
                }
            })

            if (getdate) {

                await getdate.update({
                    dateOfBirth, gender, wishlist
                })

                var findDetail = await db.UserDetails.findOne({
                    where: {
                        userId: id
                    }
                })
                if (findDetail) {
                    await findDetail.update({

                        maritalStatus, motherTongue, height, weight, city, state, country, summary: userSummary,zipCode
                    })
                    commonController.successMessage(findDetail, "Data Updated Successfully", res)

                } else {
                    var sun = await db.UserDetails.create({
                        userId: id,
                        maritalStatus, motherTongue, height, weight, city, state, country, summary,
                    })
                    commonController.successMessage(sun, "Data Created Successfully", res)

                }

            } else {
                commonController.errorMessage("Can,t Find User", res)
            }


        } catch (e) {
            console.log(e)
        }
    }
    async updateParishDetail(payload: any, res: Response) {
        try {
            const { id, profession, gender, ageFrom, ageTo, heightFrom, heightTo, name, city, state, country } = payload;
            console.log(payload, "paa")
            var getdate = await db.Users.findOne({
                where: {
                    id
                }
            })

            if (getdate) {

                var start = await db.Partners.findOne({
                    where: {
                        userId: id
                    }
                })
                if (!start) {
                    var sun = await db.Partners.create({
                        userId: id, profession, gender, ageFrom, ageTo, heightFrom, heightTo
                    })
                    var check = await db.Parishs.findOne({
                        where: {
                            userId: id
                        }
                    })
                    if (check) {
                        await check.update({
                            name, city, state, country
                        })
                        commonController

                        commonController.successMessage(check, "", res)
                    } else {
                        var moon = await db.Parishs.create({
                            userId: id, name, city, state, country
                        })
                        commonController.successMessage(moon, "", res)
                    }
                } else {
                    await start.update({
                        profession, gender, ageFrom, ageTo, heightFrom, heightTo
                    })
                    var check = await db.Parishs.findOne({
                        where: {
                            userId: id
                        }
                    })
                    if (check) {
                        await check.update({
                            name, city, state, country
                        })
                        commonController

                        commonController.successMessage(check, "", res)
                    } else {
                        var moon = await db.Parishs.create({
                            userId: id, name, city, state, country
                        })
                        commonController.successMessage(moon, "", res)
                    }
                }



            } else {
                commonController.errorMessage("Can,t Find User", res)
            }


        } catch (e) {
            console.log(e)
        }
    }
    async updateEducation(payload: any, res: Response) {
        try {
            const { id, college, profession, degree, work } = payload;
            var getdate = await db.Users.findOne({
                where: {
                    id
                }
            })
            if (getdate) {

                var moon = await db.Educations.findOne({
                    where: {
                        userId: id
                    }
                })
                if (moon) {
                    await moon.update({
                        college, profession, degree, work
                    })
                    commonController.successMessage(moon, "Data Updated Successfully", res)

                } else {
                    var data = await db.Educations.create({
                        userId: id, college, profession, degree, work
                    })
                    commonController.successMessage(data, "Data Created Successfully", res)
                }

            } else {
                commonController.errorMessage("Can,t Find User", res)
            }




        } catch (e) {
            console.log(e)
        }
    }


}
export default new CodeController();
// export default new hello();
