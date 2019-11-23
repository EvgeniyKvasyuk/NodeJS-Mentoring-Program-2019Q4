import path from 'path';
import csv from 'csvtojson';
import fs from 'fs';

import {paths} from '../constants';

const convertingFilePath = path.resolve(paths.csv, 'node_mentoring_t1_2_input_example.csv');
const convertedFilePath = path.resolve(paths.txt, 'converted_result.txt');

const convertStream = () => {
  const readStream = fs.createReadStream(convertingFilePath);
  const writeStream = fs.createWriteStream(convertedFilePath);

  readStream.on('error', (error) => console.log('Возникла ошибка при чтении!', error.toString()));
  writeStream.on('error', (error) => console.log('Возникал ошибка при записи!', error.toString()));
  readStream.pipe(csv()).pipe(writeStream);
};

const convertRegular = () => {
  csv().fromFile(convertingFilePath)
    .then(json => {
      const result = json.reduce((acc, current) => `${acc}${JSON.stringify(current)}\n`,'');
      fs.writeFile(
          convertedFilePath,
          result,
          error => {if (error) {
            console.log('Возникла ошибка при записи', error.toString())
          }}
      )
    })
    .catch(error => console.log(error.toString()));
};

const convert = (type) => {
  if (!fs.existsSync(paths.txt)){
    fs.mkdirSync(paths.txt, { recursive: true });
  }

  if (type === 'stream') {
    convertStream()
  } else {
    convertRegular();
  }
};

convert(process.argv[2]);



