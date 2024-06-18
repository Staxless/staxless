#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const chalk = require("chalk");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Create a new microservice directory.
 * @param {string} name - The name of the microservice.
 * @param {string} language - The language the microservice is written in.
 */
function createMicroserviceDirectory(name, language) {
  const microservicesDir = findMicroservicesDir(process.cwd());
  if (!microservicesDir) {
    console.error(chalk.red("Error: Microservices directory not found."));
    process.exit(1);
  }

  const microserviceDir = path.join(microservicesDir, name);

  if (fs.existsSync(microserviceDir)) {
    rl.question(
      chalk.yellow(
        `A microservice or directory with the name '${name}' already exists. Do you want to overwrite it? (y/n): `,
      ),
      (answer) => {
        if (answer.toLowerCase() === "y") {
          createNewMicroservice(name, language, microserviceDir);
        } else {
          console.log(chalk.blue("Operation canceled."));
          rl.close();
        }
      },
    );
  } else {
    createNewMicroservice(name, language, microserviceDir);
  }
}

/**
 * Create a new microservice with the given name and language at the specified directory.
 * @param {string} name - The name of the microservice.
 * @param {string} language - The language the microservice is written in.
 * @param {string} microserviceDir - The directory to create the microservice in.
 */
function createNewMicroservice(name, language, microserviceDir) {
  // Create microservice directory
  fs.mkdirSync(microserviceDir);
  process.chdir(microserviceDir);

  // Create dockerfiles directory
  const dockerfilesDir = path.join(microserviceDir, "dockerfiles");
  fs.mkdirSync(dockerfilesDir);
  fs.writeFileSync(
    path.join(dockerfilesDir, `${name}.Dockerfile.dev`),
    generateDockerfile(language),
  );

  // Create secrets directory with template .env
  const secretsDir = path.join(microserviceDir, "secrets");
  fs.mkdirSync(secretsDir);
  fs.writeFileSync(
    path.join(secretsDir, ".env"),
    `# ${name} microservice environment variables`,
  );

  console.log(
    chalk.green(
      `Microservice ${name} created successfully in ${microserviceDir}.`,
    ),
  );

  // Update root Dockerfile.dev to include the new microservice
  updateDockerComposeDevFile(name);
}

/**
 * Update the docker-compose.dev.yml file in the root directory to include the new microservice.
 * @param {string} name - The name of the microservice.
 */
function updateDockerComposeDevFile(name) {
  const rootDockerComposeDevFile = path.join(
    process.cwd(),
    "docker-compose.dev.yml",
  );

  const serviceConfig = `
  ${name}:
    build:
      context: ./microservices/${name}
      dockerfile: dockerfiles/${name}.Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./microservices/${name}:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
  `.trim();

  fs.writeFileSync(rootDockerComposeDevFile, serviceConfig);

  console.log(
    chalk.green(
      `Updated docker-compose.dev.yml to include ${name} microservice.`,
    ),
  );
}

/**
 * Find the microservices directory by recursively searching from the current directory.
 * @param {string} directory - The directory to start the search from.
 * @returns {string|null} The path to the microservices directory if found, otherwise null.
 */
function findMicroservicesDir(directory) {
  const parentDir = path.resolve(directory, "..");
  if (fs.existsSync(path.join(parentDir, "microservices"))) {
    return path.join(parentDir, "microservices");
  }
  if (parentDir === "/") return null;
  return findMicroservicesDir(parentDir);
}

/**
 * Generate Dockerfile contents based on the specified language.
 * @param {string} language - The language the microservice is written in.
 * @returns {string} The Dockerfile contents.
 */
function generateDockerfile(language) {
  switch (language) {
    case "js":
      return `# Dockerfile for Node.js microservice\nFROM node:14-alpine\nCOPY . /app\nWORKDIR /app\nCMD ["node", "main.js"]`;
    case "py":
      return `# Dockerfile for Python microservice\nFROM python:3.9-alpine\nCOPY . /app\nWORKDIR /app\nCMD ["python", "main.py"]`;
    case "ts":
      return `# Dockerfile for TypeScript microservice\nFROM node:14-alpine\nCOPY . /app\nWORKDIR /app\nRUN npm install\nCMD ["npm", "start"]`;
    default:
      return `# Dockerfile for ${language} microservice\n# Add instructions here`;
  }
}

/**
 * Prompt the user for microservice details and create the microservice.
 */
function promptAndCreateMicroservice() {
  rl.question(chalk.yellow("Enter microservice name: "), (name) => {
    rl.question(
      chalk.yellow("Enter language (e.g., js, py, ts, etc.): "),
      (language) => {
        createMicroserviceDirectory(name, language);
      },
    );
  });
}

module.exports = {
  promptAndCreateMicroservice,
};

// Run the function if this script is executed directly from the command line
if (require.main === module) {
  promptAndCreateMicroservice();
}
