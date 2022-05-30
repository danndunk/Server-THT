'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tb_products.init({
    image: DataTypes.STRING,
    namaBarang: DataTypes.STRING,
    hargaBeli: DataTypes.INTEGER,
    hargaJual: DataTypes.INTEGER,
    stok: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tb_products',
  });
  return tb_products;
};