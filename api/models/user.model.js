import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    profilePicture:{
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fprofile-icon&psig=AOvVaw3vF8ww7HGVy-dNEA6ptNe6&ust=1706183437424000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCIib6uL69YMDFQAAAAAdAAAAABAD"
    }
},{timestamps: true})

const User = mongoose.model('User', userSchema)

export default User
