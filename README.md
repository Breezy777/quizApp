***************************Quiz for !Dummies************************

About********************************
This app is made with express framework in the backend and React in the front end.
To Run it it, Node js is required. App is Not production ready.

Quiz has two modes: Relaxed mode and Timed mode. Player choose.

Quiz has its questions stored in api/question.json. Can be edited to add more or customize(see installation section)
Questions are randomized.
App offers 2 options in the way of retrieving questions:
- 1 request(all questions are stored on client), Disabled. See how to edit code to Enable in installation section of this file.
- 1 request per question. Default used.

The scoring mechanism save scores in api/scores.json file.

Questions are randomized and every question is treated equal; only previously-unseen one are generated until all are showed.
Equal display time for all! :D


Installation*****************************
Please follow these steps to run it on your own development env.

Once downloaded you should have the main app folder(quiz-app), with two child directories
in it: api and client.

api is the backend part of the app.
client is the front end.

Run npm-instal in each of the child directories to install dependencies.

After installing, to make sure the two(back and front) communicate, run the express server
on port 3002(port can be changed in package.json of the api folder).

Quiz questions and answers can be edited in api/questions.json. There is no limit in the number of
answers per question. Make sure to follow the array of object model. Only one good answer per question is
supported. The good answer has its isCorrect:true.
Questions label can be 1,2,3... or a,b,c or else.

Questions order does not matter, randomization happens with the picker system.
