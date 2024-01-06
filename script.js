const themeToggle = document.getElementById("themeToggle");
const body = document.body;

function toggleDarkTheme() {
    body.classList.toggle("dark-theme");
    const isDarkTheme = body.classList.contains("dark-theme");
    if (isDarkTheme) {
        themeToggle.classList.replace('bx-moon', 'bx-sun');
    } else {
        themeToggle.classList.replace('bx-sun', 'bx-moon');
    }
}

themeToggle.addEventListener("click", toggleDarkTheme);

function openApiKeyModal() {
    const apiKeyModal = document.getElementById('apiKeyModal');
    apiKeyModal.style.display = 'flex';

    // Close the modal when the close button is clicked
    const closeBtn = document.querySelector('.api-close');
    closeBtn.addEventListener('click', function () {
        apiKeyModal.style.display = 'none';
    });

    // Handle API key submission
    const apiKeySubmitBtn = document.getElementById('apiKeySubmit');
    apiKeySubmitBtn.addEventListener('click', function () {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const apiKeyValue = apiKeyInput.value.trim();

        if (apiKeyValue) {
            // Save the API key in localStorage
            localStorage.setItem('apiKey', apiKeyValue);

            // Close the modal
            apiKeyModal.style.display = 'none';
        }
    });
}

const apiKey = localStorage.getItem('apiKey');
if (!apiKey) {
    openApiKeyModal();
}

const credentials = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'bhagavad-gita3.p.rapidapi.com'
    }
};

let currentIndex = 0;

async function loadData(offset) {
    try {
        currentIndex += offset;
        if (currentIndex < 0) {
            currentIndex = 0;
        } else if (currentIndex >= 18) {
            currentIndex = 17;
        }

        let response = await fetch("https://bhagavad-gita3.p.rapidapi.com/v2/chapters/?limit=18", credentials);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();

        const { chapter_number, name_translated, name_meaning, verses_count, chapter_summary } = data[currentIndex];

        const sub_sec_one = document.querySelector(".sub_sec_one");
        sub_sec_one.innerHTML = `
                    <div class="image">
                        <img src="shree-krishna.jpeg" alt="Shree Krishna">
                    </div>
                    <div class="detail">
                        <div class="info">
                            <span>Chapter ${chapter_number}</span>
                            <span>Verse ${verses_count}</span>
                        </div>
                        <h1>${name_translated}</h1>
                        <h2>${name_meaning}</h2>
                    </div>
                    <div class="description">
                        <p>
                            ${chapter_summary}
                        </p>
                    </div>
                `;

        const sub_sec_three = document.querySelector(".sub_sec_three");
        sub_sec_three.innerHTML = ""; // Clear previous content

        // Fetch all verses for the current chapter
        response = await fetch(`https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapter_number}/verses/`, credentials);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const versesData = await response.json();

        versesData.forEach((verse) => {
            const verseElement = document.createElement("div");
            verseElement.classList.add("verse");
            verseElement.innerHTML = `
                        <span>Verse ${verse.verse_number}</span>
                        <p>${verse.translations.find(translation => translation.language === 'english').description}</p>
                    `;
            sub_sec_three.appendChild(verseElement);
        });

        const modal = document.getElementById("myModal");
        sub_sec_one.addEventListener("click", () => {
            modal.style.display = "flex";
        });

        const closeModal = document.querySelector(".close");
        closeModal.addEventListener("click", () => {
            modal.style.display = "none";
        });

        // Store modal content
        const modalContent = document.getElementById("modalContent");
        modalContent.innerHTML = `
                    <h1>${name_translated}</h1>
                    <h2>${name_meaning}</h2>
                    <p>${chapter_summary}</p>
                `;
    } catch (error) {
        console.error("Error loading data:", error.message);
    }
}

loadData(0);