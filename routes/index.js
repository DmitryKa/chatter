var express = require('express');
var router = express.Router();
var main_controller = require('../controllers/main_controller');

router.get('/', main_controller.index);
router.get('/login', main_controller.login_form);
router.post('/login', main_controller.login);

module.exports = router;
