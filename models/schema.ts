import mongoose, { Schema } from "mongoose";

const userSchema=new Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        mobileNumber: {
            type: String,
            required: false,
        },
        gender: {
            type: String,
            required: false,
        },
        dateOfBirth: {
            type: String,
            required: false,
        },
        password:{
            type:String,
            required:false,
        },
        status:{
            type:String,
            enum: ["active", "inactive"],
            default: "active",
            required: true,
        },
        modifiedAt: {
            type: Date,
            default: Date.now,
          },
        roles: {
            type: [String],
            enum: ["admin", "user","manager"],
            default:["user"],
            required: true,
          },
          isDeleted: {
            type: Boolean,
            default: false,
          },
          provider: {
            type: String,
            enum: ["credentials", "google", "github"],
            default: "credentials",
            required: true,
          },
          profilePicture: {
            type: String,
            required: false,
          },
          resetToken:{
            type: String,
            required: false
          },
          resetTokenExpiry:{
            type: Date,
            required: false
          }
    },

    {timestamps:true}
)

const User=mongoose.models.User||mongoose.model("User",userSchema)
export default User