document.addEventListener('DOMContentLoaded', function() {
    load()
})



// let counter = 1;
// const quantity = 10;

function load() {
    // const start = counter;
    // const end = start + quantity - 1;
    // counter = end + 1;
    // fetch(`posts/?start=${start}&end=${end}`)
    fetch(`api`)
        .then(response => response.json())
        .then(data => {
            data.forEach(add_post);
        })
}


function load_profile(username) {
    // console.log(`workin for ${username.id}`);
    document.querySelector('#posts').style.display = 'none';
    document.querySelector('#new-post').style.display = 'none';
    div_profile = document.createElement('div');
    document.querySelector('body').append(div_profile);
    div_profile.innerHTML = `<h1 id="username-profile">${username.id}&nbsp;&nbsp;</h1>`
    fetch(`profile/${username.id}`)
        .then(response => response.json())
        .then(data => {
            // data.forEach(console.log(data));
            console.log(data);
            let followers = document.createElement('p');
            followers.innerHTML = `Followers: ${data['followers']}`;
            function profile_post(array) {
                let post = document.createElement('div');
                post.innerHTML = `<p>${array['date']}</p><p>${array['text']}</p><br>`
                div_profile.append(post);
            }
            div_profile.append(followers);
            data['posts'].forEach(profile_post);

            if (username.id !== data['request_user']) {
                console.log('usuarios diferentes')
                const follow_btn = document.createElement('button');
                follow_btn.id = 'follow-btn'
                follow_btn.className = "btn btn-primary btn-sm active"
                let username_p = document.querySelector('#username-profile');
                username_p.appendChild(follow_btn);
                console.log(data['following_status'])
                follow_btn.addEventListener('click', () => {
                    follow_btn.className = "btn btn-success btn-sm"
                    follow_btn.classList.add('disabled')
                    if (follow === true) {
                        follow_btn.textContent = 'unfollowed'
                    } else {
                        follow_btn.textContent = 'followed'
                    }
                });
                // TODO: hacer la funcion del botton, para el mismo elemento follow/unfollow
                let follow
                if (data['following_status'] == true) {
                    follow_btn.appendChild(document.createTextNode("unfollow"));
                    follow = true
                } else {
                    follow_btn.appendChild(document.createTextNode("follow"));
                    follow = false
                }
            fetch(`follow/${username.id}`, {
                method: 'POST',
                body: JSON.stringify({
                    "follow": follow
                })
            })
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                })
            }
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
    let date = new Date(post.date)
    let hour = date.getHours()
    let minutes = date.getMinutes()
    let day = date.getDate()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
    let month = monthNames[date.getMonth()]
    let year = date.getFullYear()
    let post_date = `${hour}:${minutes} ${day} ${month} ${year}`;
    console.log(date);
    div_post.innerHTML = `<p id="${post.user}"><a href="javascript:;" onclick="load_profile(${post.user});"><strong class="username">${post.user}</strong></a> @ ${post_date} posted:</p><p class="text">${post.text}</p><p class="likes">Likes: ${likes}</p>`;
    document.querySelector('#posts').append(div_post);
}


