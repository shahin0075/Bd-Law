let currentPage = 1;
let resultsPerPage = 5;
let searchHistory = [];

function searchLaws() {
    const searchTerm = document.getElementById('searchTerm').value;
    const lawList = document.getElementById('lawList');
    const loading = document.getElementById('loading');
    const resultsSection = document.getElementById('results');
    const searchHistoryList = document.getElementById('searchHistoryList');

    // Clear previous results and hide the loading spinner
    lawList.innerHTML = '';
    loading.classList.remove('hidden');
    resultsSection.classList.add('hidden');

    if (!searchTerm) {
        alert('Please enter a search term.');
        loading.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        return;
    }

    const apiUrl = `https://bd-laws.pages.dev/search?q=${searchTerm}&page=${currentPage}&limit=${resultsPerPage}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            loading.classList.add('hidden');
            resultsSection.classList.remove('hidden');

            if (data && data.length > 0) {
                data.forEach(law => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>${law.title}</strong>: ${law.description}
                        <button onclick="viewDetails('${law.id}')">View Details</button>
                    `;
                    lawList.appendChild(li);
                });
                renderPagination(data.totalResults);
                saveSearchHistory(searchTerm);
            } else {
                lawList.innerHTML = '<li>No results found.</li>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            lawList.innerHTML = '<li>Error fetching data.</li>';
            loading.classList.add('hidden');
            resultsSection.classList.remove('hidden');
        });
}

function renderPagination(totalResults) {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    let paginationHtml = '';

    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `<button onclick="goToPage(${i})">${i}</button>`;
    }

    pagination.innerHTML = paginationHtml;
}

function goToPage(page) {
    currentPage = page;
    searchLaws();
}

function viewDetails(id) {
    // Logic to fetch and display detailed law information
    alert('Viewing details for law ID: ' + id);
}

function applyFilters() {
    const actFilter = document.getElementById('actFilter').value;
    const volumeFilter = document.getElementById('volumeFilter').value;

    // Apply the selected filters when searching
    const searchTerm = document.getElementById('searchTerm').value;
    const apiUrl = `https://bd-laws.pages.dev/search?q=${searchTerm}&act=${actFilter}&volume=${volumeFilter}&page=${currentPage}&limit=${resultsPerPage}`;
    fetchAndDisplayData(apiUrl);
}

function fetchAndDisplayData(apiUrl) {
    const lawList = document.getElementById('lawList');
    const loading = document.getElementById('loading');
    const resultsSection = document.getElementById('results');

    lawList.innerHTML = '';
    loading.classList.remove('hidden');
    resultsSection.classList.add('hidden');

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            loading.classList.add('hidden');
            resultsSection.classList.remove('hidden');

            if (data && data.length > 0) {
                data.forEach(law => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>${law.title}</strong>: ${law.description}
                    `;
                    lawList.appendChild(li);
                });
            } else {
                lawList.innerHTML = '<li>No results found.</li>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            lawList.innerHTML = '<li>Error fetching data.</li>';
            loading.classList.add('hidden');
            resultsSection.classList.remove('hidden');
        });
}

function saveSearchHistory(searchTerm) {
    if (!searchHistory.includes(searchTerm)) {
        searchHistory.push(searchTerm);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        updateSearchHistoryList();
    }
}

function updateSearchHistoryList() {
    const searchHistoryList = document.getElementById('searchHistoryList');
    searchHistoryList.innerHTML = '';

    const storedHistory = JSON.parse(localStorage.getItem('searchHistory'));
    if (storedHistory) {
        storedHistory.forEach(term => {
            const li = document.createElement('li');
            li.textContent = term;
            searchHistoryList.appendChild(li);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateSearchHistoryList();
});
