# Community Connector (SYNCS Hack 2025)

A platform that aims to connect the elderly in hospitals and caring organizations with verified university students for services such as lessons, pet companionship, and cooking/meal prep—building practical help and meaningful connection to solve aging problems.

——Group: Matcha_Kitty



## Getting Start

### structure

---
````
├── frontend # use next.js(react) + tallwind
│ ├── app
│   ├── about
│   ├── form
│   ├── login
│   └── servier
│ ├── components
│   └── Card
│ └── public
│   └── image
├── backend # use react + node.js + express
│ ├── server.js (link to mongoDB)
│ └── ...
├── README.md # Project documentation
└── candidates(for testing).json # an example data that can be import to MongoDB
````
### Environment Requirements
- Front-End:
-- Next.js(React)
- Back-End:
-- Node.js `>= 18.0.0`
-- MongoDB (Local MongoDB or MongoDB Compass GUI recommended) 

### Install Dependencies
```bash
cd frontend
npm install ...
```
```bash
cd backend
npm install ...
```
#### Key dependencies include:
##### Front-End:
- **react** Web framework
- **react-dom** Web framework(DOM)
- **next** 
##### Back-End: 
- **express** Web framework
- **mongoose** MongoDB ODM
- **cors** Cross-origin resource sharing

## Running the Project
### Start the Database
Open the MongoDB Compass and connect localhost:27017.
For testing, you can import the example data (candidates(for testing).json) in MongoDB.

### Start the Back-end

```bash
cd backend
node server.js
```
By default it runs at http://localhost:5000

### Start the Front-end
```bash
cd frontend
npm run dev
```
By default it runs at http://localhost:3000
