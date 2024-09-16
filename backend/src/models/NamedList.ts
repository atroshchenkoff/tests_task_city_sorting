import mongoose, { Document, Schema } from 'mongoose';
import { ICity } from './City';

export interface INamedList extends Document {
  name: string;
  shortName: string;
  cities: ICity['_id'][];
  color: string;
}

const NamedListSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  shortName: { type: String, required: true, unique: true },
  cities: [{ type: Schema.Types.ObjectId, ref: 'City' }],
  color: { type: String, required: true },
});

export default mongoose.model<INamedList>('NamedList', NamedListSchema);
