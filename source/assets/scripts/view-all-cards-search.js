export function searchCards(searchInput) {
    const searchInput = document.querySelector('.search-bar-view');
    // const searchBar = document.querySelector('.search-bar');
    const keyword = searchInput.value.toLowerCase();

    const cards = localStorage.getItem("cards");
    if (!cards) {

        return;
    }

    let obj;
    try {
        obj = JSON.parse(cards);
    } catch (e) {
        // resultsContainer.innerText = "Error parsing cards data.";
        return;
    }

    let found = false;
    for (const key in obj) {
        if (key.toLowerCase().includes(keyword) && keyword !== '') {
            renderScaledPreview()
        }
    }

    if (!found && keyword !== '') {
        resultsContainer.innerText = "No results found.";
    }
}