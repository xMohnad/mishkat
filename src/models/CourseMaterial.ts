import mongoose, { Document, Model, Types } from "mongoose";

export enum CourseType {
  PRACTICAL = "عملي",
  THEORETICAL = "نظري",
}

export interface ICourseMaterial extends Document {
  _id: Types.ObjectId;
  level: number;
  term: number;
  course: string;
  title: string;
  course_id: number;
  message_id: number;
  from_chat_id: number;
  createdAt: Date;
}

const CourseMaterialSchema = new mongoose.Schema<ICourseMaterial>(
  {
    level: { type: Number, required: true },
    term: { type: Number, required: true },
    course: { type: String, required: true },
    title: { type: String, required: true },
    course_id: { type: Number, required: true },
    message_id: { type: Number, required: true },
    from_chat_id: { type: Number, required: true },
  },
  { collection: "CourseMaterial", timestamps: true },
);

CourseMaterialSchema.index({ course: 1, title: 1, level: 1, term: 1 });

const CourseMaterial: Model<ICourseMaterial> =
  mongoose.models.CourseMaterial ||
  mongoose.model<ICourseMaterial>("CourseMaterial", CourseMaterialSchema);

export default CourseMaterial;
