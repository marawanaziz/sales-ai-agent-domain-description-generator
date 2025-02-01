# Sales AI Agent - Analyze Leads Website + Get Summary

This project automates the process of retrieving lead records from HubSpot, extracting domains from email addresses, analyzing company websites, generating brief descriptions using AI, and exporting the enriched data into a CSV file.

## **Prerequisites**  
Ensure you have the following installed:  
- **Node.js** (v16 or later recommended)  
- **npm** or **yarn** (for package management)  

## **Installation & Setup**  

### **1. Clone the Repository**  
```bash
git clone https://github.com/your-repo/lead-enrichment-tool.git
cd lead-enrichment-tool
```

### **2. Install Dependencies**  
Run the following command to install the required packages:  
```bash
npm install
```
This will install:  
- `axios` (for API requests)  
- `cheerio` (for web scraping)  
- `openai` (for AI-based company description generation)  
- `csv-writer` (for exporting data)  

### **3. Configure API Keys**  
Replace the placeholder values in `hubspot-lead-list-info.js` with your actual API keys:  

#### **HubSpot API Key**  
```js
const HUBSPOT_API_KEY = 'your-hubspot-api-key';
```
Find your HubSpot API key in **HubSpot Developer Settings**.  

#### **OpenAI API Key**  
```js
const OPENAI_API_KEY = 'your-openai-api-key';
```
Get your OpenAI API key from **https://platform.openai.com/**.  

#### **HubSpot List ID**  
Update your HubSpot **LIST_ID** to match the lead list you want to process:  
```js
const LIST_ID = 'your-list-id';
```
You can find your **List ID** from HubSpot under **Contacts → Lists**.

### **4. Run the Script**  
Execute the script to fetch and process leads:  
```bash
node hubspot-lead-list-info.js
```

### **5. Output & CSV Export**  
After execution, a CSV file named **`contacts.csv`** will be created in the project directory.  
It contains:  
- First Name  
- Last Name  
- Email  
- Company Domain  
- AI-Generated Company Description  

## **Error Handling & Debugging**  
- If API keys are incorrect or missing, the script will fail with an **authentication error**.  
- If a company website is not accessible, a fallback message **"Unable to retrieve description."** will be logged.  
- For detailed debugging, add `console.log(error)` inside the `catch` blocks.  
