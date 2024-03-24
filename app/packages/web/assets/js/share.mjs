const shareButton = document.querySelector('button.share-quote')

const data = {
    text: "Macron ou pas Macron ?",
    url: window.location.href,
}

// only display if you can share
if (navigator.share && navigator.canShare && navigator.canShare(data)) {
    shareButton.classList.remove("hide")
}

shareButton.addEventListener('click', async () => {
    try {
        await navigator.share(data);
        console.log('Quote shared successfully')
    } catch (err) {
        console.log(`Error: ${err}`)
    }
})