import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user", 
        required: true 
    },

    docId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "doctor", 
        required: true 
    },

    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },

    // These are not required since you will use populate()
    userData: { type: Object },
    docData: { type: Object },

    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },

    healthInfo: { type: Object, default: {} }
})

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema)
export default appointmentModel
