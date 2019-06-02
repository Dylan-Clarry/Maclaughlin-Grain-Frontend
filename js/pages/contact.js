const contact = () => {
	
	// set content
	let content = `
		<div class="container">
			<div id="message-sent" class="message hide-tag"></div>
			<div class="contact">
				<div class="box box-info">
					<h1>Contact</h1>
					<br>
					<p>Robert Maclaughlin
					<br>647 864 6692
					<br>Markham, Ontario
					<br>${ MG_CONTACT_EMAIL }
				</p>
				</div><!-- /box-header -->
			
				<div class="box box-form">
					<form id="contact-form" method="POST">
						<input id="name" name="name" placeholder="Name" type="text" required>
						<br>
						<input id="email" name="email" placeholder="Email" type="email" required>
						<br>
						<input id="subject" name="subject" placeholder="Subject" type="text" required>
						<br>
						<textarea name="message" id="message" placeholder="Message" cols="30" rows="10" required></textarea>
						<br>
						<input class="submit-btn" id="submit" type="submit">
					</form>
				</div><!-- /box-form -->
			</div><!-- /about -->
		</div><!-- /container -->
	`;

	// set about content
	state.contentDiv.innerHTML = content;
	
	// get contact form
	const contactForm = document.getElementById('contact-form');

	// add contact form submit event
	contactForm.addEventListener('submit', e => {

		// prevent form from reloading page and sending
		e.preventDefault();
		
		// create email object based on formdata
		var emailObj = {};
		for(var i = 0; i < contactForm.length - 1; i++) {
			emailObj[contactForm[i].name] = contactForm[i].value;
		}
		
		// POST api, send contact email data
		fetch(API_URL + '/contact/contact', {
			method: 'POST',
			body: JSON.stringify(emailObj),
			headers: {
				"Content-Type": "application/json",
			}
		})
		.then(res => res.json())
		.then(data => {

			// show message
			_toggleMessageTag('message-sent', '<h2>Message sent, thank you.</h2>');
		})
		.catch(err => console.log(err));
	});
}


