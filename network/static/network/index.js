document.addEventListener('DOMContentLoaded', function() {
    load()
    })


let counter = 1;
const quantity = 10;

function load() {
    const start = counter;
    const end = start + quantity - 1;
    counter = end + 1;
    // fetch(`posts/?start=${start}&end=${end}`)
    fetch(`api`)
        .then(response => response.json())
        .then(data => {
            // TODO: order de data from the lastest to the newest
            data.forEach(add_post);
        })
}

function add_post(post) {
    console.log(post);
    const div_post = document.createElement('div');
    div_post.className = 'post';
    div_post.id = post.id;
    let likes = 0;
    if (post.likes.length > 0) {
        likes = post.likes.length;
    }
    div_post.innerHTML = `<p class="username"><strong>${post.user}</strong> posted:</p><p class="text">${post.text}</p><p class="likes">Likes: ${likes}</p>`;
    document.querySelector('#posts').append(div_post);

}