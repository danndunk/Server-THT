const { tb_users } = require("../../models");

const Joi = require("joi");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password, fullname } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(6).required(),
      fullname: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(200).send({
        status: "error",
        message: error.details[0].message,
      });
    }

    const userExist = await tb_users.findOne({
      where: {
        email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (userExist) {
      return res.status(200).send({
        status: "failed",
        message: "email has already taken",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await tb_users.create({
      fullname,
      email,
      password: hashedPassword,
    });

    res.status(200).send({
      status: "success",
      data: {
        user: {
          email: newUser.email,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(200).send({
        status: "error",
        message: error,
      });
    }

    const userExist = await tb_users.findOne({
      where: {
        email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!userExist) {
      return res.status(200).send({
        status: "failed",
        message: "email is not registered",
      });
    }

    const isValid = await bcrypt.compare(password, userExist.password);

    if (!isValid) {
      return res.status(200).send({
        status: "failed",
        message: "email or password doesnt match",
      });
    }

    const dataToken = {
      id: userExist.id,
      email: userExist.email,
    };

    const SECRET_KEY = process.env.TOKEN_KEY;

    const token = jwt.sign(dataToken, SECRET_KEY);

    res.status(200).send({
      status: "success",
      data: {
        email: userExist.email,
        fullname: userExist.fullname,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const { id } = req.user;

    const dataUser = await tb_users.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "failed",
      });
    }

    res.send({
      status: "success",
      data: {
        user: {
          id: dataUser.id,
          email: dataUser.email,
          fullname: dataUser.fullname,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
