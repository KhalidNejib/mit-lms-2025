import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from "bcryptjs"

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
 
  role: 'student' | 'instructor' | 'admin' | 'content_manager';
  refreshTokens:string[];
  resetPasswordToken: string;
  resetPasswordExpires: Date;
 avatar?: string;
  bio?: string;
  dateOfBirth?: Date;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
  isActive: boolean;
  lastLogin?: Date;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  createdAt: Date;
  updatedAt: Date;

  // ✅ Custom methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  toSafeObject(): Partial<IUser>;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin', 'content_manager'],
      default: 'student',
    },
     refreshTokens: {       
      type: [String],
      default: []
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
   
    avatar: { type: String },
    bio: { type: String },
    dateOfBirth: { type: Date },
    phone: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    preferences: {
      language: { type: String, default: 'en' },
      timezone: { type: String, default: 'UTC' },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
      },
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

// ✅ Custom Methods
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};


userSchema.methods.toSafeObject = function (): Partial<IUser> {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// ✅ Export model
export const User = mongoose.model<IUser>('User', userSchema);


