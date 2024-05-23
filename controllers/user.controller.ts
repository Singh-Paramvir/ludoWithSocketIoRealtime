import { Request, Response } from 'express';
import codeController from './service/code.controller';
import commonController from './common/common.controller';
import { sign, verify } from 'crypto';
// import userController from "../controllers/user.controller";
class UserController {
    async register(req: Request, res: Response) {
        try {
            const {firstname,lastname,city,state,email,password } = req.body;
          

                await codeController.addNewUser({
                    firstname,lastname,city,state,email,password
                }, res)
            


        } catch (e) {
            console.log(e)
            commonController.errorMessage("user not register", res)
        }
    }
 


}


export default new UserController();