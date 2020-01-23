# insight-journal
The program is a realization of the project assignments for DH2642 Interaction Programming and Dynamic Web course at Kungliga Tekniska Högskolan (Stockholm), done in collaboration with Saga Harnesk.

The user submits daily notes about the mood. Upon finishing the day, the messages are sent to IBM Personalty Insights API that evaluates the user’s personality based on their text. The user can view the history of all the notes and evaluations (in a form of a calendar), and see the general overview of the personality (analysis of all the texts).

The project is done in JavaScript, with the use of React. The user's data and the messages are stored in Google Firebase Cloud Firestore database. Cookies are supported with localStorage.

The deployed app is available at https://insight-journal-project.web.app/

Prerequisites:

It will be thee easiest to access the app running npm:
1. To install it, follow the instructions at https://docs.npmjs.com/getting-started/installing-node
2. Run `npm install` through the terminal in the root of the repository
3. Run `npm install -g firebase-tools` for firebase functionality
4. Run npm start through the terminal - this will start the webserver and the application should be displayed in the browser window. Alternatively it can be opened through http://localhost:3000

Examplary user with a history of records, presenting full functionality is available under:
- Username: 1
- Password: 1
