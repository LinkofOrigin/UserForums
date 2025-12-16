import Environment from "../bootstrap/bootstrap";
import QueryBuilder from "./queryBuilder";

class Database {

    async select(table, fields = [], where = {}) {
        console.log(`Attempting SELECT`);
        const database = Environment.instance.USER_FORUMS_DB;
        let queryBuilder = new QueryBuilder(database);
        queryBuilder.select(table, fields).where(where);
        let selectQuery = queryBuilder.parse();

        console.log(`Running SELECT: ${JSON.stringify(selectQuery)}`);
        let results = null;
        try {
            results = await selectQuery.run();
        }
        catch (error) {
            console.error(`Received error during db select call: ${JSON.stringify(error)}`);
            throw error;
        }

        console.log(`Returning database result from select: ${JSON.stringify(results)}`);
        if (!results.success) {
            console.error("Error selecting records from Database!");
            throw new Error("Failed to select records from DB!");
        }

        return results.results;
    }

    async insert(table, fields = [], values = [], where = {}) {
        const database = Environment.instance.USER_FORUMS_DB;
        let queryBuilder = new QueryBuilder(database);
        queryBuilder.insert(table, fields, values).where(where);
        let insertQuery = queryBuilder.parse();

        console.log(`Running INSERT: ${JSON.stringify(insertQuery)}`);

        let results;
        try {
            results = await insertQuery.run();
        }
        catch (error) {
            console.error(`Received error during db insert call: ${JSON.stringify(error)}`);
            throw error;
        }

        console.log(`Returning database result from insert: ${JSON.stringify(results)}`);
        if (!results.success) {
            console.error("Error inserting records into Database!");
            throw new Error("Failed to insert records into DB!");
        }

        return results.results;
    }

    async update(table, fields = [], values = [], where = {}) {

    }

    async delete(table, where = {}) {

    }

    async query(query, bindings = []) {
        console.log(`Attempting generic query: ${JSON.stringify(bindings)}`);
        const database = Environment.instance.USER_FORUMS_DB;
        let preparedQuery = database.prepare(query);
        if (bindings.length > 0) {
            preparedQuery = preparedQuery.bind(...bindings);
        }

        console.log(`Running prepared query: ${JSON.stringify(preparedQuery)}`);
        const results = await preparedQuery.run();
        console.log(`Returning database result from query: ${JSON.stringify(results)}`);
        if (!results.success) {
            console.error("Error retrieving records from Database!");
            throw new Error("Failed to retrieve records from DB!");
        }

        return results.results;
    }
}

const DBInstance = new Database();

export default DBInstance;