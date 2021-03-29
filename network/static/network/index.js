document.addEventListener('DOMContentLoaded', function() {
    load()
    })


let counter = 1;
const quantity = 10;

function load() {
    const start = counter;
    const end = start + quantity - 1;
    counter = end + 1;
    fetch(`/?start=${start}&end=${end}`)
        .then(response => response.json())
        .then(data => {
            data.post.forEach(add_post);
        })
}

function add_post(contents) {
    const post = document.createElement('div');
    post.className = 'post';
    post.innerHTML = contents;
    document.querySelector('#posts').append(post);
}