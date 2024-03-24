// Fetch quote
const API_URL = import.meta.env.VITE_APP_API_URL
let isMacron = false // default value
async function fetchQuote() {
    const response = await fetch(API_URL + '/quote', { method: 'GET' })
    const quote = await response.json()
    console.log('Quote:', quote)
    
    isMacron = quote.author === 'Macron'
    document.querySelector('#success-paragraph').textContent = `Reviens bientôt pour la source!`
    document.querySelector('#fail-paragraph').textContent = `C'était une citation de ${quote.author}. Reviens bientôt pour la source!`
    document.querySelector('#quote-paragraph').textContent = quote.quote
}
fetchQuote()

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

