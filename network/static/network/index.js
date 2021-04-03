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
            let number_of_posts = data.length;
            let next = true;
            let page = 1;
            let i = 0;
            only_ten()
            function only_ten() {
                if (next == true && i < page * 10) {
                    if (i < number_of_posts) {
                        add_post(data[i])
                        i += 1
                        // console.log(`rep number ${i}`)
                        only_ten()
                }}
                next = false
            }
            console.log(i)

            function fnext_button() {
                next_button = document.createElement('button');
                next_button.className = "btn btn-primary btn-sm active";
                next_button.appendChild(document.createTextNode("next"))
                document.querySelector('#posts').appendChild(next_button);
                next_button.addEventListener("click", next_page)
            }
            function fprev_button() {
                prev_button = document.createElement('button');
                prev_button.className = "btn btn-primary btn-sm active";
                prev_button.appendChild(document.createTextNode("prev"))
                document.querySelector('#posts').appendChild(prev_button);
                prev_button.addEventListener("click", prev_page)
            };
            fnext_button()

            function next_page() {
                console.log('ejectando next_page')
                page += 1;
                next = true
                document.querySelector('#posts').innerHTML = "";
                only_ten()
                if (i > 10) {
                    console.log(`${i} es mayor que 10, ejecutando prev_button() (en next_page)`)
                    fprev_button()
                }
                if (number_of_posts > i ) {
                    console.log(`${number_of_posts} es mayor que ${i}, ejecutando next_button() (en next_page)`)
                    fnext_button()
                }
            }
            function prev_page() {
                console.log('ejectando prev_page')
                page = page - 1
                console.log(`page ${page}`)
                console.log(`antes del math.floor ${i}`)
                if (i <= 10) {
                    i = 0
                } else {
                    i = (Math.floor((i - 11 )/10)) * 10
                }
                console.log(`despues del math.floor ${i}`)
                next = true
                document.querySelector('#posts').innerHTML = "";
                only_ten()
                if (i > 10) {
                    console.log(`${i} es mayor que 10, ejecutando prev_button() (en prev_page)`)
                    fprev_button()
                }
                if (number_of_posts > i ) {
                    console.log(`${number_of_posts} es mayor que ${i}, ejecutando next_button() (en prev_page)`)
                    fnext_button()
                }
            }
        });
}


function load_profile(username) {
    blank_page()
    // console.log(`workin for ${username.id}`);
    // document.querySelector('#posts').style.display = 'none';
    // document.querySelector('#new-post').style.display = 'none';
    div_profile = document.createElement('div');
    div_profile.id = 'div_profile';
    document.querySelector('.body').append(div_profile);
    div_profile.innerHTML = `<h1 id="username-profile">${username.id}&nbsp;&nbsp;</h1>`
    fetch(`profile/${username.id}`)
        .then(response => response.json())
        .then(data => {
            // data.forEach(console.log(data));
            // console.log(data);
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
                // console.log('usuarios diferentes')
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
                });
                let follow
                if (data['following_status'] == true) {
                    follow_btn.appendChild(document.createTextNode("unfollow"));
                    follow = true
                } else {
                    follow_btn.appendChild(document.createTextNode("follow"));
                    follow = false
                }
            // fetch(`follow/${username.id}`, {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         "follow": follow
            //     })
            // })
            //     .then(response => response.json())
            //     .then(result => {
            //         console.log(result)
            //     })
            }
        })
}


function add_post(post) {
    // console.log(post);
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
    // console.log(date);
    div_post.innerHTML = `<br><p id="${post.user}"><a href="javascript:;" onclick="load_profile(${post.user});"><strong class="username">${post.user}</strong></a> @ ${post_date} posted:</p><p class="text">${post.text}</p><p class="likes">Likes: ${likes}</p>`;
    document.querySelector('#posts').append(div_post);
}


function blank_page() {
    let blank_body = document.querySelector('.body').children;
    for (let i = 0; i < blank_body.length; i++) {
        blank_body[i].style.display = "none";
    }
}


function following_page() {
    blank_page()
    // let blank_body = document.querySelector('.body').children;
    // for (i = 0; i < blank_body.length; i++) {
    //     // blank_body[i].style.visibility = "hidden";
    //     blank_body[i].style.display = "none";
    // }
    function following_posts(data) {
        // console.log(data)
        for (user in data) {
            for (post in data[user]) {


                let puser = user
                let pid = data[user][post].id
                let pdate = data[user][post].date
                let ptext = data[user][post].text
                let plikes = data[user][post].likes
                // console.log(`${puser} @ ${date.getMinutes()} posted ${text} get ${likes} likes`)



                const div_post = document.createElement('div');
                div_post.className = 'post';
                div_post.id = pid;
                let likes = 0;
                if (plikes.length > 0) {
                    likes = plikes.length;
                }
                let date = new Date(pdate)
                let hour = date.getHours()
                let minutes = date.getMinutes()
                let day = date.getDate()
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];
                let month = monthNames[date.getMonth()]
                let year = date.getFullYear()
                let post_date = `${hour}:${minutes} ${day} ${month} ${year}`;
                // console.log(date);
                div_post.innerHTML = `<br><p id="${puser}"><a href="javascript:;" onclick="load_profile(${puser});"><strong class="username">${puser}</strong></a> @ ${post_date} posted:</p><p class="text">${ptext}</p><p class="likes">Likes: ${likes}</p>`;
                document.querySelector('#following-posts').style.display = 'block'
                document.querySelector('#following-posts').append(div_post);




            }
            // data[user].forEach( () => {
                // console.log(data[user])
                // console.log(user)





                // console.log(text)


            // })
        }

        // data.forEach(console.log)
    }
    fetch('following')
        .then(response => response.json())
        .then(following_data => {
            // console.log(following_data['post']);
            following_posts(following_data['post']);
            // following_data['post'].forEach(following_posts);
        });
}


function own_profile() {
    // console.log('funcionando')
}


