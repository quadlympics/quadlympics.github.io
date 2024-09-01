const FULLY_VISIBLE_CLASS_NAME = 'swiper-slide-fully-visible-or-transitioning-out';

// List of all team members, in a random order for the scrolling reveal.
const TEAM_MEMBERS = [
    'ANDREW', 'BEN D', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'
];

const swiper = new Swiper('.swiper', {
    watchSlidesProgress: true,

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    on: {
        transitionEnd: function (e) {
            e.slides[e.activeIndex].classList.add(FULLY_VISIBLE_CLASS_NAME);
            e.slides[e.previousIndex].classList.remove(FULLY_VISIBLE_CLASS_NAME);
        },
    }
});

const teamSlidePositionRules = new CSSStyleSheet();
const teamRecapSequentialAnimationRules = new CSSStyleSheet();
document.adoptedStyleSheets = [teamSlidePositionRules, teamRecapSequentialAnimationRules];

function setTeamSlidePositionRules() {
    let rules = "";
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
    console.debug("Replacing teamSlidePositionRules", rules)
    teamSlidePositionRules.replace(rules);
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

    // Make a copy of the displayed names list on every roll.
    document.querySelectorAll('.name-roll').forEach((roll) => {
        roll.appendChild(listOfNamesEl.cloneNode(true));
    });

    // Set the position on load, and recalculate if window size changes.
    setTeamSlidePositionRules();
    window.addEventListener("resize", setTeamSlidePositionRules);
}
initTeamSlides();

// Create a set of animations with a different delay each. This is tedious in CSS alone.
function buildTeamRecapSequentialAnimationRules() {
    const numTeams = TEAM_MEMBERS.length / 2;
    let rules = "";
    for (let i = 0; i < numTeams; i++) {
        delay = (i / 2).toFixed(1)
        rules += `
        .${FULLY_VISIBLE_CLASS_NAME} .recap-names-left li:nth-child(${i + 1}) {
            animation: 1s ${delay}s recap-name-left-fly-in cubic-bezier(.22, 1.3, .64, 1.01) forwards;
        }

        .${FULLY_VISIBLE_CLASS_NAME} .recap-names-right li:nth-child(${i + 1}) {
            animation: 1s ${delay}s recap-name-right-fly-in cubic-bezier(.22, 1.3, .64, 1.01) forwards;
        }

        .${FULLY_VISIBLE_CLASS_NAME} .recap-names-plus li:nth-child(${i + 1}) {
            animation: 0.5s ${delay}s recap-plus-fade-in forwards;
        }
        `
    }
    console.debug("Replacing teamRecapSequentialAnimationRules", rules)
    teamRecapSequentialAnimationRules.replace(rules)
}
buildTeamRecapSequentialAnimationRules();

// Add classes that trigger animations once everything has loaded.
document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        document.querySelector("body").classList.add('page-loaded');
        swiper.slides[swiper.activeIndex].classList.add(FULLY_VISIBLE_CLASS_NAME);
    }
};