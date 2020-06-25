const axios = require('axios');
const HTMLtoDOCX = require('html-to-docx');
const fs = require('fs')
const readline = require('readline');
const { prompt } = require('enquirer');
const cheerio = require('cheerio');

const getDocx = async (url) => {
    // const response = await prompt({
    //     type: 'input',
    //     name: 'url',
    //     message: 'Paste page URL'
    // });
    // const url = response.url
    console.log(`>>Processing ${url}`)
    let tmpUrlSplitArray = url.split('/')
    const filePath = `./documents/${tmpUrlSplitArray[tmpUrlSplitArray.length-1]}.docx`

    const res = await axios.get(url);
    const htmlData = res.data;
    const $ = cheerio.load(htmlData);
    const excludedElementSelectors = [
        'header',
        'main > section:first-child',
        '.Hotels-Cityguides-CityGuidesWhatToDo .cityGuidesRight',
        '.component',
        '.whenToVisitChartsContainer',
        '.col-l+ .col-l h4',
        '.Hotels-Cityguides-CityGuidesHowToGetAround .cityGuidesRight',
        'footer'
    ]
    $(excludedElementSelectors.join(',')).remove();
    const airportCheerioObject = $('.Hotels-Cityguides-CityGuidesHowToGet .cityGuidesRight>.keel-grid>div:first-child')
    $('.Hotels-Cityguides-CityGuidesHowToGet .airport-item').each((i, item) => {
        // const airportCode = $(this).find('div>span').text;
        // const airportName = $(this).find('div>a>span').text;
        //CHEERIO HAS DECODING PROBLEMS. DO NOT USE EXTERNAL LIBRARY TO DECODE URL ENCODED STRINGS
        const airportCode = $('div>span', item).text();
        const airportName = $('div>a>span', item).text();
        airportCheerioObject.append(`<p class="xsxsxs">(${airportCode}) ${airportName}</p>`);
    });
    const fileBuffer = await HTMLtoDOCX($.html());
    fs.writeFileSync(filePath, fileBuffer);
};

const inputData = fs.readFileSync('./input.txt', 'utf8').replace(/\r/g, '')
const urlsArray = inputData.split('\n').filter(item=>!!item)
console.log(urlsArray)
urlsArray.forEach(url=>getDocx(url).catch(err=>console.error(err)));
console.log('DONE!')
