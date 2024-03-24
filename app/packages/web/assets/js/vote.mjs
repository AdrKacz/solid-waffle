// Read first quote id if any
const quote = { id: new URLSearchParams(window.location.search).get("quote") }

// Fetch quote
console.log(import.meta.env)
const API_URL = import.meta.env.VITE_APP_API_URL
let isMacron = false // default value
async function fetchQuote(id) {
    const path = typeof id === 'string' ? `/quote/${id}` : `/quote`
    const response = await fetch(API_URL + path, { method: 'GET' })
    const data = await response.json()
    quote.data = data
    console.log('Quote:', data)
    isMacron = data.author === 'Emmanuel Macron'
    
    const source = `<a href='${data.sourceLink}' target='blank'>${data.sourceAlt}</a>`
    document.querySelector('#success-paragraph').innerHTML = `Tu veux en savoir plus ? ${source}`
    document.querySelector('#fail-paragraph').innerHTML = `C'était une citation de ${data.author} (${source}).`
    document.querySelector('#quote-paragraph').textContent = data.quote
}

if (parseInt(quote.id)) {
    fetchQuote(quote.id)
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

// Share
const shareButtons = document.querySelectorAll('button.share-quote')

const getShareData = (id) => ({
    text: "Macron ou pas Macron ?",
    url: `${window.location.origin + window.location.pathname}?quote=${id}`,
})

// only display if you can share (use default id: 0)
if (navigator.share && navigator.canShare && navigator.canShare(getShareData(0))) {
    shareButtons.forEach((button) => (button.classList.remove("hide")))
}

shareButtons.forEach((button) => (button.addEventListener('click', async () => {
    try {
        // quote.id comes from the url (can be null)
        // quote.data.id comes from the api (cannot be null)
        await navigator.share(getShareData(quote.data.id));
        console.log('Quote shared successfully')
    } catch (err) {
        console.log(`Error: ${err}`)
    }
})))

