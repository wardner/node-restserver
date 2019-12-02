const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const _ = require('underscore');

const User = require('../models/user');

app.get('/usuario', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    User.find({ estado: true }, 'nombre email rol estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, user) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    user,
                    cuantos: conteo
                });
            });

        });
});

app.post('/usuario', (req, res) => {

    let body = req.body;

    let user = new User({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        rol: body.rol
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //userDB.password = null;

        res.json({
            ok: true,
            user: userDB
        });

    });
});

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'rol', 'estado']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        })

    });
});

app.delete('/usuario/:id', (req, res) => {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    User.findByIdAndUpdate(id, cambiaEstado, { new: true, runValidators: true }, (err, userDisabled) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDisabled) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario No Encontrado'
                }
            });
        }

        res.json({
            ok: true,
            user: userDisabled
        });

    });

    // User.findByIdAndRemove(id, (err, userRemoved) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!userRemoved) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario No Encontrado'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         user: userRemoved
    //     });
    // });
});
module.exports = app;