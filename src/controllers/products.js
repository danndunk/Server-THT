const { tb_products } = require("../../models");

exports.addProduct = async (req, res) => {
  try {
    const { namaBarang, hargaBeli, hargaJual, stok } = req.body;

    const newProduct = await tb_products.create({
      image: req.file.filename,
      namaBarang,
      hargaBeli,
      hargaJual,
      stok,
    });

    let previewProduct = await tb_products.findOne({
      where: {
        id: newProduct.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    previewProduct = JSON.parse(JSON.stringify(previewProduct));

    previewProduct = {
      ...previewProduct,
      image: process.env.PATH_FILE + previewProduct.image,
    };
    res.status(200).send({
      status: "success",
      product: previewProduct,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let product = await tb_products.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    product = JSON.parse(JSON.stringify(product));

    product = {
      ...product,
      image: process.env.PATH_FILE + product.image,
    };

    res.status(200).send({
      status: "success",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...data } = req.body;

    const newData = {
      ...data,
      image: req.file.filename,
    };

    await tb_products.update(newData, {
      where: {
        id,
      },
    });

    res.status(200).send({
      status: "success",
      message: `update product ${id} finished`,
      product: newData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    let products = await tb_products.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    products = JSON.parse(JSON.stringify(products));

    const newProducts = products.map((item) => {
      return {
        ...item,
        image: process.env.PATH_FILE + item.image,
      };
    });

    res.status(200).send({
      status: "success",
      products: newProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await tb_products.destroy({
      where: {
        id,
      },
    });

    res.status(200).send({
      status: "status",
      message: `Product ${id} successfully deleted`,
    });
  } catch (error) {}
};
