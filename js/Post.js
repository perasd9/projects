class Post{
    post_id = "";
    post_content = "";
    user_id = "";
    api_url = "https://634ad4da33bb42dca40c3460.mockapi.io";
    created = "";

    async create(post_content){
        let session = new Session();
        let date = new Date();

        const dateStr = date.toLocaleString('sr-RS', {
    timeZone: 'Europe/Belgrade'
})


        let data = {
            user_id: session.getid(),
            content: post_content, 
            likes: 0,
            created : dateStr
        }
        data = JSON.stringify(data);

        let respone = await fetch(this.api_url + "/posts", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: data
        });
        data = await respone.json();

        return data;
    }

    async getAllPosts(){
        let response = await fetch(this.api_url + "/posts");
        let data = await response.json();
        return data;
    }

    async delete(post_id){
        await fetch(this.api_url + "/posts/" + post_id, {
            method : "DELETE"
        })
        .then(response => response.json())
        .then(data =>{
        });
    }
    
    async get(post_id){
        let response = await fetch(this.api_url + "/posts/"+post_id);
        let data = await response.json();
        return data;
    }

    like(post_id, number){

        
        let data = {
            likes : number
        };
        data = JSON.stringify(data);


        fetch(this.api_url + "/posts/" + post_id,{
            method : "PUT",
            headers : {
                "Content-Type" : "application/json",
            },
            body : data
        })
        .then(response => response.json())
        .then(data =>{
            
        })

        
    }
}