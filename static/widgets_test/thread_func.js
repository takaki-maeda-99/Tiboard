
// 'thread': {
//             'id': thread.id,
//             'name': thread.course.course_name,
//             'description': thread.description,
//             'posts': [
//                 {
//                     'id': post.id,
//                     'content': post.content,
//                     'created_at': post.created_at,
//                     'author': post.author.username,
//                     'attachment': post.attachment.url if post.attachment else None,
//                 }
//                 for post in posts
//             ]
//         }

function createThread(elementId, thread) {
    const threadContainer = document.getElementById(elementId);
    // clear the container
    threadContainer.innerHTML = '';
    const threadName = document.createElement('h2');
    threadName.textContent = thread.name;
    threadContainer.appendChild(threadName);
    const threadDescription = document.createElement('p');
    threadDescription.textContent = thread.description;
    threadContainer.appendChild(threadDescription);
    const postsContainer = document.createElement('div');
    thread.posts.forEach(post => {
        const postElement = document.createElement('div');
        const postContent = document.createElement('p');
        postContent.textContent = post.content;
        postElement.appendChild(postContent);
        const postAuthor = document.createElement('p');
        postAuthor.textContent = post.author;
        postElement.appendChild(postAuthor);
        if (post.attachment) {
            const postAttachment = document.createElement('img');
            postAttachment.src = post.attachment;
            postElement.appendChild(postAttachment);
        }
        postsContainer.appendChild(postElement);
    });
    threadContainer.appendChild(postsContainer);
}