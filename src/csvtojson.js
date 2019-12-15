/* eslint-disable no-console */
import path from 'path';
import csv from 'csvtojson';
import fs from 'fs';
import util from 'util';

import { paths } from '../constants';

const asyncStat = util.promisify(fs.stat);
const asyncWrite = util.promisify(fs.writeFile);
const asyncMkdir = util.promisify(fs.mkdir);

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
    return asyncWrite(
      convertedFilePath,
      result
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
        console.log('Конвертация не удалась');
        return Promise.reject();
      });
  }

  return convertRegular()
    .then(() => {
      console.log('Конвертация прошла');
      return Promise.resolve();
    })
    .catch(() => {
      console.log('Конвертация не удалась');
      return Promise.reject();
    });

};

const convert = async () => {
  try {
    await asyncStat(paths.txt);
  } catch {
    await asyncMkdir(paths.txt, { recursive: true });
  }

  const convertResult = await callConvert();

  return convertResult;
};

convert()
  .then(() => { console.log('Закончено'); })
  .catch(() => { console.log('Что то пошло не так'); });
