
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
            Object.entries(this.filters).forEach((filter) => {
                let key = filter[0];
                let val = filter[1];
                if (whereFilters.length > 0) {
                    whereFilters.push('AND');
                }
                whereFilters.push(`${key} = ?`);
                this.bindings.push(val);
            });


            let whereFilterString = whereFilters.join(' ');
            whereString = `WHERE ${whereFilterString}`;
        }

        let query = `${commandString} ${whereString}`.trim();
        let preparedStatement = this.database.prepare(query);
        if (this.bindings.length > 0) {
            preparedStatement = preparedStatement.bind(...this.bindings);
        }

        return preparedStatement;
    }

    reset() {
        this.command = "";
        this.filters = {};
        this.bindings = [];
    }

    select(table, fields = []) {
        let selectFieldString = '*';
        if (fields.length > 0) {
            selectFieldString = fields.join(',');
        }

        this.command = `SELECT ${selectFieldString} FROM ${table}`;
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
        this.command = `DELETE FROM ${table}`;
        return this;
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