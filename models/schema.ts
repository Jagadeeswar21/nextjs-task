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
        password: {
            type: String,
            required: false
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
        role: {
            type: String,
            enum: ["admin", "user"],
            required: true,
          },
          isDeleted: {
            type: Boolean,
            default: false,
          },
          provider: {
            type: String,
            enum: ["credentials", "google"],
            default: "credentials",
            required: true,
          },
    },

    {timestamps:true}
)

const User=mongoose.models.User||mongoose.model("User",userSchema)
export default User