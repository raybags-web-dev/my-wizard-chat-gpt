const axios = require('axios');
const request = require('request');
const fs = require('fs')

module.exports = {
    getStoppedJobs: (url) => {
        if (!url) return;
        let stoppedJobs = [];

        let doc = fetch(url).then(response => response.text()).then(html => {
            return new DOMParser().parseFromString(html, 'text/html');
        });
        doc.then(document => {
            document.querySelectorAll('tr').forEach(row => {
                if (row.querySelector('td').innerText === 'STOPPED') {
                    let jobId = row.querySelector('a').innerText;
                    stoppedJobs.push(Number(jobId));
                }
            });
        });

        return stoppedJobs;
    },

    getReviewIDs: async(url, pageNumber) => {
        try {
            const response = await axios.get(url);

            const data = response.data;

            const reviewIDs = data.match(/Review ID:\s+\d+/g).map((id) => id.replace('Review ID: ', ''));

            return reviewIDs;
        } catch (e) {
            console.log(e.message)
        }
    },
    getAllReviews: async(url, pageNumber) => {
        //if (!url || !pageNumber) return;
        let urlString = `${url}&page=${pageNumber}`;
        request(urlString, (error, response, body) => {
            if (error) {
                console.log('Error- ', error.message);
                return;
            }
            if (response.statusCode === 200) {
                const bodyJSON = JSON.parse(body);
                console.log(bodyJSON.data);
                fs.writeFileSync('reviews.json', JSON.stringify(bodyJSON))
            }
        })
    }
}