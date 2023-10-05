
# GastroMaster

## **How to Download the Project:**

**Navigate to the root folder:**

    cd root_folder

**Clone the repository:**

    git clone https://gitlab.com/yuriouverney/gastromaster.git

## How to Install the Project

**Navigate to the root folder:**

    cd root_folder

**Install dependencies:**

    npm install

**Navigate to the backend folder:**

    cd backend

**Install backend dependencies:**

    npm install

**Navigate to the frontend folder:**

    cd frontend

**Install frontend dependencies:**

    npm install

## How to Install the Database

**Ensure that MySQL 8 is installed and configure access in /backend/.env.developer. Then:**

    cd backend

**Run database migrations (creates tables and columns):**

    npm run db:migrate

**Seed the database with initial data:**

    npm run seed

## How to Run the Application

**Start the backend server:**

    cd backend
    npm start

**Start the frontend application:**

    cd frontend
    npm start

## Test User Accounts

Regular user: (login: usuario@usuario.com, password: 123456)

Manager: (login: gerente@gerente.com, password: 123456)

Administrator: (login: adm@adm.com, password: 123456)

## Note

Make sure to replace "root_folder" with the actual path to the project's root folder. Additionally, ensure that all prerequisites, such as Node.js, npm, and MySQL 8, are installed before running the installation and application commands.