const FULLY_VISIBLE_CLASS_NAME = 'swiper-slide-fully-visible-or-transitioning-out';

const TEAM_MEMBERS = [
    'A A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'
];

const swiper = new Swiper('.swiper', {
    watchSlidesProgress: true,

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    on: {
        transitionEnd: function (e) {
            console.log('Transition End', e.activeIndex, e.previousIndex);
            e.slides[e.activeIndex].classList.add(FULLY_VISIBLE_CLASS_NAME);
            e.slides[e.previousIndex].classList.remove(FULLY_VISIBLE_CLASS_NAME);
        },
    }
});

// TODO also compute this on page resize
function setTeamSlidesRevealPosition() {
    // TODO move this to an init function
    const styles = new CSSStyleSheet()
    document.adoptedStyleSheets = [styles];

    let rules = ""
    document.querySelectorAll('.name-roll').forEach((roll) => {
        // This must be set in the HTML or things won't work.
        const name = roll.dataset.revealedName;
        // Either land on the 3rd or 4th copy of each name.
        let targetedNameCopy = 3;
        if (roll.classList.contains('name-roll-top')) {
            targetedNameCopy = 2;
        }
        const revealedNameLi = Array.from(roll.querySelectorAll('li'))
            .filter((li) => li.innerText === name)[targetedNameCopy]
        revealedNameLi.classList.add('name-roll-revealed');

        const revealedNameOffset = revealedNameLi.offsetTop
        const revealedNameHeight = revealedNameLi.clientHeight
        const rollViewport = roll.clientHeight
        // Vertically center the targeted element.
        const computedHeight = -revealedNameOffset + (rollViewport / 2) - (revealedNameHeight / 2)

        // Remove spaces and make name fully lowercase for the attribute.
        const nameForId = name.replace(' ', '').toLowerCase()
        const htmlId = `name-roll-revealed-${nameForId}`
        roll.setAttribute('id', htmlId)
        rules += `.${FULLY_VISIBLE_CLASS_NAME} #${htmlId} ol { top: ${computedHeight}px; } `
    });
    styles.replace(rules);
}

function initTeamSlides() {

    // Create a name list, with several copies per name, that can be put in every container.
    const listOfNamesEl = document.createElement('ol');
    for (let i = 0; i < TEAM_MEMBERS.length * 5; i++) {
        const name = TEAM_MEMBERS[i % (TEAM_MEMBERS.length)]
        let li = document.createElement('li')
        li.innerText = name
        listOfNamesEl.append(li)
    }

    document.querySelectorAll('.name-roll').forEach((roll) => {
        // First, make a copy of the displayed names list.
        roll.appendChild(listOfNamesEl.cloneNode(true));
        // Also create the overlay element.
        const overlayEl = document.createElement('div');
        overlayEl.classList.add('name-roll-overlay');
        const spaces = '&nbsp;'.repeat(20);
        const overlayTextEl = document.createElement('p');
        overlayTextEl.innerHTML = `►${spaces}◄`
        overlayEl.appendChild(overlayTextEl);
        roll.append(overlayEl);
    });
    setTeamSlidesRevealPosition();
}

initTeamSlides();

// Add classes that trigger animations once everything has loaded.
document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        document.querySelector("body").classList.add('page-loaded');
        swiper.slides[swiper.activeIndex].classList.add(FULLY_VISIBLE_CLASS_NAME);
    }
};