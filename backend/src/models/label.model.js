
import mongoose, {Schema} from "mongoose";

const labelSchema = new Schema(
    {
        label_title: {
            type: String,
            required: true
          },
          userid: {
            type: String,
            required:true
          },  
          noteid: {
            type: String,
          }, 
          listOfNote:{
            type:[{type:mongoose.Types.ObjectId, ref:"notes"}]
          }   
    },
    {
        timestamps: true
    }
)
export const Label = mongoose.model("labels", labelSchema)
