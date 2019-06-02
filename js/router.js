// assign routes
const routes = {
	'/': shop,
	'/index.html': shop,
	'/about': about,
	'/contact': contact,
	'/login': login,
	'/admin': admin,
};

// on active history entry change
window.onpopstate = () => {
	routes[window.location.pathname]();
};

const resetCurrentPageNav = (navIndex) => {
	
	// remove current page class
	for(var i = 0; i <= state.navLists.length; i++) {
		state.navLists[0].getElementsByTagName('li')[i].getElementsByTagName('a')[0].classList.remove('current-page');
		state.navLists[1].getElementsByTagName('li')[i].getElementsByTagName('a')[0].classList.remove('current-page');
	}

	// stop if in secret mode (shhhhhh!)
	if(navIndex === -1) return;

	// add current page class name to current page
	state.navLists[0].getElementsByTagName('li')[navIndex].getElementsByTagName('a')[0].classList.add('current-page', 'black');
	state.navLists[1].getElementsByTagName('li')[navIndex].getElementsByTagName('a')[0].classList.add('current-page', 'black');
}

// on nav item click update history
const _redirect = (pathName, navIndex) => {
	window.history.pushState(
		{},
		pathName,
		window.location.origin + pathName
	);

	// call route function
	routes[pathName]();

	// add current page class to current page
	resetCurrentPageNav(navIndex);

	// reset hidden body overflow
	_resetBodyOverflow();

	// reset window position
	_scrollToTop();
}

// go to url path on page load
_redirect(window.location.pathname, 0);

// in development start with "live-server --port=8080 --file-entry='./index.html'"