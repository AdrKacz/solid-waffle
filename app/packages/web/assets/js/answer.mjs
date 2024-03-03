const macronButton = document.querySelector('#macron')
const successModal = document.querySelector('#success-modal')
const successModalCloseButton = document.querySelector('#success-modal .btn-close')

macronButton.addEventListener('click', () => {
    successModal.style.display = 'block'
})

successModalCloseButton.addEventListener('click', () => {
    successModal.style.display = 'none'
})

const pasMacronButton = document.querySelector('#pas-macron')
const failModal = document.querySelector('#fail-modal')
const failModalCloseButton = document.querySelector('#fail-modal .btn-close')

pasMacronButton.addEventListener('click', () => {
    failModal.style.display = 'block'
})

failModalCloseButton.addEventListener('click', () => {
    failModal.style.display = 'none'
})