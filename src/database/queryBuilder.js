
export default class QueryBuilder {
    database;
    command = "";
    filters = {};
    bindings = [];

    constructor(db) {
        this.database = db;
        this.reset();
    }

    parse() {
        const commandString = this.command;
        let whereString = "";
        if (Object.keys(this.filters).length > 0) {
            let whereFilters = [];
            console.log(`Processing where filters: ${JSON.stringify(this.filters)}`);
            Object.entries(this.filters).forEach((filter) => {
                let key = filter[0];
                let val = filter[1];
                if (whereFilters.length > 0) {
                    whereFilters.push('AND');
                }
                whereFilters.push(`${key} = ?`);
                console.log(`Adding where binding: ${key}=${val}`);
                this.bindings.push(val);
            });

            console.log(`Where filters: ${JSON.stringify(whereFilters)}`);

            let whereFilterString = whereFilters.join(' ');
            whereString = `WHERE ${whereFilterString}`;
            console.log(`Where string: ${whereString}`);
        }

        let query = `${commandString} ${whereString}`.trim();
        console.log(`Query string ${query}`);
        let preparedStatement = this.database.prepare(query);
        console.log(`prepared builder: ${JSON.stringify(this)}`);
        if (this.bindings.length > 0) {
            preparedStatement = preparedStatement.bind(...this.bindings);
        }

        console.log(`prepared statement: ${JSON.stringify(preparedStatement)}`);
        return preparedStatement;
    }

    reset() {
        this.command = "";
        this.filters = {};
        this.bindings = [];
    }

    select(table, fields = []) {
        console.log(`Builder: Selecting from ${table} with fields: ${JSON.stringify(fields)}`);
        let selectFields = '*';
        if (fields.length > 0) {
            let selectFieldList = [];
            fields.forEach((field) => {
                selectFieldList.push('?');
                this.bindings.push(field);
            });
            selectFields = selectFieldList.join(',');
        }

        this.command = `SELECT ${selectFields} FROM ${table}`;
        return this;
    }

    insert(table, fields = [], values = []) {
        let setFieldString = fields.join(',');

        let setValues = [];
        values.forEach((value) => {
            setValues.push('?');
            this.bindings.push(value);
        });
        let setValueString = setValues.join(',');
        this.command = `INSERT INTO ${table} (${setFieldString}) VALUES (${setValueString})`;
        return this;
    }

    update(table, fields = [], values = []) {
        throw new Error("DELETE not implemented");
    }

    delete(table) {
        throw new Error("DELETE not implemented");
    }

    where(filters = {}) {
        const filterKeys = Object.entries(filters);
        filterKeys.forEach((filter) => {
            const filterKey = filter[0];
            const filterValue = filter[1];
            this.filters[filterKey] = filterValue;
        });

        return this;
    }
};