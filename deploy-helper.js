// JobKhoj Deployment Helper Script
// This script helps you prepare your project for deployment

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

console.log(`${colors.blue}\n==== JobKhoj Deployment Helper ====${colors.reset}\n`);

// Function to run shell commands
function runCommand(command, cwd = '.') {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`${colors.yellow}Warning: ${stderr}${colors.reset}`);
      }
      if (stdout) {
        console.log(`${colors.green}${stdout}${colors.reset}`);
      }
      resolve(stdout);
    });
  });
}

// Function to create a sample .env file
function createSampleEnvFiles() {
  try {
    // Backend sample .env
    const backendEnvSample = `# Backend .env configuration
# Replace these values with your actual credentials
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/jobkhoj?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_here_32_characters_minimum
NODE_ENV=production
`;

    fs.writeFileSync(
      path.join(__dirname, 'backend', '.env.sample'),
      backendEnvSample
    );
    console.log(`${colors.green}✓ Created backend/.env.sample${colors.reset}`);

    // Frontend sample .env
    const frontendEnvSample = `# Frontend .env configuration
# Replace with your Render backend URL
VITE_API_URL=https://your-backend-service.onrender.com/api
`;

    fs.writeFileSync(
      path.join(__dirname, 'frontend', '.env.sample'),
      frontendEnvSample
    );
    console.log(`${colors.green}✓ Created frontend/.env.sample${colors.reset}`);

  } catch (err) {
    console.error(`${colors.red}Error creating sample .env files: ${err.message}${colors.reset}`);
  }
}

// Function to check dependencies
async function checkDependencies() {
  console.log(`${colors.cyan}\nChecking dependencies...${colors.reset}`);
  
  try {
    // Check if git is installed
    await runCommand('git --version');
    console.log(`${colors.green}✓ Git is installed${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}✗ Git is not installed. Please install Git: https://git-scm.com/downloads${colors.reset}`);
  }

  try {
    // Check if node is installed
    await runCommand('node --version');
    console.log(`${colors.green}✓ Node.js is installed${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}✗ Node.js is not installed. Please install Node.js: https://nodejs.org/en/download/${colors.reset}`);
  }

  try {
    // Check if npm is installed
    await runCommand('npm --version');
    console.log(`${colors.green}✓ npm is installed${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}✗ npm is not installed. Please install npm: https://www.npmjs.com/get-npm${colors.reset}`);
  }
}

// Main function
async function main() {
  console.log(`${colors.cyan}Preparing your project for deployment...${colors.reset}\n`);
  
  // Check if .gitignore exists
  if (fs.existsSync(path.join(__dirname, '.gitignore'))) {
    console.log(`${colors.green}✓ .gitignore file already exists${colors.reset}`);
  } else {
    console.log(`${colors.yellow}Warning: .gitignore file not found. Please create one before pushing to GitHub.${colors.reset}`);
  }

  // Check if README.md exists
  if (fs.existsSync(path.join(__dirname, 'README.md'))) {
    console.log(`${colors.green}✓ README.md file already exists${colors.reset}`);
  } else {
    console.log(`${colors.yellow}Warning: README.md file not found. Please create one before pushing to GitHub.${colors.reset}`);
  }

  // Create sample .env files
  createSampleEnvFiles();

  // Check dependencies
  await checkDependencies();

  console.log(`${colors.blue}\n==== Deployment Preparation Complete ====${colors.reset}`);
  console.log(`${colors.yellow}\nNext Steps:`);
  console.log(`${colors.cyan}1. Complete the steps in DEPLOYMENT_GUIDE.md`);
  console.log(`2. Create accounts on GitHub, MongoDB Atlas, Render, and Vercel`);
  console.log(`3. Push your project to GitHub`);
  console.log(`4. Deploy your backend to Render`);
  console.log(`5. Deploy your frontend to Vercel`);
  console.log(`6. Test your live application${colors.reset}\n`);
}

// Run the main function
main().catch(err => {
  console.error(`${colors.red}Deployment preparation failed: ${err.message}${colors.reset}`);
  process.exit(1);
});