# ✨ String Analysis RESTful API

This project provides a robust Node.js Express API for performing deep analysis on strings, managing a collection of analyzed strings, and offering advanced filtering capabilities, including natural language query processing. It's designed for efficiency and ease of integration, making complex string operations accessible via a RESTful interface.

## 🚀 Features

- **Comprehensive String Analysis**: Automatically calculates length, identifies palindromes, counts words, determines unique characters, generates SHA256 hashes, and provides a character frequency map.
- **Persistent In-Memory Storage**: Stores analyzed strings for quick retrieval and querying (though in a real-world scenario, this would be a database).
- **Standard CRUD Operations**: API endpoints for creating (analyzing), retrieving by value, listing all, and deleting strings.
- **Advanced Filtering**: Supports filtering strings based on properties like palindrome status, length, word count, and character containment using query parameters.
- **Natural Language Processing (NLP) Filter**: An innovative endpoint that allows users to filter strings using descriptive natural language queries (e.g., "strings longer than 5 characters containing 'a'").
- **Robust Input Validation**: Middleware ensures all incoming data and query parameters meet expected formats and constraints, enhancing API reliability.
- **Health Check Endpoint**: Provides a simple `/health` endpoint for monitoring application status.

## 🛠️ Technologies Used

| Technology     | Description                                              | Link                                                             |
| :------------- | :------------------------------------------------------- | :--------------------------------------------------------------- |
| **Node.js**    | JavaScript runtime built on Chrome's V8 engine.          | [nodejs.org](https://nodejs.org/)                                |
| **Express.js** | Fast, unopinionated, minimalist web framework.           | [expressjs.com](https://expressjs.com/)                          |
| **`dotenv`**   | Loads environment variables from a `.env` file.          | [npmjs.com/package/dotenv](https://www.npmjs.com/package/dotenv) |
| **`morgan`**   | HTTP request logger middleware for node.js.              | [npmjs.com/package/morgan](https://www.npmjs.com/package/morgan) |
| **`crypto`**   | Node.js built-in module for cryptographic functionality. | [nodejs.org/api/crypto.html](https://nodejs.org/api/crypto.html) |

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### ⬇️ Installation

1.  **Clone the Repository**:
    ```bash
    git clone <https://github.com/mhkaycey/String-Analyzer>
    cd String-Analyzer # Or your project directory name
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Environment Variables**:
    Create a `.env.development.local` file in the project root based on the examples below.

### ⚙️ Environment Variables

The project requires specific environment variables to run correctly. Create a `.env.development.local` file in the root directory and populate it with the following:

```dotenv
PORT=3000
SERVER_URL=http://localhost:
```

- **`PORT`**: The port number on which the Express server will listen.
- **`SERVER_URL`**: The base URL of the server (e.g., `http://localhost:`). Used for console logs.

### ▶️ Usage

To start the development server:

```bash
npm run dev
```

The server will typically run on `http://localhost:3000` (or your configured `PORT`).

To start the production server:

```bash
npm start
```

## 📚 API Documentation

### Base URL

`http://localhost:PORT/strings` (replace `PORT` with your configured port, e.g., `3000`)

### Endpoints

#### `POST /strings`

Analyzes a given string and stores its properties in the system. If the string already exists, a conflict error is returned.

**Request**:

```json
{
  "value": "Your string to analyze"
}
```

**Response**:

```json
{
  "id": "e2fdc15c0e18987b2866c1f0b0941cfb1c31327170889270559d43d1a8c8e1e7",
  "value": "hello world",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 8,
    "word_count": 2,
    "sha256_hash": "e2fdc15c0e18987b2866c1f0b0941cfb1c31327170889270559d43d1a8c8e1e7",
    "character_frequency_map": {
      "h": 1,
      "e": 1,
      "l": 3,
      "o": 2,
      " ": 1,
      "w": 1,
      "r": 1,
      "d": 1
    }
  },
  "created_at": "2023-10-27T10:00:00.000Z"
}
```

**Errors**:

- `400 Bad Request`: Missing "value" field in request body.
- `409 Conflict`: String already exists in the system.
- `422 Unprocessable Entity`: Invalid data type for "value" (must be string).
- `500 Internal server error`.

#### `GET /strings/{string_value}`

Retrieves the analysis of a specific string. The `string_value` should be URL-encoded.

**Request**:
(Path parameter)
`GET /strings/hello%20world`

**Response**:

```json
{
  "id": "e2fdc15c0e18987b2866c1f0b0941cfb1c31327170889270559d43d1a8c8e1e7",
  "value": "hello world",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 8,
    "word_count": 2,
    "sha256_hash": "e2fdc15c0e18987b2866c1f0b0941cfb1c31327170889270559d43d1a8c8e1e7",
    "character_frequency_map": {
      "h": 1,
      "e": 1,
      "l": 3,
      "o": 2,
      " ": 1,
      "w": 1,
      "r": 1,
      "d": 1
    }
  },
  "created_at": "2023-10-27T10:00:00.000Z"
}
```

**Errors**:

- `404 Not Found`: String does not exist in the system.
- `500 Internal server error`.

#### `GET /strings`

Retrieves all stored strings with optional filtering capabilities based on query parameters.

**Request**:
(Query parameters)
`GET /strings?is_palindrome=true&min_length=3&contains_character=a`

**Response**:

```json
{
  "data": [
    {
      "id": "2c219662f277121b6a3804825d1945f315a6e885d51f2167d71f7623916962f3",
      "value": "madam",
      "properties": {
        "length": 5,
        "is_palindrome": true,
        "unique_characters": 3,
        "word_count": 1,
        "sha256_hash": "2c219662f277121b6a3804825d1945f315a6e885d51f2167d71f7623916962f3",
        "character_frequency_map": {
          "m": 2,
          "a": 2,
          "d": 1
        }
      },
      "created_at": "2023-10-27T10:05:00.000Z"
    }
  ],
  "count": 1,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 3,
    "contains_character": "a"
  }
}
```

**Errors**:

- `400 Bad Request`:
  - Invalid value for `is_palindrome` (must be `true` or `false`).
  - Invalid value for `min_length` or `max_length` (must be positive integer).
  - `min_length` cannot be greater than `max_length`.
  - Invalid value for `word_count` (must be positive integer).
  - Invalid value for `contains_character` (must be a single character).
- `500 Internal server error`.

#### `GET /strings/filter-by-natural-language`

Filters strings based on a natural language query string.

**Request**:
(Query parameter)
`GET /strings/filter-by-natural-language?query=strings%20longer%20than%205%20characters%20containing%20the%20letter%20a%20and%20are%20palindromes`

**Response**:

```json
{
  "data": [
    {
      "id": "2c219662f277121b6a3804825d1945f315a6e885d51f2167d71f7623916962f3",
      "value": "madam",
      "properties": {
        "length": 5,
        "is_palindrome": true,
        "unique_characters": 3,
        "word_count": 1,
        "sha256_hash": "2c219662f277121b6a3804825d1945f315a6e885d51f2167d71f7623916962f3",
        "character_frequency_map": {
          "m": 2,
          "a": 2,
          "d": 1
        }
      },
      "created_at": "2023-10-27T10:05:00.000Z"
    }
  ],
  "count": 1,
  "interpreted_query": {
    "original": "strings longer than 5 characters containing the letter a and are palindromes",
    "parsed_filters": {
      "min_length": 6,
      "contains_character": "a",
      "is_palindrome": true
    }
  }
}
```

**Errors**:

- `400 Bad Request`:
  - Missing "query" parameter.
  - Unable to parse natural language query.
- `422 Unprocessable Entity`: Conflicting filters (e.g., `min_length` cannot be greater than `max_length`).
- `500 Internal server error`.

#### `DELETE /strings/{string_value}`

Deletes a specific string from the system. The `string_value` should be URL-encoded.

**Request**:
(Path parameter)
`DELETE /strings/hello%20world`

**Response**:
`204 No Content` (successful deletion, no body returned).
**Errors**:

- `404 Not Found`: String does not exist in the system.
- `500 Internal server error`.

## 🤝 Contributing

We welcome contributions to enhance this project! If you're interested in improving the String Analysis API, please follow these guidelines:

- **Fork the repository** 🍴.
- **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name`.
- **Make your changes**, ensuring they adhere to the project's coding style.
- **Write clear, concise commit messages** explaining your changes.
- **Push your branch** to your forked repository.
- **Open a Pull Request** to the `main` branch of this repository, describing your changes in detail.

## 📄 License

This project is licensed under the ISC License - see the `package.json` file for details.

## ✍️ Author

**Egede Kelechukwu Mark**

- **Email**: kelechimark041@gmail.com
- **LinkedIn**: [Kelechi Mark](https://www.linkedin.com/in/mhkaycey/)
- **X**: [@mhkaycey](https://x.com/mhkaycey)

---

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue?logo=express)](https://expressjs.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](https://example.com/your-ci-build-status)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
