class User{
    user_id = "";
    username = "";
    email = "";
    password = "";
    api_url = "https://634ad4da33bb42dca40c3460.mockapi.io";

    create(){
        let data = {
            username : this.username,
            email : this.email,
            password : this.password
        }

        data = JSON.stringify(data);

        fetch(this.api_url + "/users", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body : data
            
        })
        .then(response => response.json())
        .then(data =>{
            let session = new Session();

            session.user_id = data.id;
            
            session.startSession();
        
            window.location.href = "hexa.html";
            
        })
    }

    async get(user_id){
        let api_url = this.api_url + "/users/"+ user_id;

        let response = await fetch(api_url);
        let data = await response.json();
        
        return data;
    }

    edit(user_id){
        let data = {
            username : this.username,
            email : this.email
        };

        data = JSON.stringify(data);


        fetch(this.api_url + "/users/" + user_id,{
            method : "PUT",
            headers : {
                "Content-Type":"application/json"
            },
            body : data
        }).then(response => response.json())
        .then(data =>{
            window.location.href = "hexa.html";
        });
    }

    delete(user_id){
        fetch(this.api_url + "/users/" + user_id, {
            method : "DELETE"
        }).then(respone => respone.json())
        .then(data => {

            let session = new Session();
            session.destroySession();
            
            window.location.href = "/";
        })
    }


    login(){
        fetch(this.api_url + "/users")
        .then(response => response.json())
        .then(data => {

            let loginSuccesful = 0;

            data.forEach(db_user => {
            
                if(db_user.email === this.email && db_user.password === this.password){
                    loginSuccesful = 1;
                    let session = new Session();

                    session.user_id = db_user.id;

                    session.startSession();

                    window.location.href = "hexa.html";
                }
            });

            if(loginSuccesful == 0)
                alert("Pogresan email ili password");
        });
    }
}