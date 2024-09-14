import mongoose, { Document, Schema } from 'mongoose';

export interface ICity extends Document {
  name: string;
  foundationDate: Date;
}

const CitySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  foundationDate: { type: Date, required: true },
});

export default mongoose.model<ICity>('City', CitySchema);
