
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

function clearThreads() {
    const threadElement = document.getElementById("chat-container");
    threadElement.innerHTML = '';
}

function createThread(thread) {
    clearThreads();
    const threadElement = document.getElementById("chat-container");
    const threadHeader = document.createElement('h2');
    const threadContent = document.createElement('ul');
    threadElement.appendChild(threadHeader);
    threadElement.appendChild(threadContent);
    threadHeader.textContent = thread.name;

    thread.posts.forEach(post => {
        createPost(post);
    });


}

function createPost(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-div';

    const icon = document.createElement('img');
    icon.src = post.icon;
    icon.className = 'icon';
    postDiv.appendChild(icon);
    
    const postDiv2 = document.createElement('div');
    postDiv.appendChild(postDiv2);

    const postInfo = document.createElement('div');
    postInfo.className = 'post-info';
    postDiv2.appendChild(postInfo);

    const userName = document.createElement('h5');
    userName.textContent = post.userName;
    postInfo.appendChild(userName);

    const date = document.createElement('h6');
    date.textContent = post.date;
    postInfo.appendChild(date);

    const postId = document.createElement('h6');
    postId.textContent = "postid:" + post.id;
    postInfo.appendChild(postId);

    const replyButton = document.createElement('button');
    postInfo.appendChild(replyButton);

    const replyIcon = document.createElement('i');
    replyIcon.className = 'bi bi-reply-fill';
    replyButton.appendChild(replyIcon);
    
    if (post.replyTo) {
        const replyTo = document.createElement('a');
        replyTo.className = 'reply-to';
        replyTo.textContent = "≫" + post.replyTo;
        replyTo.href = '#';
        postDiv2.appendChild(replyTo);
    }

    const contents = document.createElement('div');
    contents.className = 'contents';
    postDiv2.appendChild(contents);

    const contentsText = document.createElement('p');
    contentsText.textContent = post.contents;
    contents.appendChild(contentsText);

    replyButton.addEventListener('click', () => {
        const replyTo = document.getElementById('reply-to');
        replyTo.style.display = 'block';
        const replyToPost = document.getElementById('reply-to-post');
        replyToPost.textContent = post.id;
    });

    return postDiv;
}