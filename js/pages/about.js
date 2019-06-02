const about = () => {

	// set content
	let content = `
		<div class="container">
			<div class="about">
				<div class="box box-logo">
					<img src="./assets/logo-lg.png" alt="logo-lg">
				</div><!-- /box-logo -->
				
				<div class="box box-header">
					<h1>About</h1>
				</div><!-- /box-header -->

				<div class="box box-bio">
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at viverra felis. Sed ante purus, elementum congue egestas ut, commodo vitae tellus. Praesent aliquam tellus et nulla scelerisque, eget euismod nunc dignissim. Ut turpis arcu, ultricies ut sapien et, feugiat pulvinar sem. Maecenas pellentesque commodo mi, a aliquet urna congue in. Nulla nec metus tincidunt, laoreet justo non, blandit erat.</p>
				</div><!-- /box-bio -->
				
			</div><!-- /about -->
		</div><!-- /container -->
	`;
	
	// set about content
	state.contentDiv.innerHTML = content;
}
