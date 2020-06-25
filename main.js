const axios = require('axios');
const HTMLtoDOCX = require('html-to-docx');
const fs = require('fs')
const readline = require('readline');
const { prompt } = require('enquirer');
const cheerio = require('cheerio');


const getDocx = async () => {
    const response = await prompt({
        type: 'input',
        name: 'url',
        message: 'Paste page URL'
    });
    const url = response.url
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

        const airportCode = $('div>span', item).text();
        const airportName = $('div>a>span', item).text();
        airportCheerioObject.append(`<p class="xsxsxs">(${airportCode}) ${airportName}</p>`);
    });
    const fileBuffer = await HTMLtoDOCX($.html());
    fs.writeFileSync(filePath, fileBuffer);
    console.log('DONE!')
};


getDocx();
