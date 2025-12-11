import Environment from "../bootstrap/bootstrap";

class Database {

    async select(table, fields = [], where = {}) {
        console.log(`Attempting SELECT`);
        const database = Environment.instance.USER_FORUMS_DB;
        let selectQuery = database
            .prepare(`
                SELECT ?
                FROM ?
                ?
            `);
        let bindings = [];
        bindings[0] = '*';
        if (fields.length > 0) {
            bindings[0] = fields.join(',');
        }
        bindings[1] = table;
        bindings[2] = "";
        if (Object.keys(where).length > 0) {
            let whereFilters = "";
            Object.entries(where).forEach((filter) => {
                let key = filter[0];
                let val = filter[1];
                if (whereFilters.length > 0) {
                    whereFilters += ' AND ';
                }
                whereFilters += `${key} = ${val}`;
            });
            bindings[2] = `WHERE ${whereFilters}`;
        }
        selectQuery = selectQuery.bind(...bindings);

        console.log(`Running insert: ${JSON.stringify(selectQuery)}`);
        const results = await selectQuery.run();
        console.log(`Returning database result from insert: ${JSON.stringify(results)}`);
        if (!results.success) {
            console.error("Error inserting records into Database!");
            throw new Error("Failed to insert records into DB!");
        }

        return results.results;
    }

    async insert(table, username, password) {
        console.log(`Attempting INSERT: Table=${table}, User=${username}, Pass=nah`);
        const database = Environment.instance.USER_FORUMS_DB;
        let insertQuery = database.prepare(`INSERT INTO ?1 (username, password) VALUES (?2, ?3)`);
        insertQuery = insertQuery.bind(table, username, password);

        console.log(`Running insert: ${JSON.stringify(insertQuery)}`);
        const results = await insertQuery.run();
        console.log(`Returning database result from insert: ${JSON.stringify(results)}`);
        if (!results.success) {
            console.error("Error inserting records into Database!");
            throw new Error("Failed to insert records into DB!");
        }

        return results.results;
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