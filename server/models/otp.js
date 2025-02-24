const mongoose = require("mongoose");
const mailSender = require("../utils/mailsender");


const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5,    // auto-Delete doc after  5 min
    }
});


async function sendVerificationEmail(email, otp) {
    try{

        const mailBody = `Your OTP for Account Verification is ${otp}`;

        const mailResponse = await mailSender(
            email,
            "Verification Email",
            mailBody
        );
        console.log("Verification Email sent successfully");
        
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}


// post-save hook to send email after the document has been saved
OTPSchema.pre("save", async function (next) {

	console.log("New document saved to database");
    
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});

module.exports = mongoose.model("OTP", OTPSchema);
