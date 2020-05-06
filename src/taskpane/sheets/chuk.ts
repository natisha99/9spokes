const fetch = require('node-fetch');
const API_KEY = process.env.chuk_api_key // please make sure you put api key into environment variables.

export async function getCompanyInfo(company_number: string) {

    // Ref: https://developer.companieshouse.gov.uk/api/docs/company/company_number/readCompanyProfile.html
    try {
        var res = await fetch('https://api.companieshouse.gov.uk/company/' + company_number, {
            method: 'GET',
            headers: {authorization: 'Basic ' + API_KEY}
        })
    } catch (e) { // Network Error
        console.log(e)
        return undefined
    }
    if (!res.ok) {
        console.log('API ERROR, ' + 'HTTP STATUS: ' + res.status) //API Error
    } else return res.json()


}

export async function searchCompanies(company_name: string) {

    // Ref: https://developer.companieshouse.gov.uk/api/docs/search/companies/companysearch.html
    try {
        var res = await fetch('https://api.companieshouse.gov.uk/search/companies?q=' + company_name + '&items_per_page=20', {
            method: 'GET',
            headers: {authorization: 'Basic ' + API_KEY}
        })
    } catch (e) { // Network Error
        console.log(e)
        return undefined
    }
    if (!res.ok) {
        console.log('API ERROR, ' + 'HTTP STATUS: ' + res.status) //API Error
    } else return res.json()

}

export async function getPersonsWithSignificantControl(company_number: string) {

    // Ref: https://developer.companieshouse.gov.uk/api/docs/company/company_number/persons-with-significant-control/listPersonsWithSignificantControl.html

    try {
        var res = await fetch('https://api.companieshouse.gov.uk/company/' + company_number + '/persons-with-significant-control', {
            method: 'GET',
            headers: {authorization: 'Basic ' + API_KEY}
        })
    } catch (e) { // Network Error
        console.log(e)
        return undefined
    }
    if (!res.ok) {
        console.log('API ERROR, ' + 'HTTP STATUS: ' + res.status) //API Error
    } else return res.json()

}

// You can have a test on these function below!
// getCompanyInfo("OC391410").then(result => console.log(result))
// searchCompanies("Telegram").then(result => console.log(result))
// getPersonsWithSignificantControl("OC391410").then(result => console.log(result))