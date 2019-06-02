const admin = () => {
	
	console.log(!_getToken());

	// if not logged in redirect to login page instead
	if(!_getToken()) return _redirect('/login', -1);

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
	})
	.then(res => res.json())
	.then(data => {

		// get products from response data
		count = data.response.count;
		products = data.response.products;

		// set opening tags and create new product modal
		content = `
			<div class="container admin-page">
				<div id="crud-action" class="message hide-tag"></div>
				<h1>Admin Dashboard</h1>
				<div class="grid">
					<div data-target="modal-new" data-toggle="modal" class="product new-product">
						<img data-target="modal-new" data-toggle="modal" src="./assets/new-board.png" alt="product">
						<p data-target="modal-new" data-toggle="modal" class="name">New Product</p>
						<p data-target="modal-new" data-toggle="modal" class="price">+</p>
					</div><!-- /product -->

					<div id="modal-new" class="modal">
						<div class="modal-window product-modal">
							<span class="close" data-dismiss="modal">&times;</span>
							<h1>New Product</h1>
							<br>
							<form id="create-form" enctype="multipart/form-data">
								<p>Product Name:</p>
								<input name="name" placeholder="Product Name" type="text" required>
								<br />
								<br />
								<p>Product Price:</p>
								<input name="price" placeholder="Product Price" type="text" required>
								<br />
								<br />
								<p>Product Image:</p>
								<input name="productImage" type="file" accept="image/jpeg, image/png" required>
								<p>Product Description:</p>
								<textarea name="description" form="new-product-form" id="description" placeholder="description (optional)" cols="30" rows="10"></textarea>
								<input class="submit-btn" type="submit" value="Create New Product">
							</form>
						</div>
					</div><!-- /modal-new -->
		`;
		
		// build each product component and add to content
		products.reverse().map((product, i) => {

			// get individual product
			product = product.product;

			// build product component
			content += buildAdminProduct(product, i);
		});

		// add closing tags
		content += `
				</div><!-- /grid -->
			</div><!-- /container -->
		`;

		// load content onto page
		state.contentDiv.innerHTML = content;

		// ====================
		// CRUD listeners
		// ====================
		
		// form variables
		let createForm = document.getElementById('create-form');
		let deleteTemp, updateTemp, updatePhotoTemp;

		// CREATE PRODUCT LISTENER
		createForm.addEventListener('submit', e => adminCreateProduct(e, createForm));
		
		// DELETE PRODUCT LISTENERS
		products.map((deleteProduct, i) => {

			// get form
			deleteTemp = document.getElementById(`delete-form-${ i }`);

			// add delete event to form
			deleteTemp.addEventListener('submit', e => adminDeleteProduct(e, deleteProduct));
		});

		// UPDATE PRODUCT LISTENERS
		document.addEventListener('click', adminUpdateProduct, false);

		// UPDATE PRODUCT PHOTO LISTENERS
		document.addEventListener('click', adminUpdatePhotoProduct, false);

		// prevent default cancel button
		document.addEventListener('click', preventDefaultButton, false);
	})
	.catch(err => {
		authRedirect();
	});
}

// builds each editable product
const buildAdminProduct = (product, i) => {
	return `
		<div data-target="modal-${ i }" data-toggle="modal" class="product">
			<img data-target="modal-${ i }" data-toggle="modal" src="${ API_STATIC }${ product.productImage }" alt="product">
			<p data-target="modal-${ i }" data-toggle="modal" class="name">${ product.name }</p>
			<p data-target="modal-${ i }" data-toggle="modal" class="price">${ product.price }</p>
		</div><!-- /product -->

		<div id="modal-${ i }" class="modal">
			<div class="modal-window product-modal">
				<span class="close" data-dismiss="modal">&times;</span>
				<img data-target="modal_0" data-toggle="modal" src="${ API_STATIC }${ product.productImage }" alt="product">
				<h1>Edit</h1>
				<br>
				<form id="update-form-${ i }" method="POST">
					<p>Product Name:</p>
					<input name="name" placeholder="Product Name" type="text" value="${ product.name }">
					<p>Product Price:</p>
					<input name="price" placeholder="Product Price" type="text" value="${ product.price }">
					<p>Product Image:</p>
					<p class="change-photo-btn" data-target="modal-change-photo-${ i }" data-toggle="modal" data-dismiss="modal">Change Photo</p>
					<br>
					<p>Product Description:</p>
					<textarea name="description" id="description" type="text" placeholder="description" cols="30" rows="10">${ product.description }</textarea>
					<button class="delete-btn" data-target="modal-delete-${ i }" data-toggle="modal" data-dismiss="modal">Delete</button>
					<input type="hidden" name="_id" value="${ product._id }">
					<input update-product-event-adder class="submit-btn" type="submit" value="Edit Product">
				</form>
			</div>
		</div><!-- / modal-${ i } -->

		<div id="modal-change-photo-${ i }" class="modal">
			<div class="modal-window small product-modal">
				<span class="close" data-dismiss="modal">&times;</span>
				<img data-target="modal-change-photo" data-toggle="modal" src="${ API_STATIC }${ product.productImage }" alt="product">
				<h1>Change Photo</h1>
				<br>
				<form id="update-photo-form-${ i }" enctype="multipart/form-data">
					<input type="hidden" name="_id" value="${ product._id }">
					<input name="productImage" type="file" accept="image/jpeg, image/png" required>
					<br>
					<button cancel-btn type="button" class="cancel-btn" data-dismiss="modal">Cancel</button>
					<input update-product-photo-event-adder class="submit-btn" type="submit" value="Change Photo">
				</form>
			</div>
		</div><!-- /modal-change-photo-${ i } -->

		<div id="modal-delete-${ i }" class="modal">
			<div class="modal-window small product-modal">
				<span class="close" data-dismiss="modal">&times;</span>
				<img data-target="modal-delete" data-toggle="modal" src="${ API_STATIC }${ product.productImage }" alt="product">
				<p>${ product.name }</p>
				<br>
				<p>${ product.price }</p>
				<br>
				<p>${ product.description }</p>
				<h1>Delete this item?</h1>
				<br>
				<form id="delete-form-${ i }" method="POST">
					<button cancel-btn type="button" class="cancel-btn" data-dismiss="modal">Cancel</button>
					<input type="hidden" name="_id" value="${ product._id }">
					<input class="delete-btn float-right" type="submit" value="Delete">
				</form>
			</div>
		</div><!-- /modal-delete-${ i } -->
	`;
}

// prevent default cancel button
const preventDefaultButton = e => {

	console.log('hello from button BEFORE');
	
	// set event and target
	e = e || window.event;
    var target = e.target || e.srcElement;

    if(target.hasAttribute('cancel-btn')) console.log("it has cancel-btn");

	// return if not on update photo button
	if(!target.hasAttribute('cancel-btn')) return;

	// prevent form from reloading page and sending
	e.preventDefault();

	console.log('hello from button AFTER');
}

// checks auth and redirects accordingly
const crudRedirect = (data, msg) => {

	// clear cache and reload
	_clearProductCache();
	_redirect('/admin', -1);
    _toggleMessageTag('crud-action', msg);
	
}

// auth redirect on failed auth or token timeout
const authRedirect = _ => {
	console.log("auth redirect");
	_removeToken();
	_clearProductCache();
	return _redirect('/login', -1);
}

// create a new product
const adminCreateProduct = (e, form) => {

	// prevent form from reloading page and sending
	e.preventDefault();

	// form inputs
	var name = form[0];
	var price = form[1];
	var image = form[2].files;
	var description = form.getElementsByTagName('textarea')[0];
	
	// create formdata
	var formData = new FormData();
	formData.append('name', name.value);
	formData.append('price', price.value);
	formData.append('description', description.value);
	
	// add file to form data
	for(var i = 0; i < image.length; i++) {
		formData.append('productImage', image[i]);
	}

	// create json options
	var options = {
		method: 'POST',
		body: formData,
		headers: {
			"Authorization": _getToken(),
		}
	};

	// delete headers and allow browser to send new ones
	if(options && options.headers) delete options.headers['Content-Type'];
	
	// POST api, create product
	fetch(API_URL + '/products/', options)
	.then(res => res.json())
	.then(data => {
		
		// checks auth and redirects accordingly
		crudRedirect(data, '<h2>Product created.</h2>');
	})
	.catch(err => {

		console.log("from from (create)");
		console.log(err);
		
		// redirect back to login
		authRedirect();
	});
}

// delete a product
const adminDeleteProduct = (e, product) => {

	// prevent form from reloading page and sending
	e.preventDefault();

	// create email object based on formdata
	product = product.product;
	var deleteObj = {
		_id: product._id,
	};

	// create json options
	var options = {
		method: 'POST',
		body: JSON.stringify(deleteObj),
		headers: {
			"Content-Type": "application/json",
			"Authorization": _getToken(),
		}
	};
	
	// POST api, send contact email data
	fetch(API_URL + '/products/delete', options)
	.then(res => res.json())
	.then(data => {
		
		// checks auth and redirects accordingly
		 crudRedirect(data, '<h2>product deleted</h2>');
	})
	.catch(err => {

		console.log("from from (delete)");
		
		// redirect back to login
		authRedirect();
	});
}

// update a product
const adminUpdateProduct = e => {

	// set event and target
	e = e || window.event;
    var target = e.target || e.srcElement;

	// return if not on update photo button
	if(!target.hasAttribute('update-product-event-adder')) return;

	// prevent form from reloading page and sending
	e.preventDefault();

	// form inputs
	var form = target.parentElement;
	var _id = form.elements['_id'].value;
	var name = form.elements['name'].value;
	var price = form.elements['price'].value;
	var description = form.elements['description'].value;

	// create email object based on formdata
	var updateObj = {
		_id: _id,
		name: name,
		price: price,
		description: description,
	};

	// create json options
	var options = {
		method: 'POST',
		body: JSON.stringify(updateObj),
		headers: {
			"Content-Type": "application/json",
			"Authorization": _getToken(),
		}
	};
	
	// POST api, send contact email data
	fetch(API_URL + '/products/update', options)
	.then(res => res.json())
	.then(data => {
		
		// checks auth and redirects accordingly
		crudRedirect(data, '<h2>Product updated.</h2>');
	})
	.catch(err => {
		
		console.log("from from (update)");

		// redirect back to login
		authRedirect();
	});
}

// update a product photo
const adminUpdatePhotoProduct = e => {

	// set event and target
	e = e || window.event;
    var target = e.target || e.srcElement;

	// return if not on update photo button
	if(!target.hasAttribute('update-product-photo-event-adder')) return;

	// prevent form from reloading page and sending
	e.preventDefault();

	// form inputs
	var form = target.parentElement;
	var _id = form.elements['_id'].value;
	var productImage = form.elements['productImage'].files;

	// create form data
	var formData = new FormData();
	formData.append('_id', _id);

	// add file to form data
	for(var i = 0; i < productImage.length; i++) {
		formData.append('productImage', productImage[i]);
	}

	// create json options
	var options = {
		method: 'POST',
		body: formData,
		headers: {
			"Authorization": _getToken(),
		}
	};

	// delete headers and allow browser to send new ones
	if(options && options.headers) delete options.headers['Content-Type'];
	
	// POST api, send contact email data
	fetch(API_URL + '/products/updatephoto', options)
	.then(res => res.json())
	.then(data => {
		
		// checks auth and redirects accordingly
		crudRedirect(data, '<h2>Product photo updated.</h2>');
	})
	.catch(err => {

		console.log("from from (updatephoto)");

		// redirect back to login
		authRedirect();
	});
}








