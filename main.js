const swiper = new Swiper('.swiper', {
    watchSlidesProgress: true,

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

const team_members = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'
];


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

        const htmlId = `name-roll-revealed-${name}`
        roll.setAttribute('id', htmlId)
        rules += `.swiper-slide-fully-visible #${htmlId} ol { top: ${computedHeight}px; } `
    });
    styles.replace(rules);
}

function init_team_slides() {

    // Create a name list, with several copies per name, that can be put in every container.
    const list_of_names = document.createElement('ol');
    for (let i = 0; i < team_members.length * 5; i++) {
        const name = team_members[i % (team_members.length)]
        let li = document.createElement('li')
        li.innerText = name
        list_of_names.append(li)
    }

    document.querySelectorAll('.name-roll').forEach((roll) => {
        // First, make a copy of the displayed names list.
        roll.appendChild(list_of_names.cloneNode(true));
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

init_team_slides();