import { verify } from 'crypto';
import express from 'express';

 import userController from "../controllers/user.controller";



const router=express.Router();
 router.post("/register",userController.register);


export default router;

