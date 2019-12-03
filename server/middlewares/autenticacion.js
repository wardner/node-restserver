const jwt = require('jsonwebtoken');

//===================
//  Verificar Token
//===================

let veriToken = (req, res, next) => {

    let token = req.get('token'); // header token

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.user = decoded.user;

        next();
    });
};

//===================
//  Verificar Rol
//===================

let veriRole = (req, res, next) => {
    let user = req.user;

    if (user.rol === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'Solo el Admin puede crear usuarios'
            }
        });
    }
};


module.exports = {
    veriToken,
    veriRole
};