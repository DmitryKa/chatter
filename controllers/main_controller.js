
exports.index = function(req, res, next) {
    if (!req.cookies.name) {
        res.redirect('/login');
    } else {
        res.render('index', { name: req.cookies.name });
    }
};

exports.login_form = function (req, res) {
    var current_name = req.cookies.name || ''
    res.render('login', { name: current_name} );
};

exports.login = function (req, res) {
    res.cookie('name', req.body.name);
    res.redirect('/');
};