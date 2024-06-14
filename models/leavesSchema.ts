import mongoose, { Schema } from "mongoose";

const leavesSchema=new Schema(
    {
        date:{
            type:Date,
            required:true
        },
        numberofleaves:{
            type:Number,
            required:true
        },
        numberofDays:{
            type:Number,
            required:true
        },
        status:{
            type:String,
            enum: ["approved", "rejected"],
            default: "rejected",
            required: true,
        },
        modifiedAt: {
            type: Date,
            default: Date.now,
          },
        
          
    },
    {timestamps:true}
)

const Leaves=mongoose.models.Leaves||mongoose.model("User",leavesSchema)
export default Leaves;