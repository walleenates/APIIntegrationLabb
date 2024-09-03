// Select the button and container elements for dog breeds
const searchInput = document.getElementById('searchInput');
const animalContainer = document.getElementById('animalContainer');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('emptyState');
const categorySelect = document.getElementById('categorySelect');
const breedInfo = document.getElementById('breedInfo');

// Select the button and container elements for users
const fetchBreedsBtn = document.getElementById('fetchBreedsBtn');
const fetchUsersBtn = document.getElementById('fetchUsersBtn');
const userContainer = document.getElementById('userContainer');

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function fetchBreeds() {
    loading.style.display = 'block';
    animalContainer.style.display = 'flex';  // Show animal container
    userContainer.style.display = 'none';    // Hide user container
    animalContainer.innerHTML = '';

    fetch('https://dog.ceo/api/breeds/list/all')
        .then(response => response.json())
        .then(data => {
            const breedsObj = data.message;
            const breedNames = Object.keys(breedsObj);
            const categorizedBreeds = categorizeBreeds(breedNames);
            populateCategorySelect(categorizedBreeds);
            displayBreeds(categorizedBreeds);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            animalContainer.innerHTML = '<p style="color:red;">Failed to fetch data. Please try again later.</p>';
        })
        .finally(() => {
            loading.style.display = 'none';
        });
}

function categorizeBreeds(breeds) {
    const categories = {};

    breeds.forEach(breed => {
        const firstLetter = breed.charAt(0).toUpperCase();
        if (!categories[firstLetter]) {
            categories[firstLetter] = [];
        }
        categories[firstLetter].push(breed);
    });

    return categories;
}

function populateCategorySelect(categorizedBreeds) {
    categorySelect.innerHTML = '<option value="">Select Category</option>'; // Reset options
    for (const category in categorizedBreeds) {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    }
}

function displayBreeds(categorizedBreeds) {
    const selectedCategory = categorySelect.value;
    const breedsToDisplay = selectedCategory ? categorizedBreeds[selectedCategory] : Object.values(categorizedBreeds).flat();

    if (breedsToDisplay.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }

    animalContainer.innerHTML = '';

    breedsToDisplay.forEach(breed => {
        fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
            .then(response => response.json())
            .then(data => {
                const breedCard = document.createElement('div');
                breedCard.className = 'animal-card';
                
                breedCard.innerHTML = `
                    <img src="${data.message}" alt="${breed}">
                    <div class="details">
                        <h3>${breed.charAt(0).toUpperCase() + breed.slice(1)}</h3>
                    </div>
                `;
                
                breedCard.addEventListener('click', () => showBreedInfo(breed));
                animalContainer.appendChild(breedCard);
            })
            .catch(error => {
                console.error('Error fetching breed image:', error);
            });
    });
}

function showBreedInfo(breed) {
    loading.style.display = 'block';
    breedInfo.innerHTML = '';

    fetch(`https://api.example.com/breed/${breed}`) // Example URL
        .then(response => response.json())
        .then(data => {
            const breedDetails = data || {};
            breedInfo.innerHTML = `
                <h2>${breed.charAt(0).toUpperCase() + breed.slice(1)}</h2>
                <p><strong>Scientific Name:</strong> ${breedDetails.scientific_name || 'N/A'}</p>
                <p><strong>Life Span:</strong> ${breedDetails.life_span || 'N/A'}</p>
                <p><strong>Average Weight:</strong> ${breedDetails.average_weight || 'N/A'}</p>
                <p><strong>Average Height:</strong> ${breedDetails.average_height || 'N/A'}</p>
                <p><strong>Description:</strong> ${breedDetails.description || 'N/A'}</p>
            `;
            breedInfo.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching breed information:', error);
            breedInfo.innerHTML = '<p style="color:red;">Failed to fetch breed information. Please try again later.</p>';
        })
        .finally(() => {
            loading.style.display = 'none';
        });
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();

    fetch('https://dog.ceo/api/breeds/list/all')
        .then(response => response.json())
        .then(data => {
            const breedsObj = data.message;
            const filteredBreeds = Object.keys(breedsObj).filter(breed =>
                breed.toLowerCase().includes(searchTerm)
            );
            const categorizedBreeds = categorizeBreeds(filteredBreeds);
            displayBreeds(categorizedBreeds);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function fetchAndDisplayUsers() {
    loading.style.display = 'block';
    animalContainer.style.display = 'none'; // Hide animal container
    userContainer.style.display = 'flex';   // Show user container
    userContainer.innerHTML = '';

    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                const userCard = document.createElement('div');
                userCard.className = 'user-card';

                userCard.innerHTML = `
                    <h3>${user.name}</h3>
                    <p>Email: ${user.email}</p>
                    <p>Phone: ${user.phone}</p>
                    <p>Website: ${user.website}</p>
                    <p>Company: ${user.company.name}</p>
                `;

                userContainer.appendChild(userCard);
            });
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            userContainer.innerHTML = '<p style="color:red;">Failed to fetch user data. Please try again later.</p>';
        })
        .finally(() => {
            loading.style.display = 'none';
        });
}

searchInput.addEventListener('input', debounce(handleSearch, 300));
categorySelect.addEventListener('change', () => fetchBreeds());

fetchBreedsBtn.addEventListener('click', fetchBreeds);
fetchUsersBtn.addEventListener('click', fetchAndDisplayUsers);

fetchBreeds(); // Fetch breeds initially
