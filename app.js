// declare all global variables and functions
// all caps indicate global variables
// an underscore('_') before a function indicates a global function

// set app state
const state = {
	navLists: document.getElementsByClassName('nav-list'),
	contentDiv: document.getElementById('content'),
	productCache: '',
}

// api url
//const API_URL = 'http://localhost:3000/response';
const API_URL = 'https://maclaughlin-grain-backend.herokuapp.com';
const API_STATIC = API_URL + '/';
const ONE_HOUR = 60 * 60 * 1000; // ms
const MG_CONTACT_EMAIL = 'robertdcmac@gmail.com';

// tags
const body = document.getElementsByTagName('body')[0];

// script.js variables
var messageSentTag = document.getElementById('message-sent');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('nav');
const navLogo = document.getElementById('nav-logo');
let elementIsClicked = false;
var deviceEventType = 'click'; //initiate as click

/////////////////////
// GLOBAL METHODS
////////////////////

// token
const _setToken = token => {
    _removeToken();
    console.log("SET token");
    var tokenObj = {
        token: 'bearer ' + token,
        timestamp: new Date().getTime(),
    }
    console.log(JSON.stringify(tokenObj));
    window.localStorage.setItem('tokenObj', JSON.stringify(tokenObj));
}

const _getToken = _ => {

    console.log("GET token");

    // get object, return null if null
    var tokenObj = JSON.parse(window.localStorage.getItem('tokenObj'));
    console.log('token obj', tokenObj);
    if(!tokenObj) return null;
    
    // if token time is stored for more than an hour remove token and return null
    var tokenTime = tokenObj.timestamp;
    var timeNow = new Date().getTime();
    console.log(timeNow - tokenTime);
    if(timeNow - tokenTime > ONE_HOUR) {
        console.log("from here (get token)");
        _removeToken();
        return null;
    }

    // return token
    return tokenObj.token;
}

const _removeToken = _ => {
    console.log("REMOVE token");
    window.localStorage.removeItem('tokenObj');
}

// reset body overflow on case of reload from modal
const _resetBodyOverflow = _ => {
	if(body.classList.contains('hide-overflow')) body.classList.remove('hide-overflow');
}

// checks if on a mobile device
const _isMobile = _ => {
	return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4));
}

// toggle hamburger menu
const _toggleHamburger = _ => {

    // open/close hamburger menu
    navToggle.classList.toggle('expanded');
    nav.classList.toggle('expanded');

    // toggle ability to click non-hamburger menu items
    state.contentDiv.classList.toggle('disable-click');
    navLogo.classList.toggle('disable-click');
}

const _navToggleEvent = e => {
    // prevent default event
    e.preventDefault();

    // toggle hamburger menu
    _toggleHamburger();
    
    // nav toggle was clicked
    elementIsClicked = true;
}

// clears the product cache
const _clearProductCache = _ => {
	state.productCache = '';
}

// scroll to top of window
const _scrollToTop = _ => {
    window.scrollTo(0, 0);
}

const _toggleMessageTag = (tagName, msg) => {

    // makes sure tag isnt added before page is done being built
    setTimeout(() => {
        // scroll to top of screen
        _scrollToTop();

        // get tag name
        var messageTag = document.getElementById(tagName);
        messageTag.innerHTML = msg;

        // show tag then hide after timeout
        messageTag.classList.remove('hide-tag');
        setTimeout(() => {
           messageTag.classList.add('hide-tag');
           messageTag.innerHTML = '';
        }, 4000);
    }, 250);

}

const _validateEmail = email => {
    
    // regex to validate email
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email.toLowerCase());
}

