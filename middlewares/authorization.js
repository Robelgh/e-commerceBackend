const authenticateJWT = (req, res, next) => {
    const SECRET_KEY = "secretkey23456";
    const authHeader = req.headers.authorization;
    const jwt = require("jsonwebtoken");

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = {
    authenticateJWT
};