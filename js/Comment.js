class Comment{
    post_id = "";
    user_id = "";
    content = "";
    api_url = "https://634ad4da33bb42dca40c3460.mockapi.io";

    create(){
        let data = {
            post_id : this.post_id,
            user_id : this.user_id,
            content : this.content
        };
        data = JSON.stringify(data);

        fetch(this.api_url + "/comments", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body : data
        })
        .then(response => response.json())
        .then(data => {
            
        });
    }

    async get(post_id){
        let api_url = this.api_url + "/comments";

        let response = await fetch(api_url);
        let data = await response.json();
        let postComments = [];

        let i = 0;

        data.forEach(item => {
            if(item.post_id === post_id)
                postComments[i++] = item;
        }); 

        return postComments;
    }
}