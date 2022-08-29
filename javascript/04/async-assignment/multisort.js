const fs = require('fs')

/**
 * create a file sorted.txt will all the numbers from 1.txt, 2.txt and 3.txt
 * combined and sorted. 
 * 
 * Eg. if 1.txt has 3, 12 , 14 
 *        2.txt has 6, 23, 11
 * 
 * Then sorted.txt should have 3, 6, 11, 12, 14, 23
 * 
 * NOTE: You can NOT use readFileSync or writeFileSync 
 */

const getFilePath = fileName => __dirname + `/${fileName}`;
const writeFileAsync = (fileName, data) => new Promise((resolve, reject) => {
  fs.writeFile(getFilePath(fileName), data, err => err ? reject(err) : resolve(true));
});
const readFileAsync = fileName => new Promise((resolve, reject) => {
  fs.readFile(getFilePath(fileName), (err, data) => err ? reject(err) : resolve(data.toString()));
});

const getReducedListWithNewLines = list => list.reduce((acc, currVal) => acc + currVal + '\n', '');
const splitByNewline = str => str.split('\n').map(el => Number(el));
const OUTPUT_FILE = 'sorted.txt';
const FILES = ['1.txt', '2.txt', '3.txt'];
const sortElementsInFiles = async () => {
  const [fileOne, fileTwo, fileThree] = FILES;

  /**
   * Using individual awaits on each readFileAsync
   */
  const fileOneData = splitByNewline(await readFileAsync(fileOne));
  const fileTwoData = splitByNewline(await readFileAsync(fileTwo));
  const fileThreeData = splitByNewline(await readFileAsync(fileThree));
  const allFilesDataSorted = [...fileOneData, ...fileTwoData, ...fileThreeData].sort((a, b) => a - b);
  await writeFileAsync(OUTPUT_FILE, getReducedListWithNewLines(allFilesDataSorted));

  /**
   * Using Promise.all()
   */
  const unfilteredData = await Promise.all([readFileAsync(fileOne), readFileAsync(fileTwo), readFileAsync(fileThree)]);
  const filteredData = unfilteredData.map(data => data.match(/[0-9]+/g));
  const flattenedFilteredData = filteredData.reduce((acc, currArr) => [...acc, ...currArr], []);
  const flattenedSortedList = flattenedFilteredData.sort((a, b) => Number(a) - Number(b));
  await writeFileAsync('PromiseAllSorted.txt', getReducedListWithNewLines(flattenedSortedList));
};

(async () => {
  try {
    await sortElementsInFiles();
  } catch (err) {
    console.log(err);
    throw err;
  }
})();
