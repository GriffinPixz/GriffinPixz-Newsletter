const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
const port = process.env.PORT || 3500;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");

    console.log("------------------------------");
    console.log("🚀🌕 GriffinPixz is a cutie smoothiepie.");
    console.log("------------------------------");
});

app.post("/", (req, res) => {
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;

    console.log("* First Name => " + firstName);
    console.log("* Last Name => " + lastName);
    console.log("* Email => " + email);

    console.log("******************************");

    // ********** Mailchimp API Call : Audience **********
    mailchimp.setConfig({
        apiKey: "3286a7b7ab4f28f1ef5aca89881d1ef2-us14",
        server: "us14",
    });
    
    const list_id = "5f4274072d"

    const run = async () => {
        
        const response = await mailchimp.lists.batchListMembers(list_id, {
            members: [
                {
                    email_address: email,  
                    status: "subscribed",
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName
                    }
                }
            ],
            update_existing: false,
        });
    
        console.log(response);
        // console.log(JSON.stringify(response));

        console.log("******************************");
        if (response.errors.length) {
            res.sendFile(__dirname + "/failure.html");
            // throw new Error(response.errors);
            console.log("Error: " + response.errors[0].error);
            console.log("Error Code: " + response.errors[0].error_code);
        } else {
            res.sendFile(__dirname + "/success.html");
            console.log("POST request is successfull. There is no error.");
        }
        
    };

    run().catch(errors => console.log(errors));
    // ***************************************************
});

app.get("/success", (req, res) => { 
    res.sendFile(__dirname + "/success.html");
});

app.get("/failure", (req, res) => { 
    res.sendFile(__dirname + "/failure.html");
});

app.post("/failure", (req, res) => { 
    res.redirect("/");
});


app.listen(port, () => { 
    console.log("🦄✨ GriffinPixz Server is listening to port => http://localhost:" + port + "/");
});


// ----------------------------------------------------------------------
// API Key
// 3286a7b7ab4f28f1ef5aca89881d1ef2-us14

// Server Parameter
// https://us14.admin.mailchimp.com/

// Audience List ID
// 5f4274072d
// ----------------------------------------------------------------------

// ********** Mailchimp API Call : Example **********
// mailchimp.setConfig({
//     apiKey: "3286a7b7ab4f28f1ef5aca89881d1ef2-us14",
//     server: "us14",
// });

// async function run() {
//     const response = await mailchimp.ping.get();
//     console.log(response);
// }
// run();
// *************************************************

// const data = {
//     members: {
//         email_address: email,
//         status: "subscribed",
//         merge_fields: {
//             FNAME: firstName,
//             LNAME: lastName
//         }
//     }
// }
// const jsonData = JSON.stringify(data);

// ----------------------------------------------------------------------
// ** 1) only make GET request when we want data from an external resorce
// https.get(url, () => { });

// ** 2) what do we do when we want to POST data to an external resource??
// const url = "https://us14.admin.mailchimp.com/lists/5f4274072d";
// const options = {
//     method: "POST",
//     auth: "GriffinPixz:3286a7b7ab4f28f1ef5aca89881d1ef2-us14"
// }
// const request = https.request(url, options, (response) => {
//     res.on("data", (data) => {
//         console.log(JSON.parse(data));
//     });
// });
// request.write(jsonData);
// request.end();
// ----------------------------------------------------------------------