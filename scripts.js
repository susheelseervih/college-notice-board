// Function to load external HTML content into a section
function loadSection(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(data => document.getElementById(elementId).innerHTML = data)
        .catch(error => console.error('Error loading section:', error));
}

// Load each section
loadSection('header.html', 'headerSection');
loadSection('image.html', 'imageSection');
loadSection('links.html', 'linksSection');


// Add event listener for the branch buttons
document.querySelectorAll('.branch-tab').forEach(button => {
    button.addEventListener('click', function() {
        // Get the selected branch from the button data
        const selectedBranch = this.getAttribute('data-branch');

        // Hide all notice boards
        document.querySelectorAll('.notice-board').forEach(board => {
            board.style.display = 'none';
        });

        // Show the selected branch notice board
        document.getElementById(`${selectedBranch}-board`).style.display = 'block';
    });
});

// Add event listener for the notice form submission
document.getElementById('notice-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get the branch, title, and description
    const branch = document.getElementById('branch-selector').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    // Create a new notice item
    const noticeItem = document.createElement('li');
    noticeItem.className = 'notice-item';
    noticeItem.innerHTML = `<h3>${title}</h3><p>${description}</p>`;

    // Append the notice to the respective branch notice board
    document.getElementById(`${branch}-list`).appendChild(noticeItem);

    // Clear form inputs
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
});
// Function to show the NoticeBoard section
function showNoticeBoard() {
    document.getElementById('noticeBoard').classList.toggle('hidden');
}

// Function to get notices from localStorage or create a new object if none exists
function getNotices() {
    return JSON.parse(localStorage.getItem("notices")) || {
        CSE: [],
        ISE: [],
        ECE: [],
        EEE: [],
        CI: [],
        MC: []
    };
}

// Function to save notices to localStorage
function saveNotices(notices) {
    localStorage.setItem("notices", JSON.stringify(notices));
}

// Function to add a new notice to the selected branch
function addNotice(branch, title, description, deleteAfter) {
    const notices = getNotices();
    const expirationDate = new Date(deleteAfter).getTime(); // Save as a timestamp for easier comparison

    // Add notice with expiration date
    notices[branch].push({ title, description, expirationDate });
    saveNotices(notices);
}

// Function to remove expired notices
function removeExpiredNotices() {
    const notices = getNotices();
    const currentDate = new Date().getTime(); // Get current timestamp

    // Loop through each branch and remove expired notices
    for (let branch in notices) {
        notices[branch] = notices[branch].filter(notice => {
            return notice.expirationDate >= currentDate; // Keep only unexpired notices
        });
    }

    // Save the updated notices back to localStorage
    saveNotices(notices);
}

// Event listener for form submission
document.getElementById("noticeForm").addEventListener("submit", function (event) {
    event.preventDefault();
    
    const branch = document.getElementById("branch").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const deleteAfter = document.getElementById("deleteAfter").value;

    // Add the notice to the respective branch
    addNotice(branch, title, description, deleteAfter);

    // Clear the form after submission
    document.getElementById("noticeForm").reset();

    alert("Notice added successfully to the " + branch + " notice board!");
});

// Call this function whenever the notice board is loaded
removeExpiredNotices();