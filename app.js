const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});
const sns = new AWS.SNS();

const app = express();
app.use(express.json());

dotenv.config({
  path: path.join(__dirname, './.env')
});

app.listen(8000, () => {
  console.log(`Listening port 8000`);
});


//Get sns details
app.get('/mysns', (req, res) => res.send({"status":"Ok", sns}));

//Subscribe SNS topic
app.post('/subscribe', async(req, res) => {
  try {
    const params = {
      Protocol: 'Email',
      TopicArn: process.env.TOPIC_ARN,
      Endpoint: req.body.email
    };
    const result = await sns.subscribe(params).promise();
    return result
  } catch (error) {
    console.log(error);
    throw error;
  }  
});

//Publish to SNS topic
app.post('/publish', async(req, res) => {
  try {
    const params = {
      Subject: req.body.subject,
      TopicArn: process.env.TOPIC_ARN,
      Message: req.body.message
    };
    const result = await sns.publish(params).promise();
    return result
  } catch (error) {
    console.log(error);
    throw error;
  }  
});


