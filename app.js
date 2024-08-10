document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const userTable = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    const tableHead = document.getElementById('userTable').getElementsByTagName('thead')[0];
    const popup = document.getElementById('popup');
    const popupImage = document.getElementById('popupImage');
    const popupName = document.getElementById('popupName');
    const popupEmail = document.getElementById('popupEmail');
    const popupPhone = document.getElementById('popupPhone');
    const popupResumeLink = document.getElementById('popupResumeLink');
    const closePopupButton = document.querySelector('#popup .close');
    const snoColumnIndex = 0; // Index of the S.No column

    let users = [];
    let snoCounter = 1; // Serial number counter

    // Initialize the table header with S.No column if not present
    function initializeTableHeader() {
        if (tableHead.rows.length === 0) {
            const headerRow = tableHead.insertRow();
            ['S.No', 'User ID', 'Name', 'Email', 'Photo', 'Resume', 'Action'].forEach(text => {
                const th = document.createElement('th');
                th.textContent = text;
                headerRow.appendChild(th);
            });
        } else if (tableHead.rows[0].cells.length < 7) {
            const th = document.createElement('th');
            th.textContent = 'S.No';
            tableHead.rows[0].insertBefore(th, tableHead.rows[0].cells[0]);
        }
    }

    // Validate email format
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Validate phone number format
    function isValidPhoneNumber(phone) {
        const phonePattern = /^[0-9]{10}$/;
        return phonePattern.test(phone);
    }

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const userId = document.getElementById('userId').value.trim();
        const userName = document.getElementById('userName').value.trim();
        const userEmail = document.getElementById('userEmail').value.trim();
        const userPhone = document.getElementById('userPhone').value.trim();
        const userPhoto = document.getElementById('userPhoto').files[0];
        const userResume = document.getElementById('userResume').files[0];

        // Clear previous errors
        document.getElementById('userIdError').textContent = '';
        document.getElementById('userEmailError').textContent = '';
        document.getElementById('userPhoneError').textContent = '';

        // Validate user ID uniqueness
        if (users.some(user => user.userId === userId)) {
            document.getElementById('userIdError').textContent = 'User ID already exists';
            return;
        }

        // Validate required fields
        if (!userId || !userName || !userEmail || !userResume) {
            alert('Please fill in all required fields.');
            return;
        }

        // Validate email format
        if (!isValidEmail(userEmail)) {
            document.getElementById('userEmailError').textContent = 'Invalid email format';
            return;
        }

        // Validate phone number format
        if (userPhone && !isValidPhoneNumber(userPhone)) {
            document.getElementById('userPhoneError').textContent = 'Invalid phone number format - Must contain 10 digits';
            return;
        }

        // Validate email and phone number uniqueness
        if (users.some(user => user.userEmail === userEmail)) {
            document.getElementById('userEmailError').textContent = 'Email ID already exists.';
            return;
        }

        if (users.some(user => user.userPhone === userPhone)) {
            document.getElementById('userPhoneError').textContent = 'Phone number already exists.';
            return;
        }

        // Create a new user object
        const newUser = {
            sno: snoCounter++,
            userId,
            userName,
            userEmail,
            userPhone,
            userPhoto: userPhoto ? URL.createObjectURL(userPhoto) : '',
            userResume: URL.createObjectURL(userResume),
        };

        // Add user to the users array
        users.push(newUser);

        // Add user to the table
        addToTable(newUser);

        // Reset the form
        form.reset();
    });

    // Add user to the table
    function addToTable(user) {
        const row = userTable.insertRow();

        // Serial Number
        row.insertCell().textContent = user.sno;

        // User ID
        row.insertCell().innerHTML = `<a href="#" class="user-id-link" data-user-id="${user.userId}">${user.userId}</a>`;

        // Name
        row.insertCell().textContent = user.userName;

        // Email
        row.insertCell().textContent = user.userEmail;

        // Photo
        row.insertCell().innerHTML = user.userPhoto ? `<img src="${user.userPhoto}" alt="Photo">` : 'N/A';

        // Resume
        row.insertCell().innerHTML = `<a href="#" class="resume-link" data-resume="${user.userResume}">View Resume</a>`;

        // Action
        const actionCell = row.insertCell();
        actionCell.innerHTML = `<button class="remove-btn" data-user-id="${user.userId}">Remove</button>`;

        // Add event listeners to the links and buttons
        row.querySelector('.remove-btn').addEventListener('click', () => removeUser(user.userId));
        row.querySelector('.user-id-link').addEventListener('click', (e) => {
            e.preventDefault();
            const selectedUser = users.find(u => u.userId === user.userId);
            showPopup(selectedUser);
        });
        row.querySelector('.resume-link').addEventListener('click', (e) => {
            e.preventDefault();
            openResumePopup(user.userResume);
        });
    }

    // Remove user from the table
    function removeUser(userId) {
        users = users.filter(user => user.userId !== userId);
        userTable.innerHTML = ''; // Clear the table
        snoCounter = 1; // Reset the serial number counter
        users.forEach(user => addToTable(user)); // Re-add remaining users to table
    }

    // Show user details in the popup
    function showPopup(user) {
        popupImage.src = user.userPhoto || '';
        popupName.textContent = `Name: ${user.userName}`;
        popupEmail.textContent = `Email: ${user.userEmail}`;
        popupPhone.textContent = `Phone: ${user.userPhone || 'N/A'}`;
        popupResumeLink.href = user.userResume;
        popupResumeLink.textContent = 'View Resume';
        popup.style.display = 'flex';
    }

    // Open resume in a new window
    function openResumePopup(resumeUrl) {
        window.open(resumeUrl, 'ResumePopup', 'width=600,height=800,scrollbars=yes');
    }

    // Close the popup
    function closePopup() {
        popup.style.display = 'none';
    }

    // Close popup when clicking the close button or outside of the popup
    closePopupButton.addEventListener('click', closePopup);
    window.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });

    // Initialize the table header
    initializeTableHeader();

    document.addEventListener('DOMContentLoaded', () => {
        const userTable = document.getElementById('userTable');
        const tableHead = userTable.querySelector('thead');
        const headers = tableHead.querySelectorAll('th');
    
        function sortTable(columnIndex, ascending = true) {
            const tbody = userTable.querySelector('tbody');
            const rows = Array.from(tbody.rows);
            const sortedRows = rows.sort((rowA, rowB) => {
                const cellA = rowA.cells[columnIndex].textContent.trim();
                const cellB = rowB.cells[columnIndex].textContent.trim();
                let valueA, valueB;
    
                // Handle different cell types (text, number)
                if (!isNaN(cellA) && !isNaN(cellB)) {
                    valueA = parseFloat(cellA);
                    valueB = parseFloat(cellB);
                } else {
                    valueA = cellA.toLowerCase();
                    valueB = cellB.toLowerCase();
                }
    
                // Compare values
                if (valueA < valueB) return ascending ? -1 : 1;
                if (valueA > valueB) return ascending ? 1 : -1;
                return 0;
            });
    
            // Clear the current rows
            tbody.innerHTML = '';
            // Re-add the header row
            tbody.appendChild(tableHead.querySelector('tr'));
    
            // Add sorted rows
            sortedRows.forEach(row => tbody.appendChild(row));
        }
    
        function addSorting() {
            headers.forEach((header, index) => {
                header.style.cursor = 'pointer'; // Indicate that headers are clickable
                header.addEventListener('click', () => {
                    console.log('Header clicked:', header.textContent);
                    const currentOrder = header.dataset.order || 'asc';
                    const ascending = currentOrder === 'desc';
                    header.dataset.order = ascending ? 'asc' : 'desc';
                    sortTable(index, ascending);
                });
            });
        }
    
        // Initialize sorting functionality
        addSorting();
    });
    
});
