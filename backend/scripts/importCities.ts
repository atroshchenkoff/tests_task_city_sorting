import mongoose from 'mongoose';
import dotenv from 'dotenv';
import City from '../src/models/City';
import cities from './ru_cities.json';

dotenv.config();

const importCities = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    await City.deleteMany({});

    for (const city of cities) {
      await City.create({
        name: city.name,
        foundationDate: new Date(city.foundationDate)
      });
      console.log(`Imported ${city.name}`);
    }

    console.log('All cities have been imported successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error importing cities:', error);
    process.exit(1);
  }
};

importCities();
