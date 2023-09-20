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

### API Endpoints
1. Reserve a Parking Spot: 
- Endpoint: POST /api/reserve
- Description: Reserve a parking spot for a specific vehicle at a given date and time.
- Request Body: JSON with vehicle details and reservation date and time.
- Response: Details of the reservation.

2. Check Parking Occupancy: 
- Endpoint: GET /api/occupancy
- Description: Get the current occupancy status of the parking lot.
- Response: List of parking spots with occupancy details.

3. Update User Details
- Endpoint: PUT /api/user/{id}
- Description: Update user details such as name, email, or phone number.
- Request Body: JSON with updated user details.
- Response: Updated user details.

4. Access Parking Logs
- Endpoint: GET /api/logs
- Description: Access activity logs of the parking system, including reservations, cancellations, vehicle entries, and exits.
- Response: List of activity logs.

## Running Tests
Switch to the jest-testing branch in the project repository:

   ```
   git checkout jest-testing
   ```


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
