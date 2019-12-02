/* eslint-disable no-console */
import path from 'path';
import csv from 'csvtojson';
import fs from 'fs';

import { paths } from '../constants';

const convertingFilePath = path.resolve(paths.csv, 'node_mentoring_t1_2_input_example.csv');
const convertedFilePath = path.resolve(paths.txt, 'converted_result.txt');

const convertStream = () => new Promise((resolve, reject) => {
  const readStream = fs.createReadStream(convertingFilePath);
  const writeStream = fs.createWriteStream(convertedFilePath);

  readStream.on('error', (error) => {
    console.error('Возникла ошибка при чтении!', error);
    return reject(error);
  });

  writeStream.on('error', (error) => {
    console.error('Возникла ошибка при записи!', error);
    return reject(error);
  });
  writeStream.on('finish', resolve);

  readStream.pipe(csv()).pipe(writeStream);
});

const convertRegular = () => csv().fromFile(convertingFilePath)
  .then((json) => {
    const result = json.reduce((acc, current) => `${acc}${JSON.stringify(current)}\n`, '');
    fs.writeFile(
      convertedFilePath,
      result,
      (error) => {
        if (error) {
          console.log('Возникла ошибка при записи', error.toString());
        }
      }
    );
  })
  .catch(error => console.log(error.toString()));

const callConvert = () => {
  if (process.argv[2] === 'stream') {
    return convertStream()
      .then(() => {
        console.log('Конвертация через Stream прошла');
        return Promise.resolve();
      })
      .catch(() => {
        console.log('Конвертация прошла');
        return Promise.reject();
      });
  }

  return convertRegular()
    .then(() => {
      console.log('Конвертация прошла');
      return Promise.resolve();
    })
    .catch(() => {
      console.log('Конвертация прошла');
      return Promise.reject();
    });

};

const convert = () => new Promise((resolve, reject) => {
  fs.stat(paths.txt, (err, stats) => {
    if (!stats) {
      fs.mkdir(paths.txt, { recursive: true }, () => {
        return callConvert()
          .then(() => resolve())
          .catch(() => reject());
      });
    } else {
      return callConvert()
        .then(() => resolve())
        .catch(() => reject());
    }
  });
});

convert()
  .then(() => { console.log('Закончено'); })
  .catch(() => { console.log('Что то пошло не так'); });
