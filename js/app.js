
/**
 * Define Global Variables
 * 
*/

const navBar = document.querySelector('.page__header');
const navbarList = document.getElementById('navbar__list');
const landingContainers = document.getElementsByClassName('landing__container')
let sections = [];
let toTopButton = document.getElementsByTagName('button')[0];

let scrollEvents = 0;
const scrollOffset = -70;
let navBarTimeout;

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/

const makeSectionActive = (isections,iid) => {
    isections[iid].classList.add('your-active-class')
}

const makeSectionInactive = (isections,iid) => {
    isections[iid].classList.remove('your-active-class')
}

const handleElementActveState = (isections,iactiveIdx) => {
    for (let i = 0; i < isections.length; i++) {
        if (i === iactiveIdx) makeSectionActive(isections,i)
        else makeSectionInactive(isections,i)
    }
}

const handleElementVisibility = (ielement,idisplay) => {
    ielement.style.display = idisplay
}

const setupNavBarHide = itime => {
    clearTimeout(navBarTimeout)
    navBarTimeout = setTimeout(() => {
        handleElementVisibility(navBar,'none')
    },itime)
}


/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

// build the nav
sections = document.getElementsByTagName('section');
//TODO: make more performent
for (let i = 0; i < sections.length; i++) {
    var listItem = document.createElement('li')
    var sectionStr = sections[i].getAttribute('data-nav');    
    ((iidx) => {
        listItem.addEventListener('click',(e) => {
            handleClickEventNavBarScroll(e,iidx)
        })
    })(i)
    listItem.classList.add('navbar__menu');
    listItem.classList.add('menu__link');
    
    listItem.appendChild(document.createTextNode(sectionStr));
    navbarList.appendChild(listItem);
}

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

const scrollToPosition = (iscrollInstructions) => {
    window.scrollTo(iscrollInstructions);
}

// Add class 'active' to section when near top of viewport

// toTopButton = document.createElement('button');
// toTopButton.innerHTML = 'To Top';
// toTopButton.style.display = 'none'
toTopButton.addEventListener('click',(e) => {
    e.preventDefault()
    scrollToPosition({
        top: sections[0].offsetTop + scrollOffset,
        left: 0,
        behavior: 'smooth'
    })
})
// document.querySelector('main').appendChild(toTopButton)

window.addEventListener('scroll',e => {

    handleElementVisibility(toTopButton,window.scrollY > sections[sections.length-1].offsetTop + scrollOffset ? 'inline-block' : 'none')

    if (!scrollEvents++) return

    let smallestDifference = 100000, idx = 0;
    for (let i = 0; i < sections.length; i++) {
        const diff = Math.abs(window.scrollY - sections[i].offsetTop);
        if (diff < smallestDifference) {
            smallestDifference = diff;
            idx = i;
        }
    }

    handleElementActveState(sections,idx);
    handleElementVisibility(navBar,'block');
    setupNavBarHide(3000);
})

/**
 * End Main Functions
 * Begin Events
 * 
*/

// Build menu 

// Scroll to section on link click

// Set sections as active


