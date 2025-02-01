const axios = require('axios');
const cheerio = require('cheerio');
const OpenAI = require('openai');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Replace with your actual API key and list ID
const HUBSPOT_API_KEY = 'your-hubspot-api-key';
const LIST_ID = 'your-list-id';

// OpenAI API configuration
const OPENAI_API_KEY = 'your-openai-api-key'; // Replace with your OpenAI API key
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

// HubSpot API URL for fetching contacts from a list
const hubspotUrl = `https://api.hubapi.com/contacts/v1/lists/${LIST_ID}/contacts/all`;

// CSV Writer setup
const csvWriter = createCsvWriter({
    path: 'contacts.csv',
    header: [
        { id: 'firstName', title: 'Lead First Name' },
        { id: 'lastName', title: 'Lead Last Name' },
        { id: 'email', title: 'Lead Email' },
        { id: 'domain', title: 'Company Domain' },
        { id: 'description', title: 'Company Description' }
    ]
});

async function fetchContacts() {
    try {
        const response = await axios.get(hubspotUrl, {
            headers: {
                'Authorization': `Bearer ${HUBSPOT_API_KEY}`
            }
        });
        const contacts = response.data.contacts;
        const records = [];

        for (const contact of contacts) {
            const email = contact['identity-profiles'][0].identities.find(identity => identity.type === 'EMAIL').value;
            const firstName = contact.properties.firstname ? contact.properties.firstname.value : 'N/A';
            const lastName = contact.properties.lastname ? contact.properties.lastname.value : 'N/A';
            const emailDomain = email.split('@')[1];

            console.log(`Visiting website: ${emailDomain}`);
            const description = await getWebsiteDescription(emailDomain);
            console.log(`Description for ${emailDomain}: ${description}`);

            records.push({
                firstName,
                lastName,
                email,
                domain: emailDomain,
                description
            });
        }

        await csvWriter.writeRecords(records);
        console.log('CSV file was written successfully');
    } catch (error) {
        console.error('Error fetching contacts:', error);
    }
}

async function getWebsiteDescription(domain) {
    try {
        const response = await axios.get(`http://${domain}`);
        const $ = cheerio.load(response.data);

        const title = $('title').text();
        const metaDescription = $('meta[name="description"]').attr('content');

        const prompt = `Describe what the company does based on the following information:\nTitle: ${title}\nDescription: ${metaDescription}`;

        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: 'user', content: prompt }],
        });

        return aiResponse.choices[0].message.content.trim();
    } catch (error) {
        console.error(`Error fetching website for ${domain}:`, error);
        return 'Unable to retrieve description.';
    }
}

fetchContacts();
