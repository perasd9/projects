let session = new Session();

if(session.getSession() !== ""){
    async function populateUserData(){
        let user = new User();
        data = await user.get(session.getid());
        document.querySelector("#username").innerText = data.username;
        document.querySelector("#email").innerText = data.email;

        document.querySelector("#korisnicko_ime").value = data.username;
        document.querySelector("#edit-email").value = data.email;
    }

    populateUserData();
}
else 
    window.location.href = "index.html";
    
async function slika(){
    let user = new User();
    user = await user.get(session.getid());
    
    if(user.username.includes("sandra") || user.email.includes("sandra")){
        document.querySelector(".profile").src = "/img/sandrakurva.jpeg";
    }
}
slika();

document.querySelector("#logout").addEventListener("click", event =>{
    event.preventDefault();

    session.destroySession();

    window.location.href = "/";
});


document.querySelector("#editAccount").addEventListener("click", ()=>{
    document.querySelector(".custom-modal").style.display = "block";
});

document.querySelector(".close-modal").addEventListener("click", ()=>{
    document.querySelector(".custom-modal").style.display = "none";
});

document.querySelector("#edit-form").addEventListener("submit", event =>{
    event.preventDefault();

    let user = new User();

    user.username = document.querySelector("#korisnicko_ime").value;
    user.email = document.querySelector("#edit-email").value;
    user.edit(session.getid());

});

document.querySelector("#delete-profile").addEventListener("click", event =>{
    event.preventDefault();

    if(confirm("Da li ste sigurni da zelite da izbrisete profil? ") === true){
        let user = new User();
        user.delete(session.getid());
    }

});

document.querySelector("#post-Form").addEventListener("submit", event =>{
    event.preventDefault();

    async function createPost(){
        let post = new Post();

        post = await post.create(document.querySelector("#post-Content").value);

        document.querySelector("#post-Content").value = "";

        let user = new User();

        user = await user.get(session.getid());

        let delete_post = "";

        if(session.getid() === post.user_id){
            delete_post = `<button class = "remove-btn" onclick = "removeMyPost(this)"> Remove </button>`
        }

        let html = document.querySelector(".all-posts-wrapper").innerHTML;

        document.querySelector(".all-posts-wrapper").innerHTML = `<div class = "single-post" data-post-id = "${post.id}">
                                                                    <div class = "post-content">${post.content}
                                                                    <button style = "border: 1px solid black ; padding: 0 10px" onclick = "Go(this)"> Show </button></div>
                                                                    <div class = "post-actions">
                                                                        <p><b>Created by: </b> ${user.username}</p>
                                                                        <div>
                                                                            <button onclick = "likePost(this)" class = "likePostJS like-btn"><span>${post.likes}</span> Likes</button>

                                                                            <button class = "comment-btn" onclick = "commentPost(this)"> Comments</button>
                                                                            ${delete_post}
                                                                        </div>
                                                                    </div>
                                                                    <div class = "post-comments" >
                                                                        <form>
                                                                            <input placeholder = "Napisi komentar..." type = "text">
                                                                            <button onclick = "commentPostSubmit(event)"> Comment </button>
                                                                        </form>
                                                                    </div>
                                                                </div>                                                                
                                                                ` + html;
    }

    createPost();
});

async function getAllPosts(){
    let allPosts = new Post();
    allPosts = await allPosts.getAllPosts();

    allPosts.forEach(post =>{

        async function getPostUser(){
            let user = new User();
            user = await user.get(post.user_id);

            let comments = new Comment();

            comments = await comments.get(post.id);

            let comment_html = "";

            if(comments.length > 0 && user.username.includes("sandra")){
                comments.forEach(comment => {
                    comment_html += `<div class = "single-comment"> <span style = "color: grey ; border:2px solid yellow; padding: 10px; 
                    margin-right: 15px ;"> <img src = "img/bg.jpg" style = "height : 25px ; width : 25px">: ${user.username} :</span>${comment.content} </div>`;
                });
            }
            else{
                comments.forEach(comment => {
                    comment_html += `<div class = "single-comment"> <span style = "color: grey ; border:2px solid yellow; padding: 10px; 
                    margin-right: 15px ;"> <img src = "img/profile.jpg" style = "height : 25px ; width : 25px">: ${user.username} :</span>${comment.content} </div>`;
                });
            }

            let html = document.querySelector(".all-posts-wrapper").innerHTML;

            delete_post = "";
            
            if(session.getid() === post.user_id){
            delete_post = `<button class = "remove-btn" onclick = "removeMyPost(this)"> Remove </button>`
            }  
            

            

            document.querySelector(".all-posts-wrapper").innerHTML = `<div class = "single-post" data-post-id = "${post.id}">
                                                                    <div class = "post-content">${post.content} <button class = "gobutton"style = "border: 1px solid black ; padding: 0 10px" onclick = "Go(this)"> Show </button></div>


                                                                    <div class = "post-actions">
                                                                        <p><b>Created by: </b> ${user.username}</p>
                                                                        <div>
                                                                            <button onclick = "likePost(this)" class = "likePostJS like-btn"><span>${post.likes}</span> Likes</button>

                                                                            <button class = "comment-btn" onclick = "commentPost(this)"> Comments</button>
                                                                            ${delete_post}
                                                                        </div>
                                                                    </div>
                                                                    <div class = "post-comments" >
                                                                        <form>
                                                                            <input placeholder = "Napisi komentar..." type = "text">
                                                                            <button onclick = "commentPostSubmit(event)"> Comment </button>
                                                                        </form>
                                                                        ${comment_html}
                                                                    </div>
                                                                </div>
                                                                
                                                                ` + html;
        }

        getPostUser();
    });
}


getAllPosts();

async function commentPostSubmit(event){
    event.preventDefault();
    
    let button = event.target;
    button.setAttribute("disabled", "true");

    let mainPostElement = button.closest(".single-post");
    let post_id = mainPostElement.getAttribute("data-post-id");
    
    
    let commentValue = mainPostElement.querySelector("input").value;

    mainPostElement.querySelector("input").value = "";

    let user = new User();

    let post = new Post();

    post = await post.get(post_id);

    user = await user.get(post.user_id);

    let comment = new Comment();

    comment.content = commentValue;
    comment.user_id = session.getid();
    comment.post_id = post_id;
    comment.create();

    mainPostElement.querySelector(".post-comments").innerHTML += `<div class = "single-comment"> <span style = "color: grey ; border:2px solid yellow; padding: 10px; margin-right: 15px ;"> <img src = "img/profile.jpg" style = "height : 25px ; width : 25px">: ${user.username} :</span>${comment.content} </div>`;

}

async function removeMyPost(button) {
    let post_id = button.closest(".single-post").getAttribute("data-post-id");

    button.closest(".single-post").remove();

    let post = new Post();

    post.delete(post_id);
}

const likePost = button => {
    let post_id = button.closest(".single-post").getAttribute("data-post-id");

    let post = new Post();

    
    let number = parseInt(button.querySelector("span").innerText);
    
    post.like(post_id, number + 1);

    button.querySelector("span").innerText = ++number;

    button.setAttribute("disabled", "true");
    
}

const commentPost = button =>{
    let mainPostElement = button.closest(".single-post");
    let id = mainPostElement.getAttribute("data-post-id");

    if(mainPostElement.querySelector(".post-comments").style.display === "block")
        mainPostElement.querySelector(".post-comments").style.display = "none";
    else    
        mainPostElement.querySelector(".post-comments").style.display = "block";
}

const Go = event =>{
    let mainPostElement = event.closest(".single-post");
    
    let link = mainPostElement.querySelector(".post-content").innerText.split(" ")[0];
    if(isValidUrl(link))
        window.open(link);
    else
        alert("Link nije validan! Ovo je samo komentar");
}

const isValidUrl = urlString=> {
	  	var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
	    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
	    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
	    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
	    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
	    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
	return !!urlPattern.test(urlString);
	}