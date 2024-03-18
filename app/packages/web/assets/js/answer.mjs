// Fetch quote
let isMacron = false // default value
function getQuote() {
    isMacron = true
    return 'Nique tes morts !'
}

document.querySelector('#quote-paragraph').textContent = getQuote()

// Set answers
const macronButton = document.querySelector('#macron')
const pasMacronButton = document.querySelector('#pas-macron')
const successModal = document.querySelector('#success-modal')
const failModal = document.querySelector('#fail-modal')
const successModalCloseButton = document.querySelector('#success-modal .btn-close')
const failModalCloseButton = document.querySelector('#fail-modal .btn-close')

macronButton.addEventListener('click', () => {
    if (isMacron) {
        successModal.style.display = 'block'
    } else {
        failModal.style.display = 'block'
    }
})

pasMacronButton.addEventListener('click', () => {
    if (!isMacron) {
        successModal.style.display = 'block'
    } else {
        failModal.style.display = 'block'
    }
})

// Close modals
successModalCloseButton.addEventListener('click', () => {
    successModal.style.display = 'none'
})

failModalCloseButton.addEventListener('click', () => {
    failModal.style.display = 'none'
})

