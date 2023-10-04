import express from 'express';
import cors from 'cors'
import multer from 'multer';
import multerConfig from './config/multer';
import path from 'path';
import fs from 'fs';
import db from './database/database.json';

interface Database {
  profiles: Array<{
    id?: number,
    name: string,
    description: string,
    image?: string
  }>;
}

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

const database: Database = db;
const upload = multer(multerConfig);

app.post("/profiles", upload.single("image"), (request, response) => {
  const { name, description } = request.body;

  const databaseDirectory = path.join(__dirname, "database");

  if (!fs.existsSync(databaseDirectory)) {
    fs.mkdirSync(databaseDirectory);
  };

  const profile = {
    id: database.profiles.length + 1,
    name,
    description,
    image: request.file?.filename,
  };

  database.profiles.push(profile);


  fs.writeFileSync(path.join(databaseDirectory, "database.json"), JSON.stringify(database, null, 2));
  return response.status(201).json(profile);
  // response.json(newItem);
})

app.get("/profiles", (request, response) => {
  const { profiles } = database;

  const serializedProfiles = profiles.map(profile => {
    return {
      id: profile.id,
      name: profile.name,
      description: profile.description,
      image_url: `http://localhost:3333/uploads/${profile.image}`,
    }
  })

  response.json(serializedProfiles);
});

app.listen(3333, () => {
  console.log('Server is running');
});