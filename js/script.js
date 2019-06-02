// grid animations for products
const fadeInProducts = () => {
    const products = document.getElementsByClassName('fade-in');

    // iterate through each product
    for(var i = 0; i < products.length; i++) {
        
        // variable for each product to deal with scoping i
        const product = products[i];

        // set timeout
        setTimeout(() => {
            
            // add class to each product
            product.classList.add('is-visible');
        }, 200 * i);
    }
}

// instantly show products instead of fading them
const showProducts = () => {
    const products = document.getElementsByClassName('fade-in');

    // iterate through each product
    for(var i = 0; i < products.length; i++) {
            
        // add class to each product
        products[i].classList.add('show-product');
    }
}

// modal open and close events
const modalEvent = e => {
    e = e || window.event;
    var target = e.target || e.srcElement;

    // if target has a modal toggle
    if(target.hasAttribute('data-toggle') && target.getAttribute('data-toggle') == 'modal') {

        // remove default event
        e.preventDefault();

        // check if on correct target modal
        if (target.hasAttribute('data-target')) {
            var m_ID = target.getAttribute('data-target');
            
            // open modal
            document.getElementById(m_ID).classList.add('open');
            
            // hide body overflow
            body.classList.add('hide-overflow');
        }
    }

    // Close modal window with 'data-dismiss' attribute or when the backdrop is clicked
    if((target.hasAttribute('data-dismiss') && target.getAttribute('data-dismiss') == 'modal') || target.classList.contains('modal')) {

        console.log("yo");

        var modal = document.querySelector('[class="modal open"]');
        
        // close modal
        modal.classList.remove('open');
        
        // show body overflow
        if(!target.classList.contains('enlarge')) _resetBodyOverflow();
    }

    // if(target.classList.contains('close')) {
    //     var modal = document.querySelector('[class="modal open"]');
        
    //     // close modal
    //     modal.classList.remove('open');
        
    //     // show body overflow
    //     if(!target.classList.contains('enlarge')) _resetBodyOverflow();
    // }
}

const hamburgerOffClick = e => {
    // if navbar is collapsed
    if(!nav.classList.contains('expanded')) return;

    // if navbar toggle is clicked
    if(elementIsClicked) {
        elementIsClicked = false;
        return
    };

    // if click happens outside of sidebar
    if(!e.target.closest('nav')) {
        _toggleHamburger();
        return
    }
}

// device detection
if(_isMobile()) { 
    deviceEventType = 'touchend';
} else {
    // add hamburger off click event listener
    document.addEventListener('click', hamburgerOffClick, false);
}

// add modal click event listeners
document.addEventListener('click', modalEvent, false);

// add hamburger click event listener
navToggle.addEventListener('click', _navToggleEvent, false);





