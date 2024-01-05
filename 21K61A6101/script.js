// Get DOM elements
const editorTabButton = document.getElementById('editor-tab');
const publishesTabButton = document.getElementById('publishes-tab');
const editorTabContent = document.getElementById('editor');
const publishesTabContent = document.getElementById('publishes');
const postTitleInput = document.getElementById('post-title');
const postContentInput = document.getElementById('post-content');
const imageUploadInput = document.getElementById('image-upload');
const publishButton = document.getElementById('publish-button');
const publishedPostsList = document.getElementById('published-posts');

// Array to store published posts
let posts = [];

// Event listeners for tab switching
editorTabButton.addEventListener('click', () => {
    editorTabButton.classList.add('active');
    publishesTabButton.classList.remove('active');
    editorTabContent.style.display = 'block';
    publishesTabContent.style.display = 'none';
});

publishesTabButton.addEventListener('click', () => {
    editorTabButton.classList.remove('active');
    publishesTabButton.classList.add('active');
    editorTabContent.style.display = 'none';
    publishesTabContent.style.display = 'block';
    displayPublishedPosts();
});

// Event listener for publishing a new post
publishButton.addEventListener('click', () => {
    const title = postTitleInput.value;
    const content = postContentInput.value;
    const image = imageUploadInput.files[0];

    if (title && content && image) {
        const reader = new FileReader();
        reader.onload = () => {
            const post = {
                title: title,
                content: content,
                imageUrl: reader.result,
            };
            posts.push(post);
            clearEditorFields();
            savePostsToLocalStorage();
            displayPublishedPosts();
            alert('Blog published successfully!');
        };
        reader.readAsDataURL(image);
    } else {
        alert('Please fill in all fields and upload an image.');
    }
});

// Display published posts in the list
function displayPublishedPosts() {
    publishedPostsList.innerHTML = '';
    posts.forEach((post, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <h3>${post.title}</h3>
            <img src="${post.imageUrl}" alt="Image">
            <p>${post.content}</p>
            <button class="remove-button" data-index="${index}">Remove</button>`;
        publishedPostsList.appendChild(listItem);
    });

    // Add event listener for remove buttons
    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            removePost(index);
        });
    });
}

// Remove a post
function removePost(index) {
    posts.splice(index, 1);
    savePostsToLocalStorage();
    displayPublishedPosts();
}

// Clear input fields after publishing
function clearEditorFields() {
    postTitleInput.value = '';
    postContentInput.value = '';
    imageUploadInput.value = '';
}

// Save posts to local storage
function savePostsToLocalStorage() {
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Load posts from local storage
function loadPostsFromLocalStorage() {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
        posts = JSON.parse(storedPosts);
    }
}

// Initial setup
editorTabButton.click();
loadPostsFromLocalStorage();
displayPublishedPosts();

document.addEventListener('DOMContentLoaded', function () {
    const publishButton = document.getElementById('publish-button');

    publishButton.addEventListener('click', async function () {
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const imageUpload = document.getElementById('image-upload');
        const imageFile = imageUpload.files[0];

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('image', imageFile);

        try {
            const response = await fetch('http://localhost:3000/publish', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Post published successfully');
                // Reload or update posts as needed
            } else {
                console.error('Error publishing post:', response.statusText);
            }
        } catch (error) {
            console.error('Error publishing post:', error);
        }
    });

    // Fetch and display published posts
    async function fetchAndDisplayPosts() {
        try {
            const response = await fetch('http://localhost:3000/getPosts');

            if (response.ok) {
                const posts = await response.json();
                const publishedPosts = document.getElementById('published-posts');

                // Clear existing posts
                publishedPosts.innerHTML = '';

                // Display fetched posts
                posts.forEach(post => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <h3>${post.title}</h3>
                        <p>${post.content}</p>
                        <img src="${post.imageUrl}" alt="Post Image">
                    `;
                    publishedPosts.appendChild(listItem);
                });
            } else {
                console.error('Error fetching posts:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    // Fetch and display posts when the page loads
    fetchAndDisplayPosts();
});
