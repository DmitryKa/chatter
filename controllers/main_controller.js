var logger = require('log4js').getLogger('main_controller');

exports.index = function(req, res, next) {
    if (!req.cookies.name) {
        logger.debug('Name in cookies is absent, redirect to login page');
        res.redirect('/login');
    } else {
        logger.debug(req.cookies.name + ' opens index page');
        res.render('index', { name: req.cookies.name });
    }
};

exports.login_form = function (req, res) {
    var current_name = req.cookies.name || ''
    logger.debug((current_name || 'unknown user') + ' opens login page');
    res.render('login', { name: current_name} );
};

exports.login = function (req, res) {
    logger.debug(req.body.name + ' tries to login');
    res.cookie('name', req.body.name);
    res.redirect('/');
};