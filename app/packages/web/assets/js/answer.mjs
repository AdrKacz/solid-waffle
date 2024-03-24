// Function to fetch quote
console.log(import.meta.env)
const API_URL = import.meta.env.VITE_APP_API_URL
let isMacron = false // default value
async function fetchQuote(id) {
    const path = typeof id === 'string' ? `/quote/${id}` : `/quote`
    const response = await fetch(API_URL + path, { method: 'GET' })
    const quote = await response.json()
    console.log('Quote:', quote)
    
    isMacron = quote.author === 'Emmanuel Macron'
    document.querySelector('#success-paragraph').innerHTML = `Tu veux en savoir plus ? <a href='${quote.sourceLink}' target='blank'>${quote.sourceAlt}</a>`
    document.querySelector('#fail-paragraph').innerHTML = `C'était une citation de ${quote.author} (<a href='${quote.sourceLink}' target='blank'>${quote.sourceAlt}</a>).`
    document.querySelector('#quote-paragraph').textContent = quote.quote
}

// Read first quote id if any
const quoteId = new URLSearchParams(window.location.search).get("quote")

// Fetch
if (typeof quoteId === 'string') {
    fetchQuote(quoteId)
} else {
    fetchQuote()
}


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

