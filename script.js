let currentPage = 1;
let resultsPerPage = 5;
let currentLanguage = 'en';

document.addEventListener('DOMContentLoaded', () => {
    loadVolumeData();
});

function loadVolumeData() {
    // Directly fetching data from the website's API to populate volume dropdown
    fetch('https://bd-laws.pages.dev/')
        .then(response => response.text()) // Get the HTML response
        .then(html => {
            // Use regular expressions or DOM parsing to extract the volume data
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Assuming volume data is in a <select> element with a specific id
            const volumeDropdown = doc.querySelector('#volumeFilter');
            if (volumeDropdown) {
                const volumeOptions = volumeDropdown.innerHTML;
                const volumeFilter = document.getElementById('volumeFilter');
                volumeFilter.innerHTML = volumeOptions;
            }
        })
        .catch(error => console.error('Error fetching volume data:', error));
}

function searchLaws() {
    const searchTerm = document.getElementById('searchTerm').value;
    const actFilter = document.getElementById('actFilter').value;
    const volumeFilter = document.getElementById('volumeFilter').value;
    const lawList = document.getElementById('lawList');
    const loading = document.getElementById('loading');
    const resultsSection = document.getElementById('results');
    const searchHistoryList = document.getElementById('searchHistoryList');

    lawList.innerHTML = '';
    loading.classList.remove('hidden');
    resultsSection.classList.add('hidden');

    if (!searchTerm) {
        alert('Please enter a search term.');
        loading.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        return;
    }

    const apiUrl = `https://bd-laws.pages.dev/search?q=${searchTerm}&page=${currentPage}&limit=${resultsPerPage}&act=${actFilter}&volume=${volumeFilter}&lang=${currentLanguage}`;

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

function saveSearchHistory(searchTerm) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(searchTerm)) {
        searchHistory.push(searchTerm);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}
