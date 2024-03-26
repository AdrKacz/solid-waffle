const QUOTES = 'quotes'

export function setQuote(id, ttl) { // ttl in milliseconds
    const quotes = getQuotes() // get old quotes
    quotes[id] = Date.now() + ttl // update
    localStorage.setItem(QUOTES, JSON.stringify(quotes)) // save
}

export function getQuotes() {
    const rawQuotes = localStorage.getItem(QUOTES)
    if (typeof rawQuotes !== 'string') {
        return {}
    }
    
    let quotes
    try {
        quotes = JSON.parse(rawQuotes)
    } catch (error) {
        console.log('Failed to parse seen quotes from storage:', rawQuotes)
    }
    
    const now = Date.now()
    for (const [id, expire] of Object.entries(quotes)) {
        console.log(id, now, expire, now > expire)
        if (now > expire) {
            delete quotes[id]
        }
    }
    
    return quotes
}