
import mongoose, {Schema} from "mongoose";

const noteSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
          },

        description: {
            type: String,
          },
        color: {
            type: String,
          },
        pin: {
            type: Boolean,
            default: false,
          },    
        trash: {
            type: Boolean,
            default: false,
          } ,
        archive: {
            type: Boolean,
            default: false,
        } ,
        isReminder: {
          type: Boolean,
          default: false,
        },

        reminder: {
            type: String,
          },
          
        userid: {
            type: String,
          },  
        collabrators: {
            type: [String],
          },  
        listOfLabels:{
            type:[{type:mongoose.Types.ObjectId, ref:"labels"}]
          } 
    
    },
    {
        timestamps: true
    }
)
export const Note = mongoose.model("notes", noteSchema)


