'use strict';
import {
  Model
}  from 'sequelize';
interface UserAttributes{

email:string
coins:number;
dailyBonus:boolean;
totalSpin:number;
spinActive:boolean;
lastSpin:Date;
totalCapcha:number;
capchaActive:boolean;
lastCapcha:Date

}
module.exports = (sequelize:any, DataTypes:any) => {
  class  User extends Model<UserAttributes>
  implements UserAttributes {
    email!:string
    coins!:number;
    dailyBonus!:boolean;
    totalSpin!:number;
    spinActive!:boolean;
    lastSpin!:Date;
    totalCapcha!:number;
    capchaActive!:boolean;
    lastCapcha!:Date
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    email:{type:DataTypes.STRING},
    coins:{type:DataTypes.DOUBLE},
    dailyBonus:{type:DataTypes.BOOLEAN,defaultValue:false},
    totalSpin:{type:DataTypes.INTEGER},
    spinActive:{type:DataTypes.BOOLEAN, defaultValue: false },
    lastSpin:{ type : DataTypes.DATE} ,
    totalCapcha:{type:DataTypes.INTEGER},
    capchaActive:{type:DataTypes.BOOLEAN, defaultValue: false },
    lastCapcha:{ type : DataTypes.DATE}
 
  }, {
    sequelize,
    modelName: 'Users',
  });
  return  User;
};
