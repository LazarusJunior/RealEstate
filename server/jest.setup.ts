// Set up environment variables for tests
process.env.DATABASE_URL = "postgres://test_user:test_pass@localhost:5432/test_db";
process.env.JWT_SECRET = "test_secret";

//extend Jest's expect with custom matchers
import "@testing-library/jest-dom";
