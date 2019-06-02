const shop = () => {
	
	// if products have not been loaded
	if(state.productCache === '') {

		// set loading content
		let content = `
			<div class="container">
				<h1 class="loading">Loading...</h1>
			</div>
		`;
		
		// loading placeholder
		state.contentDiv.innerHTML = content;

		// fetch products
		fetch(API_URL + '/products', {
			method: 'GET',
		}).then(res => res.json())
		.then(data => {

			// get products from response data
			count = data.response.count;
			products = data.response.products;

			// load message if there are no products available
			if(count === 0) {
				content = `
					<div class="container">
						<h1 class="push-down">No products available at this time. Please follow the <a href="https://www.instagram.com/maclaughlingrain/" target="_blank"><u>Maclaughlin Grain Instagram</u></a> for future announcements.</h1>
					</div><!-- /container -->
				`;

				// load content onto page
				state.contentDiv.innerHTML = content;
			} else {
				// set opening tags
				content = `
					<div class="container">
						<div id="request-sent" class="message hide-tag"></div>
						<div class="grid">
				`;

				// build each product component and add to content
				products.reverse().map((product, i) => {
					product = product.product;
					content += buildProduct(product, i);

					// precache photos
					new Image().src = API_STATIC + product.productImage;
				});

				content += `
						</div><!-- /grid -->
					</div><!-- /container -->
				`;

				// store products to avoid another api call
				state.productCache = content;

				// load content onto page
				state.contentDiv.innerHTML = content;

				// ADD PRODUCT REQUEST LISTENERS
				document.addEventListener('click', sendProductRequestEmail, false);

				// fade in products with slight delay on first load
				setTimeout(() => {fadeInProducts();}, 500);
				
			}
		})
		.catch(err => {

			// set content close tags
			content = `
				<div class="container">
					<h1 class="push-down">500 error.</h1>
				</div><!-- /container -->
			`;

			// load content onto page
			state.contentDiv.innerHTML = content;
		});	
	} else {

		// set content on 
		state.contentDiv.innerHTML = state.productCache;

		// show products instantly if cached already
		showProducts();
	}
}

const buildProduct = (product, i) => {
	return `
		<div data-target="modal-${ i }" data-toggle="modal" class="product fade-in">
			<img data-target="modal-${ i }" data-toggle="modal" src="${ API_STATIC }${ product.productImage }" alt="product">
			<p data-target="modal-${ i }" data-toggle="modal" class="name">${ product.name }</p>
			<p data-target="modal-${ i }" data-toggle="modal" class="price">${ product.price }</p>
		</div><!-- /product -->

		<div id="modal-${ i }" class="modal">
			<div class="modal-window product-modal">
				<div class="close" data-dismiss="modal">&times;</div>
					<img class="pointer enlarge" data-target="modal-enlarge-photo-${ i }" data-toggle="modal" data-dismiss="modal" src="${ API_STATIC }${ product.productImage }" alt="product">
					<p class="small-print push-down-small">Click to enlarge</p>
					<br />
					<h2>${ product.name }</h2>
					<p>${ product.description }</p>
					<p>Request this item: &nbsp&nbsp ${ product.name } - ${ product.price } CAD</p>
					<p class="small-print">*As each product is unique they are available by request only</p>
					<div id="form-validation-${ i }" class="form-validation message hide-tag"></div>
					<form method="POST">
						<input name="form-num" type="hidden" value="${ i }" />
						<input name="_id" type="hidden" value="${ product._id }" required>

						<input name="name" placeholder="Name" type="text" required>
						<input name="email" placeholder="Email" type="email" required>
						<input name="phoneNumber" placeholder="Phone Number (optional)" type="text">
						<textarea name="message" placeholder="Type your message here (required)" cols="30" rows="10" required></textarea>
						<input product-request-event-adder class="submit-btn" type="submit">
					</form>
			</div><!-- /product-modal -->
		</div><!-- /modal -->

		<div id="modal-enlarge-photo-${ i }" class="modal">
			<div class="modal-window large product-modal">
				<div class="close" data-dismiss="modal">&times;</div>
				<img class="large-photo" data-target="modal-change-photo" data-toggle="modal" src="${ API_STATIC }${ product.productImage }" alt="product">
			</div>
		</div><!-- /modal-enlarge-photo-${ i } -->
	`;
}

const sendProductRequestEmail = e => {

	// set event and target
	e = e || window.event;
    var target = e.target || e.srcElement;

	// return if not on update photo button
	if(!target.hasAttribute('product-request-event-adder')) return;

	// prevent form from reloading page and sending
	e.preventDefault();

	// form inputs
	var form = target.parentElement;
	var formNum = form.elements['form-num'].value;
	var _id = form.elements['_id'].value;

	var name = form.elements['name'].value;
	var email = form.elements['email'].value;
	var phoneNumber = form.elements['phoneNumber'].value;
	var message = form.elements['message'].value;

	// form validation
	var formInput = '';
	if(name.replace(/\s/g, '') === '') {
		console.log('name');
		formInput = 'Name';
	} else if(email.replace(/\s/g, '') === '') {
		console.log('email');
		formInput = 'Email';
	} else if(message.replace(/\s/g, '') === '') {
		console.log('message');
		formInput = 'Message';
	}
	if(formInput !== '') return _toggleMessageTag(`form-validation-${ formNum }`, `<h3>${ formInput } is blank, please fill out this field</h3>`);
	if(!_validateEmail(email)) return _toggleMessageTag(`form-validation-${ formNum }`, `<h3>Email format is incorrect.</h3>`);

	// create product request object
	var productReqObj = {
		_id: _id,
		name: name,
		email: email,
		phoneNumber: phoneNumber,
		message: message,
	}
	console.log(JSON.stringify(productReqObj));

	// create json options
	var options = {
		method: 'POST',
		body: JSON.stringify(productReqObj),
		headers: {
			"Content-Type": "application/json",
		}
	};
	
	// POST api, send contact email data
	fetch(API_URL + '/contact/product', options)
	.then(res => res.json())
	.then(data => {
		
		console.log(data);
		requestIsSent();
	})
	.catch(err => {

		// redirect back to login
		authRedirect();
	});
}

const requestIsSent = _ => {
	_redirect('/', 0);

	// show message
	_toggleMessageTag('request-sent', '<h2>Request sent, thank you.</h2>');
}

