import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
	email: {
		type: String,
		unique: [true, 'Email already exists!'],
		required: [true, 'Email is required'],
	},
	username: {
		type: String,
		required: [true, 'Username is required!'],
		// Modified regex to ensure alphanumeric, dots, and underscores but no consecutive dots or underscores
		// match: [/^(?=.{8,20}$)[a-zA-Z0-9]+(?:[._][a-zA-Z0-9]+)*$/, "Username invalid, it should contain 8-20 alphanumeric characters, and no consecutive or trailing special characters!"],
		unique: true // Enforce uniqueness for username
	},
	image: {
		type: String,
	}
});

const User = models.User || model("User", UserSchema);

export default User;
