
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
    const threads = document.querySelectorAll('.thread-container');
    threads.forEach(thread => {
        thread.innerHTML = '';
    });
}

function createThread(elementId, thread) {
    clearThreads();
    const threadElement = document.getElementById(elementId);
    const threadHeader = document.createElement('h2');
    const threadContent = document.createElement('ul');
    threadElement.appendChild(threadHeader);
    threadElement.appendChild(threadContent);
    threadHeader.textContent = thread.name;

    threadElement.className = "thread-container";
    threadContent.className = "thread-content";

    thread.posts.forEach(post => {
        console.log(post);
        createPost(threadContent, post);
    });
}

function createPost(parent, post) {
    console.log(post);
    const container = document.createElement('li');
    parent.appendChild(container);

    const header = document.createElement('div');
    container.appendChild(header);

    const icon = document.createElement('div');
    const user = document.createElement('h4');
    const info = document.createElement('p');
    header.appendChild(icon);
    header.appendChild(user);
    header.appendChild(info);

    const content = document.createElement('div');
    container.appendChild(content);

    const text = document.createElement('p');
    const file = document.createElement('div');
    content.appendChild(text);
    content.appendChild(file);

    const replyBtn = document.createElement('button');
    container.appendChild(replyBtn);

    container.className = "post-container";
    header.className = "post-header";
    content.className = "post-content";
    icon.className = "post-icon";
    user.className = "post-user";
    info.className = "post-info";
    file.className = "post-file";
    replyBtn.className = "reply-btn";

    user.textContent = post.author;
    info.textContent = `${post.created_at} Post ID: ${post.id}`;
    text.textContent = post.content;
    // if (post.attachment) {
    //     const img = document.createElement('img');
    //     img.src = post.attachment;
    //     file.appendChild(img);
    // }
    replyBtn.textContent = "Reply";
    // replyBtn.dataset.postid = post.id;
    // replyBtn.dataset.postcontent = post.content;
    // replyBtn.addEventListener('click', replyToPost);
}