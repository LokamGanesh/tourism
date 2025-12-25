# ☁️ Setting Up MongoDB Atlas (Cloud Database)

Since your local MongoDB is failing to start, the best solution is to use **MongoDB Atlas**. It is free, managed by MongoDB, and works without installing anything on your computer.

## Step 1: Create an Account
1.  Go to [MongoDB Atlas Registration](https://www.mongodb.com/cloud/atlas/register).
2.  Sign up with Google or your email.

## Step 2: Create a Cluster (Free)
1.  After login, you will be asked to "Build a Database".
2.  Select **M0 Free** (Shared) tier.
3.  Choose a provider (AWS) and a region close to you (e.g., in India, choose **Mumbai**).
4.  Click **Create Cluster**.

## Step 3: Create a Database User
1.  You will be prompted to "Security Quickstart".
2.  **Username**: `admin`
3.  **Password**: Create a simple password (e.g., `Admin123`). **Write this down!**
4.  Click **Create User**.
5.  Scroll down to "IP Access List".
6.  Click **"Add My Current IP Address"** OR allow access from anywhere (`0.0.0.0/0`) to avoid issues.
7.  Click **Finish and Close**.

## Step 4: Get Connection String
1.  On your dashboard, click the **Connect** button on your Cluster card.
2.  Choose **Drivers**.
3.  You will see a string like this:
    ```
    mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
    ```
4.  **Copy** this string.

## Step 5: Update Your Project
1.  Open the file `.env.local` in your project folder (`c:\planb\.env.local`).
2.  Find `MONGODB_URI`.
3.  Replace the value with the string you copied.
4.  **Important**: Replace `<password>` in the string with the actual password you set (e.g., `Admin123`).

**Example:**
```env
MONGODB_URI=mongodb+srv://admin:Admin123@cluster0.abcde.mongodb.net/jharkhand-tourism?retryWrites=true&w=majority
```

## Step 6: Initialize
Once you have saved the `.env.local` file:

1.  Open your terminal in VS Code.
2.  Run these commands:
    ```bash
    npm run init-db
    node scripts/seed-places.js
    ```
3.  If successful, you will see "Connected to database" and "Users created".
