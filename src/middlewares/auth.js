const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(201).send({
      message: "access denied",
    });
  }

  try {
    const SECRET_KEY = process.env.TOKEN_KEY;
    const verified = jwt.verify(token, SECRET_KEY);

    req.user = verified;

    next();
  } catch (error) {
    res.status(401).send({
      message: "invalid token",
    });
  }
};
