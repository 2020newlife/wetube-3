const prefix_user = "/user"
const urls = {
    home: "/",
    login: "/login",
    logout: "/logout",
    join: "/join",
    search: "/search",

    user: {
        editProfile: prefix_user + "/editProfile",
        changePassword: prefix_user + "/changePassword",
    }


}

export default urls;