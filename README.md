# **Interview Scheduler**
Single page application that allows users to book and cancel interviews. It uses WebSockets in the API server for real-time communication and CirlceCI for a continuous integration process.<br />
Assignment for [Lighthouse Labs.](https://www.lighthouselabs.ca/)<br />
You can try the app [here.](https://frosty-varahamihira-3f7f04.netlify.app/)<br /><br />

### **Some of the application functionality**<br />

#### - A user can browse through all the days and see booked and available interview spots.

<img src="docs/Browse through the different days.gif" width="640" height="320"/><br /><br />

#### - A user can book an interview.

<img src="docs/user can book an interview.gif" width="640" height="320"/><br /><br />


#### - A user can edit an interview.

<img src="docs/user can edit an interview.gif" width="640" height="320"/><br /><br />


#### - A user can delete an interview.

<img src="docs/user can delete an interview.gif" width="640" height="320"/><br /><br />


### **Setup**

1. Fork and clone this repository.<br />
2. Install dependencies with `npm install`.<br />
3. Fork and clone [the API server](https://github.com/lighthouse-labs/scheduler-api) and follow the instructions on the README file to set up the local database and run it.<br />
4. Run the Webpack Development Server with `npm start`.<br />

### **Dependencies**

- Axios
- Classnames
- Normalize.css
- React
- React-dom
- React-scrips
