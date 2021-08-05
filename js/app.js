
/**
 * Define Global letiables
 * 
*/

//page elements
const navBar = document.querySelector('.page__header');
const navbarList = document.getElementById('navbar__list');
const landingContainers = document.getElementsByClassName('landing__container')
const toTopButton = document.getElementsByTagName('button')[0];
const sections = document.getElementsByTagName('section');

//active class str referened in css
const activeStateClassStr = 'active-class'

//helper variables for use in page view
let scrollOffset = 0;
let scrollEvents = 0;
let navBarTimeout;


/**
 * End Global letiables
 * Start Helper Functions
 * 
*/

//helper to remove or add active class str
const setElementState = (isections,iid,iaction) => isections[iid].classList[iaction](activeStateClassStr)

//iterates through sections and sets active or makes inactive
const handleElementActveState = (isections,iactiveIdx) => {
    for (let i = 0; i < isections.length; i++) setElementState(isections,i,i === iactiveIdx ? 'add' : 'remove')
}

//handles an elements visibility
const handleElementVisibility = (ielement,idisplay) => ielement.style.display = idisplay

//handler to display or hide to top button
const handleButtonVisibility = (ielement,ivisible) => {
    ielement.style.opacity = ivisible ? 1 : 0;
    ielement.style.pointerEvents = ivisible ? 'all' : 'none';
}

//helper to hide nav bar
const setupNavBarHide = itime => {
    clearTimeout(navBarTimeout)
    navBarTimeout = setTimeout(() => {
        handleElementVisibility(navBar,'none')
    },itime)
}

//wrapper to scroll to position
const scrollToPosition = iscrollInstructions => window.scrollTo(iscrollInstructions);


/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

// build the nav
for (let i = 0; i < sections.length; i++) {
    const listItem = document.createElement('li')
    const sectionStr = sections[i].getAttribute('data-nav');    
    (iidx => {
        listItem.addEventListener('click',(e) => {
            handleClickEventNavBarScroll(e,iidx)
        })
    })(i)
    listItem.classList.add('navbar__menu');
    listItem.classList.add('menu__link');
    
    listItem.appendChild(document.createTextNode(sectionStr));
    navbarList.appendChild(listItem);
}

//after navbar items added, determine height of navbar to offset when navigating to a section
scrollOffset = -document.getElementsByClassName('navbar__menu')[0].offsetHeight;

//for each landing container, add click event listner to collapse sections
for (let i = 0; i < landingContainers.length; i++) {

    landingContainers[i].addEventListener('click',function(e){
        e.preventDefault()
        let children = this.children;
        if (!this.hidableChildElements) {
            this.hidableChildElements = [];
            this.removeElements = true;
        }
        const storeReferenceOfChildren = this.hidableChildElements.length === 0;

        for (let j = 0; j < children.length; j++) 
            if (children[j].tagName !== 'H2' && storeReferenceOfChildren) this.hidableChildElements.push(children[j]);

        if (this.removeElements) {
            this.hidableChildElements.forEach(ce => ce.remove())
            this.parentElement.style.minHeight = "0px";
        }
        else this.hidableChildElements.forEach(ce => this.appendChild(ce))

        this.removeElements = !this.removeElements;
    })
}

// Scroll to anchor ID using scrollTO event
const handleClickEventNavBarScroll = (e,iidx) => {
    e.preventDefault();
    scrollToPosition({
        top: sections[iidx].offsetTop + scrollOffset,
        left: 0,
        behavior: 'smooth'
    })
    handleElementActveState(iidx)
}

//top button event listener to go to top section
toTopButton.addEventListener('click',(e) => {
    e.preventDefault()

    //scroll to top section
    scrollToPosition({
        top: sections[0].offsetTop + scrollOffset,
        left: 0,
        behavior: 'smooth'
    })
})

window.addEventListener('scroll',e => {

    //turn on to top button if user has scrolled to bottom of page
    handleButtonVisibility(toTopButton,window.innerHeight + window.scrollY >= document.body.offsetHeight)

    //if first scroll from refresh, return.. prevents navbar from displaying and leaving on refresh
    if (!scrollEvents++) return

    //determine visible section
    let smallestDifference = 100000, idx = 0;
    for (let i = 0; i < sections.length; i++) {
        const diff = Math.abs(window.scrollY - sections[i].offsetTop);
        if (diff < smallestDifference) {
            smallestDifference = diff;
            idx = i;
        }
    }

    //set determined section active
    handleElementActveState(sections,idx);

    //turn on nav bar
    handleElementVisibility(navBar,'block');

    //setup up timeout to hide navbar
    setupNavBarHide(3000);
})

/**
 * End Main Functions
 *
 * 
*/