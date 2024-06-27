let currentPage = 1;
const collectionList = document.querySelector('.event-collection-list');

collectionList.onscroll = function() {
    if ((this.offsetHeight + this.scrollTop) >= this.scrollHeight) {
        // User has scrolled to the bottom of the collection list, load more items
        loadMoreItems();
    }
};

function loadMoreItems() {
    currentPage++;

    fetch(`https://api.webflow.com/collections/COLLECTION_ID/items?per_page=12&page=${currentPage}`, {
        headers: {
           'Authorization': 'Bearer 370d78d6ad37826bd5b9fc18a8dcc2da503d2dfe0a4c50fd4e7e8b16588676f7',
            'accept-version': '1.0.0'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Add items to the page
        data.items.forEach(item => {
            const listItem = document.createElement('div');
            listItem.className = 'w-dyn-item';
            listItem.textContent = item.name; // Replace this with the actual content of the item
            collectionList.appendChild(listItem);
        });
    });
}