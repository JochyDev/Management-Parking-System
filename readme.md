# Management Parking System

This project is a Management Parking System that allows you to manage parking reservations, occupancy, and user details. It provides a RESTful API for various use cases.

## Getting Started

### Prerequisites

- Node.js >= v18
- Npm (Node Package Manager)
- MySQL (for main database)
- MongoDB (for activity logs)

### Installation

1. Clone the project repository:

   ```
   git clone https://github.com/JochyDev/Management-Parking-System.git
   ```

2. Navigate to the project directory:

   ```
   cd management-parking-system
   ```
3. Navigate to the project directory:

   ```
   npm install
   ```

4. Copy the ```.env.template``` file and rename it to ```.env```. Fill in the required values for your environment.

5. Configure the database connections in the ```./src/config/db.config.js``` file based on the ```NODE_ENV``` value.

## Usage

### Starting the Server

Run the following command to start the server:
   
   ```
   npm start
   ```
Once the server is executed, go to the ```./src/server/server.js``` file within the connectionToMysql method, change the force property to ```false```

### API Endpoints:
[Click here to see postman collection](https://documenter.getpostman.com/view/16100812/2s9YCAQpkN)



## Running Tests
Run the following command to execute the tests:
   
   ```
   npm run test
   ```

Run the following command to get coverage report:
   
   ```
   npm run test:coverage
   ```

### Contributing
If you would like to contribute to this project, please follow these guidelines:

- Fork the project repository.
- Create a new branch for your feature or bugfix.
- Commit your changes and push them to your fork.
- Create a pull request with a detailed description of your changes.
