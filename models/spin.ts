'use strict';
import {
  Model
}  from 'sequelize';
interface UserOtpAttributes{

  totalSpin:number;
  waitTime: number;
  coin: number;
  nextPlaytime:number;
 
}
module.exports = (sequelize:any, DataTypes:any) => {
  class  Spin extends Model<UserOtpAttributes>
  implements UserOtpAttributes {

    totalSpin!:number;
  waitTime!: number;
  coin!: number;
  nextPlaytime!:number;
    
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Spin.init({
   
   
    totalSpin: {type:DataTypes.INTEGER},
    waitTime: {type:DataTypes.INTEGER},
    coin: {type:DataTypes.INTEGER},
    nextPlaytime:{type:DataTypes.INTEGER}
 
  }, {
    sequelize,
    modelName: 'Spins',
  });
  return  Spin;
};
