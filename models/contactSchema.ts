import mongoose, { Schema } from "mongoose";

const contactSchema=new Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
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
        phone:{
            type:String,
            required:true,
        }

    },
    {timestamps:true}
)

const Contact=mongoose.models.Contact||mongoose.model("Contact",contactSchema)
export default Contact