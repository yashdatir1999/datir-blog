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
        default: "https://i.pinimg.com/564x/6c/cc/73/6ccc7364fddee013ccc20f659dc0b7be.jpg"
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
},{timestamps: true})

const User = mongoose.model('User', userSchema)

export default User
