import Environment from "../bootstrap/bootstrap";

class Database {

    async select(fields, table) {

    }

    async query(query, bindings = []) {
        console.log(`Attempting generic query: ${JSON.stringify(bindings)}`);
        const database = Environment.instance.USER_FORUMS_DB
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