const router = require('express').Router();
const auth = require('../libraries/auth');
const UserController = require('../controllers/UserController');


router.post('/login', UserController.login);
router.post('/loginwithphone', UserController.loginWithPhone);
router.post('/verifyphoneotp', UserController.verifyPhoneOtp);
router.get('/index', UserController.index);
router.get('/index/:user_id', UserController.indexOne);
router.post('/', auth.required, UserController.create);

router.post('/register', UserController.register);

router.put('/', auth.required, UserController.update);

router.put('/my-profile/image', auth.required, UserController.update_image);

router.get('/my-profile', auth.required,UserController.my_profile);

router.put('/my-profile', auth.required,UserController.update_my_profile);

router.post('/table', auth.required, UserController.table);

router.get('/permission', auth.required, UserController.current_user_permission);

router.get('/:userID', auth.required, UserController.detail_by_id);

router.put('/activate', auth.temporary, UserController.activate_account);

router.post('/activate/mail', UserController.resend_activation_email);

router.post('/password/mail', UserController.send_forgot_password_mail);

router.put('/password/reset', auth.temporary, UserController.reset_password);


/********** supplement */
router.get('/options', auth.required, UserController.options);

module.exports = router;
