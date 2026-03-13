const express = require('express');
const app = express();
const path = require('path');

const crewMembers = [
  {
    id: 1,
    name: "Monkey D. Luffy",
    role: "Captain",
    bounty: 3000000000,
    devilFruit: "Hito Hito no Mi, Model: Nika",
    status: "active",
  },
  {
    id: 2,
    name: "Roronoa Zoro",
    role: "Swordsman",
    bounty: 1111000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 3,
    name: "Nami",
    role: "Navigator",
    bounty: 366000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 4,
    name: "Usopp",
    role: "Sniper",
    bounty: 500000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 5,
    name: "Vinsmoke Sanji",
    role: "Cook",
    bounty: 1032000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 6,
    name: "Tony Tony Chopper",
    role: "Doctor",
    bounty: 1000,
    devilFruit: "Hito Hito no Mi",
    status: "inactive",
  },
  {
    id: 7,
    name: "Nico Robin",
    role: "Archaeologist",
    bounty: 930000000,
    devilFruit: "Hana Hana no Mi",
    status: "active",
  },
  {
    id: 8,
    name: "Franky",
    role: "Shipwright",
    bounty: 394000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 9,
    name: "Brook",
    role: "Musician",
    bounty: 383000000,
    devilFruit: "Yomi Yomi no Mi",
    status: "active",
  },
  {
    id: 10,
    name: "Jinbe",
    role: "Helmsman",
    bounty: 1100000000,
    devilFruit: "None",
    status: "active",
  },
];


app.set('view engine', 'ejs');
app.set('views',__dirname + "/views");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));



app.use((req, res, next) => {
    const logString = `Request from: ${req.get('user-agent')} at ${new Date().toLocaleString()}`;
    console.log(logString);
    req.log = logString;
    next();
});


const verifyBounty = (req, res, next) => {
    const checkpoint = Math.floor(Math.random() * 2);
    if (checkpoint === 1) {
        next();
    } else {
        res.status(403).send("403 - The Marines have blocked your path. Turn back.");
    }
};



app.get('/', (req, res) => {
    res.render('index', { crew: crewMembers, title: 'The Crew' });
});

app.get('/crew', (req, res) => {
    res.render('crew', { crew: crewMembers, title: 'Crew Roster' });
});


app.get('/recruit', (req, res) => {
    res.render('recruit', { title: 'Recruit', errors: null, success:false });
});


app.post('/recruit', (req, res) => {
    const { applicantName, skill, role, message, sea, agreeTerms } = req.body;
    let errors = [];

   
    if (!applicantName || applicantName.trim() === "") errors.push("Name is required.");
    if (!skill || skill.trim() === "") errors.push("Skill is required.");
    if (!role || role === "Select a role") errors.push("Please select a valid role.");
    if (!message || message.trim() === "") errors.push("A message for Luffy is required.");
    if (!sea) errors.push("Please select your preferred sea.");
    if (!agreeTerms) errors.push("You must understand the risks of the Grand Line.");

    if (errors.length > 0) {
        return res.render('recruit', { title: 'Recruit', errors, success:false });
    }

    
    const newId = crewMembers.length + 1;
    crewMembers.push({
        id: newId,
        name: applicantName.trim(),
        role: role,
        bounty: 0,
        devilFruit: "Unknown",
        status: "pending"
    });
 
    res.render('recruit', { 
        title: 'Recruit', 
        errors: [], 
        success: true, 
        applicantName: applicantName, 
        applicantSkill: skill 
    });
});


app.get('/log-pose', verifyBounty, (req, res) => {
    res.render('logPose', { crew: crewMembers, log: req.log, title: 'Log Pose' });
});


app.get('/error-test', (req, res) => {
    throw new Error("Engine malfunction!");
});


app.use((req, res) => {
    res.status(404).render('404', { 
        title: 'Lost at Sea', 
        message: "404 - We couldn't find what you're looking for on the Grand Line." 
    });
});


app.use((err, req, res, next) => {
    res.status(500).send(`500 - Something went wrong on the Thousand Sunny: ${err.message}`);
});

app.listen(3000, () => console.log('Server is ruuning on port 3000'));