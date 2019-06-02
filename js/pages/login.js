const login = () => {
	
	// set content
	let content = `
		<div class="container">
			<div id="login-failed" class="message hide-tag"></div>
			<div class="login-form">
				<h2>Login</h2>
				<form id="login-form" method="POST">
					<input name="email" placeholder="login" type="text">
					<input name="password" placeholder="password" type="password">
					<input class="submit-btn" type="submit">
				</form>
			</div><!-- /login-form -->
		</div><!-- /container -->
	`;
	
	// set login content
	state.contentDiv.innerHTML = content;

	// get login form
	const loginForm = document.getElementById('login-form');

	// add login form submit event
	loginForm.addEventListener('submit', e => {

		// prevent form from reloading page and sending
		e.preventDefault();
		
		// create login object based on formdata
		var loginObj = {
			email: loginForm.elements['email'].value.toLowerCase(),
			password: loginForm.elements['password'].value,
		};		
		
		// POST api, send login login data
		fetch(API_URL + '/users/login', {
			method: 'POST',
			body: JSON.stringify(loginObj),
			headers: {
				"Content-Type": "application/json",
			}
		})
		.then(res => res.json())
		.then(data => {
			
			// if auth was successful
			if(data.auth === '1' && data.token) {

				// set token and redirect to admin
				_setToken(data.token);
				return _redirect('/admin', -1);
			}
			
			// show message
			_toggleMessageTag('login-failed', '<h2>Incorrect credentials.</h2>');
		})
		.catch(err => {

			// remove token and reload login
			_removeToken();
			return _redirect('/login', -1);
		});
	});
}
